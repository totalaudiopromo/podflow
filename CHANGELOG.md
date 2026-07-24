# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-07-24

### Added

- **Podflow Web Application (`apps/web`)**: Next.js App Router landing page (`/`) with interactive pitching simulator, host match scoring cards, 2-column hero grid, and live opportunity dashboard (`/dashboard`).
- **Shared TAP UI Library (`packages/ui`)**: Integrated Total Audio Promo design system package with **Studio Purple** (`#A855F7`) theme tokens, TAP family banner (`TapBanner`), navbar (`MarketingNav`), and dashboard primitives (`StatCard`, `ActionTile`, `PageHeader`, `Card`).
- **Multi-Color Visual Hierarchy**: Balanced multi-accent scheme using Studio Purple for brand elements, TAP Mint Green (`#00F59B`) for match scores & active signals, Warm Amber (`#F59E0B`) for extracted topic tags, and Cyan (`#06B6D4`) for pitch outreach status.

## [0.2.0] - 2026-06-15

### Added

- Native MCP server support (`podflow mcp`) with 6 tools for AI agent integration (`search_episodes`, `get_guest`, `get_ideas`, `list_follow_worthy`, `get_stats`, `ingest_feed`).
- macOS launchd automatic background scheduling (`podflow schedule`).

## [0.1.0] - 2026-03-22

### Added

- `digest` command for processing episodes and generating markdown digest
- `init` command for creating config at `~/.podflow/`
- `subs` command for listing podcast subscriptions with tier labels
- `stats` command for cache statistics
- Apple Podcasts SQLite database reader (local-first, no cloud sync)
- Multi-provider AI extraction via Vercel AI SDK (Anthropic, OpenAI, Google, Ollama)
- Incremental cache with delta cost tracking (~/.podflow/cache.json)
- Tier-based podcast prioritisation (1-4, tier 4 skipped by default)
- Configurable interests for relevance scoring
- Guest cross-referencing across episodes
- Polished TUI with chalk, commander, ora
- `--dry-run` flag for previewing without API calls
- `--backfill` flag for processing all episodes
