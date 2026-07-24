# podflow

AI-powered podcast digest CLI and podcast guest pitching platform for music PR. Extracts guests, ideas, and interview insights from podcast libraries using Claude/OpenAI/Gemini/Ollama. Part of the Total Audio Promo agent-native suite — TAP (`totalaudiopromo.com`) is the flagship product; Podflow shares the TAP UI architecture, design tokens (`@totalaudiopromo/ui`), and Studio Purple identity.

## Stack & Architecture

pnpm monorepo workspace containing:
- `.` (root CLI): TypeScript + ESM built with tsup, Node >= 20. Published on npm as `podflow` (v0.2.0).
- `packages/ui`: Shared Total Audio Promo design system tokens (`tokens.css`), Tailwind preset (`tailwind-preset.cjs`), and React marketing + app primitives.
- `apps/web`: Next.js App Router web application (`/` landing page hero & interactive simulator, `/dashboard` app shell and opportunities feed).

## Commands that matter

```bash
pnpm dev                      # run CLI directly via tsx
pnpm --filter @podflow/web dev # run Next.js web application on port 3010
pnpm typecheck                # typecheck root CLI, packages/ui, and apps/web
pnpm test                     # vitest run
```

CLI commands (via `podflow <cmd>`):
- `init` — interactive setup wizard; writes `~/.podflow/config.json` (permissions 0600)
- `digest` — process new episodes (add `--dry-run` to preview, `--backfill` for all)
- `subs` — list subscriptions
- `stats` — cache statistics
- `schedule` — install/remove a macOS launchd weekly digest job with push notification
- `mcp` — start the MCP server (stdio); entry point is `src/cli.ts`

## Brand Identity & Design System

- **Brand Accent**: **Studio Purple** (`#A855F7` / `purple-500`) with TAP Mint Green (`#00F59B` / `emerald-400`) for high-relevance match scores and Warm Amber (`#F59E0B`) for extracted topic tags.
- **Container Width Standard**: `max-w-6xl` (1152px) for primary layout grids (Banner, Nav, Hero, Features, Pricing, Footer); `max-w-5xl` (1024px) for secondary focus sections (How It Works, Simulator, FAQ).

## MCP server

`src/cli.ts` doubles as the MCP server entrypoint (`podflow mcp`). Agents connect via stdio.

## Publish flow (npm)

Package is published as `podflow` (no scope). The pre-publish hook runs tests + build.
Use an automation token in `~/.npmrc` to bypass 2FA prompts in automated environments.

## House standards

UK spelling, GBP currency, `feat:`/`fix:` commit prefixes. Calm professional tone. No AI buzzwords or filler prose.
