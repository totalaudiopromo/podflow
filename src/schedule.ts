/**
 * podflow schedule — the human loop (macOS).
 *
 * Installs a launchd LaunchAgent that runs `podflow digest --scheduled` weekly
 * (or daily), so the digest arrives without anyone remembering to run a CLI.
 * The --scheduled flag makes digest end with a macOS notification, which is
 * where a human actually notices it.
 *
 * launchd gotchas handled here (hard-won elsewhere):
 * - Jobs get a minimal environment: PATH must be set explicitly in the plist.
 * - The provider API key comes from ~/.podflow/config.json (see
 *   PodflowConfig.apiKey), NOT shell env — launchd never sees your shell.
 * - Absolute paths only: node binary (process.execPath) + resolved CLI script.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { execFileSync } from 'child_process';

const LABEL = 'dev.podflow.digest';
const PLIST_PATH = path.join(os.homedir(), 'Library', 'LaunchAgents', `${LABEL}.plist`);
const LOG_DIR = path.join(os.homedir(), '.podflow', 'logs');

export interface ScheduleOptions {
  daily: boolean;
  time: string; // HH:MM
  maxEpisodes: number;
}

function xmlEscape(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildPlist(opts: ScheduleOptions): string {
  const [hourRaw, minuteRaw] = opts.time.split(':');
  const hour = parseInt(hourRaw, 10);
  const minute = parseInt(minuteRaw ?? '0', 10);
  if (Number.isNaN(hour) || hour < 0 || hour > 23 || Number.isNaN(minute) || minute < 0 || minute > 59) {
    throw new Error(`Invalid --time "${opts.time}" — use HH:MM (24h), e.g. 08:00`);
  }

  const nodeBin = process.execPath;
  const cliScript = path.resolve(process.argv[1]);

  const calendar = opts.daily
    ? `      <dict>
        <key>Hour</key><integer>${hour}</integer>
        <key>Minute</key><integer>${minute}</integer>
      </dict>`
    : `      <dict>
        <key>Weekday</key><integer>1</integer>
        <key>Hour</key><integer>${hour}</integer>
        <key>Minute</key><integer>${minute}</integer>
      </dict>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>${LABEL}</string>
  <key>ProgramArguments</key>
  <array>
    <string>${xmlEscape(nodeBin)}</string>
    <string>${xmlEscape(cliScript)}</string>
    <string>digest</string>
    <string>--max-episodes</string>
    <string>${opts.maxEpisodes}</string>
    <string>--scheduled</string>
  </array>
  <key>StartCalendarInterval</key>
  <array>
${calendar}
  </array>
  <key>EnvironmentVariables</key>
  <dict>
    <key>PATH</key><string>/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin</string>
    <key>HOME</key><string>${xmlEscape(os.homedir())}</string>
  </dict>
  <key>StandardOutPath</key><string>${xmlEscape(path.join(LOG_DIR, 'schedule.log'))}</string>
  <key>StandardErrorPath</key><string>${xmlEscape(path.join(LOG_DIR, 'schedule.log'))}</string>
  <key>RunAtLoad</key><false/>
</dict>
</plist>
`;
}

function launchctl(args: string[]): string {
  try {
    return execFileSync('launchctl', args, { encoding: 'utf-8' });
  } catch (err) {
    return (err as { stdout?: string; message: string }).stdout ?? '';
  }
}

export function installSchedule(opts: ScheduleOptions): { plistPath: string; summary: string } {
  if (process.platform !== 'darwin') {
    throw new Error('podflow schedule uses launchd and is macOS-only for now.');
  }
  fs.mkdirSync(LOG_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(PLIST_PATH), { recursive: true });

  // Re-arm cleanly if already installed.
  removeSchedule({ quiet: true });

  fs.writeFileSync(PLIST_PATH, buildPlist(opts));
  launchctl(['bootstrap', `gui/${process.getuid?.() ?? 501}`, PLIST_PATH]);

  const cadence = opts.daily ? `daily at ${opts.time}` : `weekly (Mondays at ${opts.time})`;
  return {
    plistPath: PLIST_PATH,
    summary: `Digest will run ${cadence}, up to ${opts.maxEpisodes} episodes, and notify you when it lands.`,
  };
}

export function removeSchedule({ quiet = false } = {}): boolean {
  const existed = fs.existsSync(PLIST_PATH);
  if (existed) {
    launchctl(['bootout', `gui/${process.getuid?.() ?? 501}/${LABEL}`]);
    fs.rmSync(PLIST_PATH);
  } else if (!quiet) {
    // nothing installed — caller reports
  }
  return existed;
}

export function scheduleStatus(): { installed: boolean; loaded: boolean; plistPath: string } {
  const installed = fs.existsSync(PLIST_PATH);
  const loaded = installed && launchctl(['list']).includes(LABEL);
  return { installed, loaded, plistPath: PLIST_PATH };
}

/** macOS notification — the "delivery" half of the human loop. */
export function notifyDigest(processed: number, guests: number, ideas: number, outputPath: string): void {
  if (process.platform !== 'darwin') return;
  const body =
    processed === 0
      ? 'No new episodes since last run.'
      : `${processed} episodes → ${guests} guests, ${ideas} ideas. Digest updated.`;
  const script = `display notification ${JSON.stringify(body)} with title "podflow" subtitle ${JSON.stringify(path.basename(outputPath))}`;
  try {
    execFileSync('osascript', ['-e', script]);
  } catch {
    // Notifications are best-effort; the digest file is still written.
  }
}
