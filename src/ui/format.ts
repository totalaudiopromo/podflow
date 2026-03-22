import chalk from 'chalk';
import ora from 'ora';
import { truncate } from './theme.js';

// ── Logo ─────────────────────────────────────────────────────────────
export const LOGO_LINES = [
  '    ___  ___  ___/ / _/ /__ _    __',
  '   / _ \\/ _ \\/ _  / _/ / _ \\ |/|/ /',
  '  / .__/\\___/\\_,_/_//_/\\___/__,__/',
  ' /_/',
];

const DIAMOND = chalk.hex('#a78bfa')('\u25C7');
const CHECK = chalk.green('\u2713');
const CROSS = chalk.red('\u2717');

function num(n: number): string {
  return n.toLocaleString('en-GB');
}

// ── Exports ──────────────────────────────────────────────────────────

export function intro(version: string): void {
  console.log('');
  for (let i = 0; i < LOGO_LINES.length - 1; i++) {
    console.log(chalk.hex('#a78bfa')(LOGO_LINES[i]));
  }
  console.log(
    `${chalk.hex('#a78bfa')(LOGO_LINES[LOGO_LINES.length - 1])}   ${chalk.dim(`v${version}`)}`
  );
  console.log('');
}

export function step(message: string): void {
  console.log(`  ${message}`);
}

export function stepComplete(message: string): void {
  console.log(`  ${DIAMOND} ${message}`);
}

export function blank(): void {
  console.log('');
}

export function divider(): void {
  console.log(chalk.dim(`  ${'\u2500'.repeat(50)}`));
}

export function heading(text: string): void {
  console.log(`  ${chalk.bold(text)}`);
}

export function stat(label: string, value: string | number, unit?: string): void {
  const valStr = typeof value === 'number' ? num(value) : value;
  const unitStr = unit ? ` ${chalk.dim(unit)}` : '';
  console.log(`  ${chalk.dim(label.padEnd(20))} ${valStr}${unitStr}`);
}

export function tierRow(tier: number, count: number): void {
  const tierColour =
    tier === 1
      ? chalk.hex('#a78bfa')
      : tier === 2
        ? chalk.hex('#06b6d4')
        : tier === 3
          ? chalk.dim
          : chalk.hex('#6b7280');
  console.log(`  ${tierColour(`Tier ${tier}`)}${' '.repeat(16)}${num(count).padStart(6)} ${chalk.dim('episodes')}`);
}

export function episodeRow(podcast: string, title: string, meta?: string): void {
  const p = truncate(podcast, 24).padEnd(24);
  const t = truncate(title, 40);
  const m = meta ? `  ${chalk.dim(meta)}` : '';
  console.log(`    ${chalk.dim(p)} ${t}${m}`);
}

export function batchHeader(batchNum: number, totalBatches: number, count: number): void {
  console.log('');
  console.log(
    `  ${chalk.hex('#a78bfa')(`Batch ${batchNum}/${totalBatches}`)} ${chalk.dim(`(${count} episodes)`)}`
  );
}

export function batchResult(guests: number, ideas: number, tokens: { input: number; output: number }): void {
  const parts = [
    `${num(guests)} guests`,
    `${num(ideas)} ideas`,
    chalk.dim(`${num(tokens.input)} in / ${num(tokens.output)} out`),
  ];
  console.log(`    ${CHECK} ${parts.join(chalk.dim('  \u00B7  '))}`);
}

export function batchError(message: string): void {
  console.log(`    ${CROSS} ${chalk.red(message)}`);
}

export function costEstimate(cost: string, provider: string): void {
  console.log(`  ${chalk.dim('Estimated cost')}  ${chalk.hex('#a78bfa')(cost)} ${chalk.dim(`(${provider})`)}`);
}

export function runSummary(stats: {
  processed: number;
  guests: number;
  ideas: number;
  cost: string;
}): void {
  const parts = [
    chalk.hex('#a78bfa')(`${num(stats.processed)} processed`),
    chalk.hex('#06b6d4')(`${num(stats.guests)} guests`),
    chalk.green(`${num(stats.ideas)} ideas`),
  ];
  console.log(`  ${parts.join(chalk.dim('  \u00B7  '))}`);
  console.log(`  ${chalk.dim(`Cost: ${stats.cost}`)}`);
}

export function outputPath(filePath: string): void {
  console.log(`  ${chalk.dim('\u2192')} ${chalk.hex('#a78bfa')(filePath)}`);
}

export function outro(elapsedMs: number): void {
  const secs = (elapsedMs / 1000).toFixed(1);
  console.log(`  ${chalk.dim(`Done in ${secs}s`)}`);
  console.log('');
}

export function warn(message: string): void {
  console.log(`  ${chalk.yellow('\u26A0')} ${chalk.yellow(message)}`);
}

export function error(message: string): void {
  console.log(`  ${CROSS} ${chalk.red(message)}`);
}

export function hint(message: string): void {
  console.log(`    ${chalk.dim(message)}`);
}

export function nextSteps(steps: Array<{ cmd: string; desc: string }>): void {
  if (steps.length === 0) return;
  console.log(chalk.dim('  Next steps'));
  for (const s of steps) {
    console.log(`    ${chalk.hex('#a78bfa')(s.cmd.padEnd(42))} ${chalk.dim(s.desc)}`);
  }
}

export function providerInfo(provider: string, model: string): void {
  console.log(`  ${chalk.dim('Provider')}  ${provider} ${chalk.dim(`(${model})`)}`);
}

export function modeInfo(mode: string): void {
  const colour =
    mode === 'DRY RUN' ? chalk.yellow : mode === 'BACKFILL' ? chalk.hex('#a78bfa') : chalk.green;
  console.log(`  ${chalk.dim('Mode')}      ${colour(mode)}`);
}

export function cacheInfo(lastRun: string, processed: number, guests: number, ideas: number): void {
  console.log(
    `  ${chalk.dim('Cache')}     ${num(processed)} episodes ${chalk.dim('\u00B7')} ${num(guests)} guests ${chalk.dim('\u00B7')} ${num(ideas)} ideas`
  );
  console.log(`  ${chalk.dim('Last run')}  ${lastRun}`);
}

/**
 * Spinner that sits inside the rail.
 * Call .succeed(text) to replace with a diamond checkpoint.
 */
export function createSpinner(text: string) {
  const spinner = ora({
    text,
    prefixText: ' ',
    spinner: 'dots',
  });
  return {
    start() {
      spinner.start();
      return this;
    },
    update(text: string) {
      spinner.text = text;
    },
    succeed(msg: string) {
      spinner.stop();
      stepComplete(msg);
    },
    fail(msg: string) {
      spinner.stop();
      error(msg);
    },
    stop() {
      spinner.stop();
    },
  };
}
