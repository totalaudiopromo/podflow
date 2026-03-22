/**
 * Shared TUI theme: glyphs, colours, and formatting helpers.
 */

export const GLYPH = {
  check: '\u2713',
  cross: '\u2717',
  tilde: '~',
  diamond: '\u25C7',
  bar: '\u2502',
  dot: '\u00B7',
  arrow: '\u2192',
  blockFull: '\u2588',
  blockLight: '\u2591',
  headphones: '\u266B',
} as const;

export const COLOUR = {
  brand: '#a78bfa',     // violet-400 (podcast / listen vibe)
  accent: '#06b6d4',    // cyan-500
  valid: '#22c55e',     // green-500
  invalid: '#ef4444',   // red-500
  warn: '#eab308',      // yellow-500
  muted: '#6b7280',     // gray-500
  dimmed: '#374151',    // gray-700
  white: '#f9fafb',     // gray-50
} as const;

export function truncate(str: string, len: number): string {
  if (str.length <= len) return str;
  return str.slice(0, len - 1) + '\u2026';
}

export function formatElapsed(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}
