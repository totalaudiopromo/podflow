import { generateText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import type { DetailedEpisode, DigestEntry, Guest, KeyIdea, PersonMentioned, PodflowConfig } from '../types.js';
import { getPodcastConfig } from '../config/index.js';

function buildSystemPrompt(config: PodflowConfig): string {
  const interestList = config.interests.map(t => t.name).join(', ');

  return `You extract structured intelligence from podcast episodes. You receive episode metadata (title, podcast name, description, transcript snippet) and return JSON.

For each episode, extract:

1. GUESTS: People who were interviewed or featured as guests (NOT the regular hosts). For each guest provide:
   - name: Full name
   - role: Job title or description
   - company: Organisation they work with
   - socials: Any Twitter/LinkedIn/website handles found in the description
   - followWorthy: true if this person would be valuable to follow for someone who is: ${config.about}
   - whyFollow: Brief reason if followWorthy is true

2. KEY_IDEAS: 1-3 specific, actionable ideas from the episode. Focus on topics relevant to: ${interestList}.
   Skip generic advice. Extract specific tactics, frameworks, or numbers.
   Each idea has: idea (the insight), category (which topic area), actionable (boolean), relevance (0-10 how relevant to the listener's interests)

3. PEOPLE_MENTIONED: Notable people referenced in the episode (not guests) who might be worth looking up. Each has: name, context (why mentioned).

4. RELEVANCE: Overall score 0-10 for how relevant this episode is to someone who is: ${config.about}. If score > 5, include a note explaining what's applicable.

Return a JSON array with one object per episode, in the same order as the input. Each object has:
{ "guests": [...], "keyIdeas": [...], "peopleMentioned": [...], "relevanceScore": number, "relevanceNote": string }

If an episode has no guests (e.g. solo host monologue), return an empty guests array. If no actionable ideas, return empty keyIdeas. Always return the full array matching the input count.`;
}

function buildEpisodeInput(config: PodflowConfig, ep: DetailedEpisode, index: number): string {
  const podConfig = getPodcastConfig(config, ep.podcast);
  const parts = [`--- Episode ${index + 1} ---`];
  parts.push(`Title: ${ep.title}`);
  parts.push(`Podcast: ${ep.podcast}`);
  parts.push(`Date: ${ep.lastPlayed || ep.pubDate}`);

  if (ep.description) {
    parts.push(`Description: ${ep.description}`);
  }

  if (ep.transcriptSnippet && podConfig.extractGuests) {
    try {
      const turns = JSON.parse(ep.transcriptSnippet);
      if (Array.isArray(turns) && turns.length > 0) {
        const text = turns.map((t: { content: string }) => t.content).join(' ');
        parts.push(`Transcript preview: ${text}`);
      }
    } catch {
      // Not valid JSON, skip
    }
  }

  return parts.join('\n');
}

function getModel(config: PodflowConfig) {
  switch (config.provider) {
    case 'anthropic': {
      const anthropic = createAnthropic(config.apiKey ? { apiKey: config.apiKey } : undefined);
      return anthropic(config.model || 'claude-haiku-4-5-20251001');
    }
    case 'openai': {
      const openai = createOpenAI(config.apiKey ? { apiKey: config.apiKey } : undefined);
      return openai(config.model || 'gpt-4o-mini');
    }
    case 'google': {
      const google = createGoogleGenerativeAI(config.apiKey ? { apiKey: config.apiKey } : undefined);
      return google(config.model || 'gemini-2.0-flash');
    }
    case 'ollama': {
      const ollama = createOpenAI({ baseURL: 'http://localhost:11434/v1', apiKey: 'ollama' });
      return ollama(config.model || 'llama3.2');
    }
    case 'openrouter': {
      const openrouter = createOpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: config.apiKey || process.env.OPENROUTER_API_KEY,
      });
      return openrouter(config.model || 'anthropic/claude-3.5-haiku');
    }
    default:
      throw new Error(`Unknown provider: ${config.provider}. Use: anthropic, openai, google, ollama, openrouter`);
  }
}

interface RawExtraction {
  guests: Guest[];
  keyIdeas: KeyIdea[];
  peopleMentioned: PersonMentioned[];
  relevanceScore: number;
  relevanceNote: string;
}

// ---------------------------------------------------------------------------
// Defensive coercion for model output.
//
// The model returns free-form JSON, so individual fields can be missing, the
// wrong type, or null. Rather than trusting the shape (which lets a bad value
// flow downstream to a `.map`/`.length` crash) or throwing, we coerce every
// field to its declared type, dropping anything unusable. The result is always
// a well-formed RawExtraction.
// ---------------------------------------------------------------------------

const EXTRACTION_KEYS = ['guests', 'keyIdeas', 'peopleMentioned', 'relevanceScore', 'relevanceNote'];

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

function asString(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

function asNumber(v: unknown): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : 0;
}

function asBool(v: unknown): boolean {
  return typeof v === 'boolean' ? v : false;
}

function coerceGuests(v: unknown): Guest[] {
  if (!Array.isArray(v)) return [];
  return v.filter(isRecord).map((g) => ({
    name: asString(g.name),
    role: asString(g.role),
    company: asString(g.company),
    socials: Array.isArray(g.socials) ? g.socials.filter((s): s is string => typeof s === 'string') : [],
    followWorthy: asBool(g.followWorthy),
    whyFollow: asString(g.whyFollow),
  }));
}

function coerceKeyIdeas(v: unknown): KeyIdea[] {
  if (!Array.isArray(v)) return [];
  return v.filter(isRecord).map((k) => ({
    idea: asString(k.idea),
    category: asString(k.category),
    actionable: asBool(k.actionable),
    relevance: asNumber(k.relevance),
  }));
}

