/**
 * podflow MCP server — "ears for agents".
 *
 * Exposes the podflow cache (episode intelligence, guest index) and RSS
 * ingestion as MCP tools over stdio, so any agent can ask what was said
 * on the podcasts podflow has processed — and pull new feeds on demand.
 *
 * v1 honesty: intelligence is episode-level (descriptions + Apple transcript
 * snippets where available). Full audio transcription is a later phase.
 *
 * IMPORTANT: never write to stdout here except via the transport — stdio IS
 * the MCP wire. Diagnostics go to stderr.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadCache, saveCache, isProcessed, makeKey, mergeEntries } from '../cache.js';
import { loadConfig, configExists } from '../config/index.js';
import { fetchRssEpisodes } from '../db/rss.js';
import { extractBatch } from '../ai/extractor.js';
import type { DigestCache, DigestEntry, PodflowConfig } from '../types.js';

/** Same per-million-token rates as the digest command (cli.ts). */
function costFromTokens(provider: PodflowConfig['provider'], input: number, output: number): number {
  const rates: Record<string, { input: number; output: number }> = {
    anthropic: { input: 0.8, output: 4.0 },
    openai: { input: 0.15, output: 0.6 },
    google: { input: 0.075, output: 0.3 },
    ollama: { input: 0, output: 0 },
  };
  const rate = rates[provider] || rates.anthropic;
  return (input / 1_000_000) * rate.input + (output / 1_000_000) * rate.output;
}

const VERSION = '0.2.0';

function text(payload: unknown) {
  return {
    content: [
      {
        type: 'text' as const,
        text: typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2),
      },
    ],
  };
}

function episodeSummary(key: string, e: DigestEntry) {
  return {
    key,
    title: e.title,
    podcast: e.podcast,
    relevanceScore: e.relevanceScore,
    relevanceNote: e.relevanceNote,
    guests: e.guests.map((g) => `${g.name}${g.role ? ` (${g.role}${g.company ? `, ${g.company}` : ''})` : ''}`),
    keyIdeas: e.keyIdeas.map((k) => k.idea),
  };
}

