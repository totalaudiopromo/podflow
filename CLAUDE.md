# podflow

AI-powered podcast digest CLI. Extracts guests, ideas, and insights from your Apple Podcasts
library using Claude/OpenAI/Gemini/Ollama. Published on npm as `podflow` (v0.2.0). Part of the
Total Audio Promo agent-native suite — TAP (`totalaudiopromo.com`) is the flagship product;
podflow is a standalone public tool that also serves as an MCP server for other agents.

## Stack

TypeScript + ESM, built with tsup, Node >= 20. Single package (no monorepo).

## Commands that matter

```bash
pnpm dev          # run src/cli.ts directly via tsx (no build step)
pnpm build        # tsup → dist/cli.js (ESM)
pnpm typecheck    # tsc --noEmit
pnpm test         # vitest run
```

CLI commands (via `podflow <cmd>`):

- `init` — interactive setup wizard; writes `~/.podflow/config.json` (permissions 0600)
- `digest` — process new episodes (add `--dry-run` to preview, `--backfill` for all)
- `subs` — list subscriptions
- `stats` — cache statistics
- `schedule` — install/remove a macOS launchd weekly digest job with push notification
- `mcp` — start the MCP server (stdio); entry point is `src/cli.ts`

## MCP server

`src/cli.ts` doubles as the MCP server entrypoint (`podflow mcp`). Agents connect via stdio.

## Publish flow (npm)

Package is published as `podflow` (no scope). The pre-publish hook runs tests + build
(`prepublishOnly` in package.json is not set here — build manually before publishing).

**2FA gotcha**: interactive `npm publish` prompts for a one-time code even with `--otp`, which
blocks in non-interactive environments. Use a granular **automation token** (npm account →
Access Tokens → Generate New Token → Automation) in `~/.npmrc` as
`//registry.npmjs.org/:_authToken=<automation-token>`. That token bypasses the 2FA prompt.
Always verify the token type before a release attempt — this has blocked publishes before.

## House standards

UK spelling, GBP currency, `feat:`/`fix:` commit prefixes. Calm professional tone.
