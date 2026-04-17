```
    ___  ___  ___/ / _/ /__ _    __
   / _ \/ _ \/ _  / _/ / _ \ |/|/ /
  / .__/\___/\_,_/_//_/\___/__,__/
 /_/
```

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg)](https://nodejs.org)

**Your podcast listening, working for you.** Extract guests, ideas, and insights from your Apple Podcasts library using AI.

---

## Quick Start

```bash
npx podflow init                          # create config
npx podflow digest --dry-run              # preview episodes
npx podflow digest --max-episodes 10      # process 10 episodes
```

Or install globally:

```bash
npm install -g podflow
podflow digest
```

## Commands

| Command | Description |
| ------- | ----------- |
| `podflow init` | Create config at `~/.podflow/` |
| `podflow digest` | Process new episodes (default) |
| `podflow digest --dry-run` | Preview without API calls |
| `podflow digest --backfill` | Process all episodes |
| `podflow subs` | List podcast subscriptions |
| `podflow stats` | Cache statistics |

## Why podflow?

- **Local-first.** Reads the Apple Podcasts SQLite database on your Mac. No cloud sync, no account needed.
- **Your AI key, your choice.** Supports Anthropic, OpenAI, Google, and Ollama (local, free).
- **Incremental.** Only processes new episodes. Run it weekly, costs pennies.
- **Configurable interests.** Scores everything against what matters to *you*.

## How It Works

1. Reads the Apple Podcasts SQLite database
2. Prioritises episodes by podcast tier (you configure which podcasts matter)
3. Batches episodes and sends to your chosen AI provider
4. Extracts guests, ideas, people mentioned, and relevance scores
5. Caches results incrementally (interrupted runs resume)
6. Generates a markdown digest

## Configuration

After `podflow init`, edit `~/.podflow/config.json`:

```json
{
  "about": "A founder building developer tools",
  "interests": [
    {
      "name": "Customer Acquisition",
      "keywords": ["pricing", "growth", "retention", "PLG"],
      "why": "Growing from 0 to first paying customers"
    },
    {
      "name": "AI & Agents",
      "keywords": ["AI", "LLM", "agent", "automation"],
      "why": "Building AI-powered features"
    }
  ],
  "provider": "anthropic",
  "model": "claude-haiku-4-5-20251001",
  "outputPath": "./podflow-digest.md"
}
```

### Podcast Tiers

Edit `~/.podflow/podcasts.json` to prioritise specific podcasts:

```json
{
  "podcasts": {
    "My Favourite Podcast": { "tier": 1, "extractGuests": true, "extractIdeas": true },
    "Entertainment Only": { "tier": 4, "extractGuests": false, "extractIdeas": false }
  },
  "defaults": { "tier": 3, "extractGuests": true, "extractIdeas": true }
}
```

Tiers 1-3 are processed by default. Tier 4 is skipped (use `--include-all` to override).

## Global Flags

```
--dry-run               Preview without API calls
--backfill              Process all episodes
--max-episodes <n>      Limit episodes (default: 50)
--tier <n>              Only process specific tier (1-4)
--include-all           Include tier 4
--provider <name>       anthropic, openai, google, ollama
--model <name>          Override model name
--output <path>         Output file path
--recent <days>         Days of history (default: 365)
--verbose               Show episode details
-q, --quiet             Suppress output except errors
```

## AI Providers

| Provider | Env Var | Cost / 1,000 eps | Best For |
| -------- | ------- | ----------------- | -------- |
| Anthropic (Haiku) | `ANTHROPIC_API_KEY` | ~$2 | Best quality/cost ratio |
| OpenAI (GPT-4o-mini) | `OPENAI_API_KEY` | ~$0.50 | Cheapest cloud option |
| Google (Gemini Flash) | `GOOGLE_GENERATIVE_AI_API_KEY` | ~$0.25 | Budget option |
| Ollama (local) | None | Free | Privacy, no API key |

```bash
podflow digest --provider openai --model gpt-4o-mini
podflow digest --provider ollama --model llama3.2
```

## Output

Generates a markdown digest with:

- **People to Follow** -- guests flagged as worth following, with roles, companies, and social links
- **Ideas by Topic** -- actionable insights grouped by your configured interest areas
- **High Relevance** -- episodes scored 7+ for relevance to your work
- **Recent Insights** -- last 30 days of extracted intelligence
- **Guest Index** -- every guest across all episodes, cross-referenced

## Cost

| Scenario | Episodes | Cost (Haiku) |
| -------- | -------- | ------------ |
| Weekly run | ~20 | ~$0.03 |
| Monthly | ~80 | ~$0.12 |
| Full backfill | 1,000 | ~$2.00 |

## Requirements

- macOS with Apple Podcasts (Sync Library enabled)
- Node.js 20+
- An API key for your chosen provider (or Ollama for local)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for dev setup and guidelines.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release history.

## Part of Total Audio

Tools I build for music PR, by [Chris Schofield](https://x.com/chrisschouk). Part of [Total Audio Promo](https://totalaudiopromo.com).

| Project | Description |
|---------|-------------|
| [TAP](https://totalaudiopromo.com) | Campaign management for music PR agencies |
| [totalaud.io](https://totalaud.io) | Release planning for emerging artists |
| [SpotCheck](https://spotcheck.cc) | Spotify playlist validation |
| [Newsjack](https://newsjack.cc) | Music industry newsjacking |
| [Podflow](https://github.com/totalaudiopromo/podflow) | Podcast intelligence for music PR |
| [Sink](https://github.com/totalaudiopromo/sink-cli) | Contact data hygiene CLI |

Questions? Reach me on [X/@chrisschouk](https://x.com/chrisschouk) or [info@totalaudiopromo.com](mailto:info@totalaudiopromo.com).

## Licence

MIT
