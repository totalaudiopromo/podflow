# podflow

Your podcast listening, working for you.

Reads your Apple Podcasts library, runs episodes through AI, and extracts **guests to follow**, **ideas to act on**, and **relevance scores** for your interests. Outputs a structured markdown digest.

**~$2 for 1,000 episodes** using Claude Haiku. Or free with local models via Ollama.

## Why

You listen to hundreds of episodes a year. Guests, ideas, and insights get lost the moment you move on to the next one. Podflow turns passive listening into structured intelligence you can actually use.

## What makes it different

- **Local-first** -- reads the Apple Podcasts SQLite database on your Mac. No cloud sync, no account needed
- **Your AI key, your choice** -- supports Anthropic, OpenAI, Google, and Ollama (local, free)
- **Incremental** -- only processes new episodes. Run it weekly, costs pennies
- **Configurable interests** -- scores everything against what matters to *you*

## Quick start

```bash
# Install
npm install -g podflow

# Create config
podflow init

# Edit your interests
nano ~/.podflow/config.json

# Set your API key
export ANTHROPIC_API_KEY=sk-ant-...

# Preview what would be processed
podflow digest --dry-run

# Process 10 episodes
podflow digest --max-episodes 10

# Full backfill
podflow digest --backfill
```

## Configuration

After running `podflow init`, edit `~/.podflow/config.json`:

```json
{
  "about": "A founder building developer tools",
  "interests": [
    {
      "name": "Customer Acquisition",
      "keywords": ["pricing", "growth", "retention", "PLG", "marketing"],
      "why": "Growing from 0 to first paying customers"
    },
    {
      "name": "AI & Agents",
      "keywords": ["AI", "LLM", "agent", "automation", "Claude"],
      "why": "Building AI-powered features"
    }
  ],
  "provider": "anthropic",
  "model": "claude-haiku-4-5-20251001",
  "outputPath": "./podflow-digest.md"
}
```

### Podcast tiers

Edit `~/.podflow/podcasts.json` to prioritise specific podcasts:

```json
{
  "podcasts": {
    "My Favourite Podcast": {
      "tier": 1,
      "extractGuests": true,
      "extractIdeas": true
    },
    "Entertainment Only": {
      "tier": 4,
      "extractGuests": false,
      "extractIdeas": false
    }
  },
  "defaults": {
    "tier": 3,
    "extractGuests": true,
    "extractIdeas": true
  }
}
```

Tiers 1-3 are processed by default. Tier 4 is skipped (use `--include-all` to override).

## AI providers

| Provider | Env var | Cost per 1,000 episodes | Best for |
|----------|---------|------------------------|----------|
| Anthropic (Haiku) | `ANTHROPIC_API_KEY` | ~$2 | Best quality/cost ratio |
| OpenAI (GPT-4o-mini) | `OPENAI_API_KEY` | ~$0.50 | Cheapest cloud option |
| Google (Gemini Flash) | `GOOGLE_GENERATIVE_AI_API_KEY` | ~$0.25 | Budget option |
| Ollama (local) | None | Free | Privacy, no API key needed |

Override at runtime:

```bash
podflow digest --provider openai --model gpt-4o-mini
podflow digest --provider ollama --model llama3.2
```

## Output

Podflow generates a markdown digest with:

- **People to Follow** -- guests flagged as worth following, with roles, companies, and social links
- **Ideas by Topic** -- actionable insights grouped by your configured interest areas
- **High Relevance** -- episodes scored 7+ for relevance to your work
- **Recent Insights** -- last 30 days of extracted intelligence
- **Guest Index** -- every guest across all episodes, cross-referenced

## How it works

1. Reads the Apple Podcasts SQLite database (`~/Library/Group Containers/.../MTLibrary.sqlite`)
2. Prioritises episodes by podcast tier (you configure which podcasts matter most)
3. Batches episodes (5 per API call) and sends to your chosen AI provider
4. Extracts guests, ideas, people mentioned, and relevance scores
5. Caches results incrementally (interrupted runs resume where they left off)
6. Generates a markdown digest

## Requirements

- macOS with Apple Podcasts app (Sync Library enabled)
- Node.js 20+
- An API key for your chosen provider (or Ollama for local)

## Cost

| Scenario | Episodes | Cost (Haiku) |
|----------|----------|-------------|
| Weekly run | ~20 | ~$0.03 |
| Monthly | ~80 | ~$0.12 |
| Full backfill | 1,000 | ~$2.00 |

## License

MIT