function matches(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

export async function startMcpServer(): Promise<void> {
  const server = new McpServer({ name: 'podflow', version: VERSION });

  server.tool(
    'search_episodes',
    'Search processed podcast episodes by keyword — matches titles, podcast names, guest names, extracted ideas, and relevance notes. Returns episode-level intelligence (guests, key ideas, relevance).',
    { query: z.string().describe('Keyword or phrase to search for'), limit: z.number().optional().describe('Max results (default 10)') },
    async ({ query, limit }) => {
      const cache = loadCache();
      const hits: ReturnType<typeof episodeSummary>[] = [];
      for (const [key, e] of Object.entries(cache.processedEpisodes)) {
        const blob = [
          e.title,
          e.podcast,
          e.relevanceNote,
          ...e.guests.map((g) => `${g.name} ${g.role} ${g.company} ${g.whyFollow}`),
          ...e.keyIdeas.map((k) => `${k.idea} ${k.category}`),
          ...e.peopleMentioned.map((p) => `${p.name} ${p.context}`),
        ].join(' ');
        if (matches(blob, query)) hits.push(episodeSummary(key, e));
        if (hits.length >= (limit ?? 10)) break;
      }
      return text({ query, total: hits.length, episodes: hits });
    }
  );

  server.tool(
    'get_guest',
    'Look up a podcast guest by name in the cross-episode guest index: role, company, socials, appearances, and why they are worth following.',
    { name: z.string().describe('Guest name (case-insensitive; partial matches allowed)') },
    async ({ name }) => {
      const cache = loadCache();
      const exactKey = name.toLowerCase().replace(/\s+/g, '-');
      if (cache.guestIndex[exactKey]) return text(cache.guestIndex[exactKey]);
      const partial = Object.values(cache.guestIndex).filter((g) => matches(g.name, name));
      if (partial.length === 0) return text({ error: `No guest matching "${name}" in the index.` });
      return text(partial.length === 1 ? partial[0] : { matches: partial });
    }
  );

  server.tool(
    'get_ideas',
    'Retrieve extracted key ideas across all processed episodes, optionally filtered by topic keyword and minimum relevance, sorted by relevance.',
    {
      topic: z.string().optional().describe('Filter ideas whose text or category matches this keyword'),
      min_relevance: z.number().optional().describe('Minimum idea relevance 0-10 (default 0)'),
      limit: z.number().optional().describe('Max ideas returned (default 20)'),
    },
    async ({ topic, min_relevance, limit }) => {
      const cache = loadCache();
      const ideas: Array<{ idea: string; category: string; relevance: number; actionable: boolean; episode: string; podcast: string }> = [];
      for (const e of Object.values(cache.processedEpisodes)) {
        for (const k of e.keyIdeas) {
          if (k.relevance < (min_relevance ?? 0)) continue;
          if (topic && !matches(`${k.idea} ${k.category}`, topic)) continue;
          ideas.push({ idea: k.idea, category: k.category, relevance: k.relevance, actionable: k.actionable, episode: e.title, podcast: e.podcast });
        }
      }
      ideas.sort((a, b) => b.relevance - a.relevance);
      return text({ topic: topic ?? null, total: ideas.length, ideas: ideas.slice(0, limit ?? 20) });
    }
  );

  server.tool(
    'list_follow_worthy',
    'List guests flagged follow-worthy across all processed episodes, with why-follow context — sorted by appearance count.',
    { limit: z.number().optional().describe('Max guests (default 25)') },
    async ({ limit }) => {
      const cache = loadCache();
      const guests = Object.values(cache.guestIndex)
        .filter((g) => g.followWorthy)
        .sort((a, b) => b.episodeCount - a.episodeCount)
        .slice(0, limit ?? 25);
      return text({ total: guests.length, guests });
    }
  );

  server.tool(
    'get_stats',
    'Cache statistics: episodes processed, guests indexed, ideas extracted, total AI cost, last run.',
    {},
    async () => {
      const cache = loadCache();
      return text({ lastRun: cache.lastRun, stats: cache.stats });
    }
  );

  server.tool(
    'ingest_feed',
    'Fetch an arbitrary podcast RSS feed and run AI extraction on its newest unprocessed episodes, adding them to the cache. Requires podflow config (~/.podflow) and a provider API key. Costs a small amount per episode.',
    {
      url: z.string().describe('Podcast RSS feed URL'),
      max_episodes: z.number().optional().describe('Max new episodes to process (default 5, cap 20)'),
    },
    async ({ url, max_episodes }) => {
      if (!configExists()) {
        return text({ error: 'No podflow config. Run `podflow init` first and set a provider API key.' });
      }
      const config = loadConfig();
      const cache: DigestCache = loadCache();
      const cap = Math.min(max_episodes ?? 5, 20);

      const episodes = await fetchRssEpisodes(url, 40);
      const fresh = episodes.filter((ep) => !isProcessed(cache, makeKey(ep.podcast, ep.title))).slice(0, cap);
      if (fresh.length === 0) {
        return text({ url, processed: 0, note: 'No unprocessed episodes found in this feed (already cached or empty).' });
      }

      const result = await Promise.race([
        extractBatch(config, fresh),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Extraction timed out (120s)')), 120_000)
        ),
      ]);
      const cost = costFromTokens(config.provider, result.inputTokens, result.outputTokens);
      const updated = mergeEntries(cache, result.entries, cost);
      saveCache(updated);

      return text({
        url,
        processed: result.entries.size,
        costUsd: Number(cost.toFixed(4)),
        episodes: Array.from(result.entries.entries()).map(([key, e]) => episodeSummary(key, e)),
      });
    }
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`podflow MCP server v${VERSION} — 6 tools, stdio. Cache: ~/.podflow/cache.json`);
}