function coercePeopleMentioned(v: unknown): PersonMentioned[] {
  if (!Array.isArray(v)) return [];
  return v.filter(isRecord).map((p) => ({
    name: asString(p.name),
    context: asString(p.context),
  }));
}

function coerceExtraction(v: unknown): RawExtraction {
  const o = isRecord(v) ? v : {};
  return {
    guests: coerceGuests(o.guests),
    keyIdeas: coerceKeyIdeas(o.keyIdeas),
    peopleMentioned: coercePeopleMentioned(o.peopleMentioned),
    relevanceScore: asNumber(o.relevanceScore),
    relevanceNote: asString(o.relevanceNote),
  };
}

/** True if `v` plausibly is a per-episode extraction (has at least one known key). */
function looksLikeExtraction(v: unknown): boolean {
  return isRecord(v) && EXTRACTION_KEYS.some((k) => k in v);
}

/**
 * Normalise parsed model output into a list of raw extraction candidates:
 * an array is taken as-is; a lone extraction-shaped object is wrapped into a
 * one-element list (a single-episode batch can come back unwrapped); anything
 * else (e.g. an `{ "error": ... }` refusal object) yields no candidates.
 */
function toExtractionList(parsed: unknown): unknown[] {
  if (Array.isArray(parsed)) return parsed;
  if (looksLikeExtraction(parsed)) return [parsed];
  return [];
}

export interface ExtractionResult {
  entries: Map<string, DigestEntry>;
  inputTokens: number;
  outputTokens: number;
}

export async function extractBatch(
  config: PodflowConfig,
  episodes: DetailedEpisode[]
): Promise<ExtractionResult> {
  const model = getModel(config);
  const systemPrompt = buildSystemPrompt(config);
  const userContent = episodes.map((ep, i) => buildEpisodeInput(config, ep, i)).join('\n\n');

  const result = await generateText({
    model,
    system: systemPrompt,
    prompt: `Extract intelligence from these ${episodes.length} episodes. Return ONLY valid JSON -- no markdown, no code fences, no explanation. Just the JSON array.\n\n${userContent}`,
    maxTokens: 8192,
  });

  const text = result.text;
  const inputTokens = result.usage?.promptTokens || 0;
  const outputTokens = result.usage?.completionTokens || 0;

  // Strip markdown code fences if present
  const cleaned = text
    .replace(/^```(?:json)?\s*\n?/gm, '')
    .replace(/\n?```\s*$/gm, '')
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    // Try to find balanced array brackets
    const start = cleaned.indexOf('[');
    if (start === -1) {
      console.error('  No JSON array found in response.');
      return { entries: new Map(), inputTokens, outputTokens };
    }

    let depth = 0;
    let end = -1;
    for (let i = start; i < cleaned.length; i++) {
      if (cleaned[i] === '[') depth++;
      else if (cleaned[i] === ']') {
        depth--;
        if (depth === 0) { end = i; break; }
      }
    }

    if (end === -1) {
      const lastBrace = cleaned.lastIndexOf('}');
      if (lastBrace > start) {
        try {
          parsed = JSON.parse(cleaned.slice(start, lastBrace + 1) + ']');
        } catch {
          return { entries: new Map(), inputTokens, outputTokens };
        }
      } else {
        return { entries: new Map(), inputTokens, outputTokens };
      }
    } else {
      try {
        parsed = JSON.parse(cleaned.slice(start, end + 1));
      } catch {
        return { entries: new Map(), inputTokens, outputTokens };
      }
    }
  }

  const rawList = toExtractionList(parsed);

  const entries = new Map<string, DigestEntry>();
  for (let i = 0; i < Math.min(episodes.length, rawList.length); i++) {
    const ep = episodes[i];
    // coerceExtraction never throws and always returns a well-formed object,
    // so a null / wrong-typed element can't crash the loop or leak bad types.
    const ext = coerceExtraction(rawList[i]);
    const key = `${ep.podcast}::${ep.title}`;

    entries.set(key, {
      title: ep.title,
      podcast: ep.podcast,
      lastPlayed: ep.lastPlayed,
      guests: ext.guests,
      keyIdeas: ext.keyIdeas,
      peopleMentioned: ext.peopleMentioned,
      relevanceScore: ext.relevanceScore,
      relevanceNote: ext.relevanceNote,
      processedAt: new Date().toISOString(),
    });
  }

  return { entries, inputTokens, outputTokens };
}

export function estimateCost(
  episodes: DetailedEpisode[],
  config: PodflowConfig
): { inputTokens: number; outputTokens: number; estimatedCost: string } {
  const systemTokens = 500;
  const batchCount = Math.ceil(episodes.length / 5);
  const totalInputTokens = systemTokens * batchCount + episodes.length * 400;
  const totalOutputTokens = episodes.length * 250;

  // Rough cost estimates per provider
  const rates: Record<string, { input: number; output: number }> = {
    anthropic: { input: 0.8, output: 4.0 },   // Haiku
    openai: { input: 0.15, output: 0.6 },      // GPT-4o-mini
    google: { input: 0.075, output: 0.3 },     // Gemini Flash
    ollama: { input: 0, output: 0 },           // Local
    openrouter: { input: 0.8, output: 4.0 },   // OpenRouter default (Claude Haiku rate)
  };

  const rate = rates[config.provider] || rates.anthropic;
  const cost = (totalInputTokens / 1_000_000) * rate.input + (totalOutputTokens / 1_000_000) * rate.output;

  return {
    inputTokens: totalInputTokens,
    outputTokens: totalOutputTokens,
    estimatedCost: config.provider === 'ollama' ? 'free (local)' : `~$${cost.toFixed(2)}`,
  };
}
