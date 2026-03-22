# Contributing to podflow

Thanks for your interest in contributing. This guide covers what you need to get started.

## Dev Setup

```bash
git clone https://github.com/chrisschofield/podflow.git
cd podflow
pnpm install
pnpm build
```

## Scripts

| Command | What it does |
| ------- | ------------ |
| `pnpm build` | Compile to `dist/` via tsup |
| `pnpm dev` | Run directly via tsx |
| `pnpm typecheck` | Type-check without emitting |

## Running Locally

After building:

```bash
node dist/cli.js digest --dry-run
node dist/cli.js subs
node dist/cli.js stats
```

Or via tsx (no build needed):

```bash
pnpm dev digest --dry-run
```

## Code Style

- TypeScript strict mode
- UK spelling in user-facing text (colour, prioritise, licence)
- No emojis in code or output
- Commits use `feat:` / `fix:` / `docs:` / `chore:` prefixes

## Pull Requests

1. Fork the repo and create a branch from `main`
2. Make your changes
3. Run `pnpm typecheck` -- must pass
4. Open a PR with a clear description of what changed and why

Keep PRs focused. One feature or fix per PR.

## Project Structure

```
src/
  cli.ts              CLI entry point (Commander)
  types.ts            Shared types
  cache.ts            Incremental cache (~/.podflow/cache.json)
  ai/
    extractor.ts      AI extraction (Vercel AI SDK, multi-provider)
  config/
    index.ts          Config loader (~/.podflow/config.json)
    prioritiser.ts    Episode tier scoring and filtering
  db/
    apple-podcasts.ts Apple Podcasts SQLite reader
  output/
    markdown.ts       Digest markdown generator
  ui/
    format.ts         Terminal UI (chalk, ora, format helpers)
    theme.ts          Colour palette, glyphs, formatting utils
```

## Questions?

Open an issue. Happy to help.
