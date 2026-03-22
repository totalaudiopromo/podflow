import chalk from 'chalk';
import ora from 'ora';
import { truncate } from './theme.js';

// ── Brand ────────────────────────────────────────────────────────────
const V = chalk.hex('#a78bfa');
const C = chalk.hex('#06b6d4');
const DOT = chalk.dim('  \u00B7  ');

// ── Logo ─────────────────────────────────────────────────────────────
export const LOGO_LINES = [
  '    ___  ___  ___/ / _/ /__ _    __',
  '   / _ \\/ _ \\/ _  / _/ / _ \\ |/|/ /',
  '  / .__/\\___/\\_,_/_//_/\\___/__,__/',
  ' /_/',
];

const DIAMOND = V('\u25C7');
const CHECK = chalk.green('\u2713');
const CROSS = chalk.red('\u2717');
const TILDE = chalk.yellow('~');

function num(n: number): string {
  return n.toLocaleString('en-GB');
}

// ── Core ─────────────────────────────────────────────────────────────

export function intro(version: string): void {
  console.log('');
  console.log(V(LOGO_LINES[0]));
  console.log(`${V(LOGO_LINES[1])}   ${chalk.dim(`v${version}`)}`);
  console.log(V(LOGO_LINES[2]));
  console.log(V(LOGO_LINES[3]));
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
  console.log(chalk.dim(`  ${'\u2500'.repeat(44)}`));
}

// ── Validation rows (matches sink's validationRow) ───────────────────

export function validationRow(
  status: 'ok' | 'fail' | 'warn',
  label: string,
  count: number,
  unit: string,
): void {
  const icon = status === 'ok' ? CHECK : status === 'fail' ? CROSS : TILDE;
  const countStr = num(count).padStart(6);
  console.log(`  ${icon} ${label.padEnd(18)}${chalk.dim(countStr)} ${chalk.dim(unit)}`);
}

// ── Episode rows (matches sink's contactTable) ───────────────────────

export function episodeRow(
  status: 'ok' | 'fail' | 'warn',
  podcast: string,
  title: string,
  detail?: string,
): void {
  const icon = status === 'ok' ? CHECK : status === 'fail' ? CROSS : TILDE;
  const p = truncate(podcast, 22).padEnd(22);
  const t = truncate(title, 30).padEnd(30);
  const d = detail ? ` ${detail}` : '';
  console.log(`  ${icon} ${p} ${chalk.dim(t)}${d}`);
}

// ── Extraction score (matches sink's qualityScore) ───────────────────

export function extractionScore(guests: number, ideas: number, episodes: number): void {
  const perEp = episodes > 0 ? (guests + ideas) / episodes : 0;
  const score = Math.min(Math.round(perEp * 20), 100);
  const colour = score >= 70 ? chalk.green : score >= 40 ? chalk.yellow : chalk.red;
  console.log(`  Extraction: ${colour(score + '%')}`);
}

// ── Transform summary (matches sink's transformSummary) ──────────────

export function transformSummary(
  inputCount: number,
  stats: { guests: number; ideas: number; cost: string },
): void {
  const parts = [
    V(`${num(stats.guests)} guests`),
    chalk.green(`${num(stats.ideas)} ideas`),
  ];
  console.log(`  ${num(inputCount)} episodes ${chalk.dim('\u2192')} ${parts.join(chalk.dim(', '))}`);

  const actions: string[] = [];
  if (stats.cost) actions.push(stats.cost);
  if (actions.length > 0) {
    console.log(`  ${chalk.dim(actions.join(DOT))}`);
  }
}

// ── Batch progress ───────────────────────────────────────────────────

export function batchResult(
  guests: number,
  ideas: number,
  tokens: { input: number; output: number },
): void {
  const parts = [
    `${num(guests)} guests`,
    `${num(ideas)} ideas`,
    chalk.dim(`${num(tokens.input)}/${num(tokens.output)} tok`),
  ];
  console.log(`    ${CHECK} ${parts.join(DOT)}`);
}

export function batchError(message: string): void {
  console.log(`    ${CROSS} ${chalk.red(message)}`);
}

// ── Output ───────────────────────────────────────────────────────────

export function outputPath(filePath: string): void {
  console.log(`  ${chalk.dim('\u2192')} ${V(filePath)}`);
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
    console.log(`    ${V(s.cmd.padEnd(36))} ${chalk.dim(s.desc)}`);
  }
}

export function stat(label: string, value: string | number, unit?: string): void {
  const valStr = typeof value === 'number' ? num(value) : value;
  const unitStr = unit ? ` ${chalk.dim(unit)}` : '';
  console.log(`  ${chalk.dim(label.padEnd(18))}${valStr}${unitStr}`);
}

/**
 * Spinner that sits inside the rail.
 */
export function createSpinner(text: string) {
  const spinner = ora({ text, prefixText: ' ', spinner: 'dots' });
  return {
    start() { spinner.start(); return this; },
    update(t: string) { spinner.text = t; },
    succeed(msg: string) { spinner.stop(); stepComplete(msg); },
    fail(msg: string) { spinner.stop(); error(msg); },
    stop() { spinner.stop(); },
  };
}
