# podflow — AI-Powered Podcast Intelligence

> Extract guest profiles, core ideas, and key takeaways from Apple Podcasts libraries and RSS feeds using local AI or cloud models.

---

## Overview

**Podflow** is a developer-first tool and podcast marketing assistant. It operates both as an open-source local CLI engine (`podflow`) and as a cloud platform with automated RSS feed tracking, speaker diarization, and semantic search.

### Key Features
- **Apple Podcasts Local Sync:** Directly parses macOS local SQLite podcast library with zero audio file uploads.
- **Guest Profile Miner:** Extracts bios, roles, social links, and key topics mentioned by speakers across episodes.
- **Actionable Key Insights:** Uses Gemini and Claude AI adapters to extract concrete takeaways and summaries.
- **Open Source CLI Core:** 100% private, native execution on macOS/Linux/Windows with bring-your-own API key or local Ollama/Whisper support.

---

## Getting Started with Local CLI

Install globally using NPM:
```bash
npm install -g podflow
```

Run local library sync:
```bash
podflow sync --local
```

### CLI Arguments
- `--local`: Run fully offline using local Whisper models and local Ollama.
- `--api-key <key>`: Supply a Anthropic, Google, or OpenAI API key.
- `--output <dir>`: Custom destination directory for generated Markdown digest files.

---

## Pricing Tiers

1. **Local CLI Core ($0/forever)**
   - macOS Apple Podcasts Local DB Sync
   - Bring Your Own API Key (BYOK)
   - Output directly to Local Markdown

2. **Pro Listener ($15/month)**
   - Automated Cloud RSS Feed Subscriptions
   - Semantic Search across catalog
   - Hosted AI compute (No API key needed)

3. **PR & Creator Suite ($79/month)**
   - Mention alerts for 10 keywords
   - Automated guest booking email extraction
   - Native Total Audio Promo export

---

## Machine-Readable Resources & Agent Endpoints

- [Agent Skills Index](https://podflow.cc/.well-known/agent-skills/index.json)
- [MCP Server Card](https://podflow.cc/.well-known/mcp/server-card.json)
- [API Catalog](https://podflow.cc/.well-known/api-catalog)
- [Auth Documentation](https://podflow.cc/auth.md)
