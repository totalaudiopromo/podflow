---
name: podcast-library-miner
description: Extract guest profiles, ideas, and takeaways from macOS Apple Podcasts SQLite library or public RSS feeds using Podflow.
type: tool
version: 0.2.0
---

# Podcast Library Miner Skill

This skill allows AI agents to interface with the Podflow engine to mine podcast episodes for guest biographies, action items, and claims.

## Usage
Agents can run local CLI commands or call MCP server tools:
```bash
podflow sync --local --output ./digest
```

## Input Parameters
- `feedUrl` (string): RSS feed URL or local SQLite library path.
- `local` (boolean): Use local Whisper and Ollama LLM models.
- `apiKey` (string): Optional Claude / Gemini / OpenAI API key.
