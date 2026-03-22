# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
- Polished TUI with chalk, commander, ora (smslant logo, diamond checkpoints, validation rows, spinners)
- `--dry-run` flag for previewing without API calls
- `--backfill` flag for processing all episodes
- `--quiet` flag for scripted usage
- `--verbose` flag for detailed episode output
