import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { DigestEntry } from '../../types.js';
import { makeConfig, makeEpisode, extraction, EVAL_CASES } from './fixtures.js';

// The extractor's only external dependency is `generateText` from the `ai`
// SDK — the network boundary. We mock it so every test drives the parser with
// a deterministic model-output string. No provider key, no HTTP.
const generateText = vi.fn();
vi.mock('ai', () => ({ generateText: (...args: unknown[]) => generateText(...args) }));

const { extractBatch } = await import('../extractor.js');

/** Feed a raw model-output string through extractBatch for `n` episodes. */
function runExtractor(response: string, episodeCount = 1) {
  generateText.mockResolvedValue({
    text: response,
    // AI SDK v4 usage shape: promptTokens / completionTokens.
    usage: { promptTokens: 100, completionTokens: 50 },
  });
  const episodes = Array.from({ length: episodeCount }, (_, i) =>
    makeEpisode({ title: `Episode ${i + 1}`, podcast: 'Test Pod' })
  );
  return extractBatch(makeConfig(), episodes);
}

function firstEntry(entries: Map<string, DigestEntry>): DigestEntry | undefined {
  return [...entries.values()][0];
}

beforeEach(() => {
  generateText.mockReset();
});

// ===========================================================================
// 1. Happy-path parsing
// ===========================================================================
describe('extractBatch — well-formed model output', () => {
  it('parses a clean single-element JSON array', async () => {
    const res = await runExtractor(JSON.stringify([extraction({ relevanceScore: 7, relevanceNote: 'ok' })]));
    expect(res.entries.size).toBe(1);
    expect(firstEntry(res.entries)?.relevanceScore).toBe(7);
  });

  it('maps guests, ideas and people onto the DigestEntry', async () => {
    const res = await runExtractor(
      JSON.stringify([
        extraction({
          guests: [{ name: 'Ada', role: 'Eng', company: 'Co', socials: [], followWorthy: true, whyFollow: 'why' }],
          keyIdeas: [{ idea: 'ship', category: 'Technology & AI', actionable: true, relevance: 8 }],
          peopleMentioned: [{ name: 'Grace', context: 'ref' }],
          relevanceScore: 8,
          relevanceNote: 'note',
        }),
      ])
    );
    const e = firstEntry(res.entries)!;
    expect(e.guests).toHaveLength(1);
    expect(e.guests[0].name).toBe('Ada');
    expect(e.keyIdeas[0].idea).toBe('ship');
    expect(e.peopleMentioned[0].name).toBe('Grace');
  });

  it('carries episode metadata and a processedAt timestamp onto the entry', async () => {
    const res = await runExtractor(JSON.stringify([extraction()]));
    const e = firstEntry(res.entries)!;
    expect(e.title).toBe('Episode 1');
    expect(e.podcast).toBe('Test Pod');
    expect(Number.isNaN(Date.parse(e.processedAt))).toBe(false);
  });

  it('keys entries by `podcast::title`', async () => {
    const res = await runExtractor(JSON.stringify([extraction()]));
    expect([...res.entries.keys()][0]).toBe('Test Pod::Episode 1');
  });

  it('reports token usage from the model result', async () => {
    const res = await runExtractor(JSON.stringify([extraction()]));
    expect(res.inputTokens).toBe(100);
    expect(res.outputTokens).toBe(50);
  });
});

// ===========================================================================
// 2. Recovery paths — malformed-but-salvageable output
// ===========================================================================
describe('extractBatch — recovery from messy but salvageable output', () => {
  it('strips a ```json code fence', async () => {
    const res = await runExtractor('```json\n' + JSON.stringify([extraction({ relevanceNote: 'fenced' })]) + '\n```');
    expect(res.entries.size).toBe(1);
    expect(firstEntry(res.entries)?.relevanceNote).toBe('fenced');
  });

  it('strips a bare ``` code fence (no language tag)', async () => {
    const res = await runExtractor('```\n' + JSON.stringify([extraction({ relevanceNote: 'bare' })]) + '\n```');
    expect(res.entries.size).toBe(1);
    expect(firstEntry(res.entries)?.relevanceNote).toBe('bare');
  });

  it('recovers when the model appends trailing prose after the array', async () => {
    const res = await runExtractor(
      JSON.stringify([extraction({ relevanceNote: 'kept' })]) + '\n\nHope this helps! Let me know if you need more.'
    );
    expect(res.entries.size).toBe(1);
    expect(firstEntry(res.entries)?.relevanceNote).toBe('kept');
  });

  it('recovers when the model prepends leading prose before the array', async () => {
    const res = await runExtractor("Sure! Here's the JSON you asked for:\n" + JSON.stringify([extraction({ relevanceNote: 'lead' })]));
    expect(res.entries.size).toBe(1);
    expect(firstEntry(res.entries)?.relevanceNote).toBe('lead');
  });

  it('recovers the completed objects from JSON truncated mid-array', async () => {
    // Two objects, second cut off partway through — the balanced-bracket scan
    // fails, so the extractor falls back to slicing to the last `}` and closing
    // the array. The first (complete) object should survive.
    const truncated =
      '[' +
      JSON.stringify(extraction({ relevanceNote: 'first' })) +
      ',' +
      JSON.stringify(extraction({ relevanceNote: 'second' })).slice(0, 30);
    const res = await runExtractor(truncated, 2);
    expect(res.entries.size).toBe(1);
    expect(firstEntry(res.entries)?.relevanceNote).toBe('first');
  });

  it('keeps a code fence that appears inline inside a string value intact', async () => {
    // A fence embedded mid-line inside a JSON string is not on its own line, so
    // the anchored fence-strip regex leaves it alone and the JSON still parses.
    const res = await runExtractor(
      JSON.stringify([extraction({ keyIdeas: [{ idea: 'run ```npm test```', category: 'Technology & AI', actionable: true, relevance: 5 }] })])
    );
    expect(res.entries.size).toBe(1);
    expect(firstEntry(res.entries)?.keyIdeas[0].idea).toContain('```npm test```');
  });

  it('applies empty-array / zero defaults for objects missing optional fields', async () => {
    const res = await runExtractor('[{"relevanceNote":"sparse"}]');
    const e = firstEntry(res.entries)!;
    expect(e.guests).toEqual([]);
    expect(e.keyIdeas).toEqual([]);
    expect(e.peopleMentioned).toEqual([]);
    expect(e.relevanceScore).toBe(0);
    expect(e.relevanceNote).toBe('sparse');
  });
});

// ===========================================================================
// 3. Clean failure — unsalvageable output must yield an empty result, not throw
// ===========================================================================
describe('extractBatch — clean failure on unusable output', () => {
  it('returns an empty map for an empty string, without throwing', async () => {
    const res = await runExtractor('');
    expect(res.entries.size).toBe(0);
    // Usage is still surfaced even when parsing fails.
    expect(res.inputTokens).toBe(100);
    expect(res.outputTokens).toBe(50);
  });

  it('returns an empty map for non-JSON garbage, without throwing', async () => {
    const res = await runExtractor('I was unable to process this request. Please try again later.');
    expect(res.entries.size).toBe(0);
  });

  it('returns an empty map for a JSON object with no array bracket at all', async () => {
    const res = await runExtractor('{"error":"model refused"}');
    // No `[` anywhere -> early clean bail-out.
    expect(res.entries.size).toBe(0);
  });

  it('returns an empty map when truncated inside the first object (nothing complete)', async () => {
    const res = await runExtractor('[{"guests":[],"keyIdeas":[{"idea":"half');
    expect(res.entries.size).toBe(0);
  });

  it('returns an empty map for an empty JSON array', async () => {
    const res = await runExtractor('[]', 2);
    expect(res.entries.size).toBe(0);
  });

  it('does not throw on malformed unicode / stray control characters', async () => {
    const res = await runExtractor('[{"relevanceNote":"bad \x01 char"');
    expect(res.entries.size).toBe(0);
  });
});

// ===========================================================================
// 4. Count reconciliation between episodes and extractions
// ===========================================================================
describe('extractBatch — episode/extraction count mismatch', () => {
  it('maps only the available extractions when the model returns fewer than requested', async () => {
    const res = await runExtractor(JSON.stringify([extraction({ relevanceNote: 'only-one' })]), 3);
    expect(res.entries.size).toBe(1);
    expect(firstEntry(res.entries)?.relevanceNote).toBe('only-one');
  });

  it('ignores surplus extractions when the model returns more than requested', async () => {
    const res = await runExtractor(
      JSON.stringify([extraction({ relevanceNote: 'a' }), extraction({ relevanceNote: 'b' })]),
      1
    );
    expect(res.entries.size).toBe(1);
    expect(firstEntry(res.entries)?.relevanceNote).toBe('a');
  });
});

// ===========================================================================
// 5. Characterisation of KNOWN DEFECTS (see PR description).
//
// These tests pin CURRENT behaviour so regressions are visible. Each one marks
// output the extractor gets WRONG. They are intentionally NOT "fixes" — the
// task is test-hardening only, and a fix would be a production behaviour change.
// If/when the extractor is hardened, these assertions should be inverted.
// ===========================================================================
describe('extractBatch — KNOWN DEFECTS (characterisation, not endorsement)', () => {
  // FINDING #1: a single JSON object (not wrapped in an array) is silently
  // dropped. For a single-episode batch this is a plausible model response, yet
  // the episode produces no entry at all — a lossy, wrong result.
  it('DEFECT: drops a lone JSON object that is not wrapped in an array', async () => {
    const res = await runExtractor(JSON.stringify(extraction({ relevanceScore: 9, relevanceNote: 'lost' })), 1);
    expect(res.entries.size).toBe(0); // WRONG: ideally this single object would map to the single episode.
  });

  // FINDING #2: field types are never validated. A model that returns `guests`
  // as a string (or any wrong type) has that value stored verbatim, producing a
  // DigestEntry whose `guests` is not a Guest[]. Downstream `.map`/`.length`
  // calls would then break far from the parse site.
  it('DEFECT: stores a wrong-typed `guests` value (string) verbatim instead of coercing/rejecting', async () => {
    const res = await runExtractor('[{"guests":"Bob Smith","keyIdeas":[],"peopleMentioned":[],"relevanceScore":5,"relevanceNote":""}]');
    const e = firstEntry(res.entries)!;
    expect(e.guests).toBe('Bob Smith' as unknown as DigestEntry['guests']); // WRONG: guests should be Guest[].
  });

  // FINDING #2 (cont.): a string relevanceScore likewise passes straight through.
  it('DEFECT: stores a wrong-typed `relevanceScore` (string) verbatim', async () => {
    const res = await runExtractor('[{"guests":[],"keyIdeas":[],"peopleMentioned":[],"relevanceScore":"high","relevanceNote":""}]');
    expect(firstEntry(res.entries)?.relevanceScore).toBe('high' as unknown as number); // WRONG: should be a number.
  });

  // FINDING #3: a `null` element inside the extractions array crashes the
  // mapping loop with an unhandled TypeError. This VIOLATES the contract that
  // the extractor must fail cleanly and never throw. A null-guard in the map
  // loop would fix it, but that is a production change and out of scope here.
  it('DEFECT: throws an unhandled TypeError on a null array element (should fail cleanly)', async () => {
    await expect(runExtractor('[null]', 1)).rejects.toThrow(TypeError);
  });
});

// ===========================================================================
// 6. Eval dataset — synthetic-but-realistic episodes end-to-end
// ===========================================================================
describe('extractBatch — eval dataset', () => {
  for (const evalCase of EVAL_CASES) {
    it(`eval: ${evalCase.name}`, async () => {
      generateText.mockResolvedValue({
        text: evalCase.response,
        usage: { promptTokens: 200, completionTokens: 120 },
      });
      const res = await extractBatch(makeConfig(), evalCase.episodes);

      expect(res.entries.size).toBe(evalCase.expect.entryCount);

      const entries = [...res.entries.values()];
      evalCase.expect.entries.forEach((exp, i) => {
        const e = entries[i];
        expect(e, `entry ${i} missing`).toBeDefined();
        if (exp.guestNames) {
          expect(e.guests.map((g) => g.name)).toEqual(exp.guestNames);
        }
        if (exp.guestCount !== undefined) {
          expect(e.guests).toHaveLength(exp.guestCount);
        }
        if (exp.ideaCount !== undefined) {
          expect(e.keyIdeas).toHaveLength(exp.ideaCount);
        }
        if (exp.peopleCount !== undefined) {
          expect(e.peopleMentioned).toHaveLength(exp.peopleCount);
        }
        if (exp.relevanceScore !== undefined) {
          expect(e.relevanceScore).toBe(exp.relevanceScore);
        }
        if (exp.relevanceNoteIncludes) {
          expect(e.relevanceNote.toLowerCase()).toContain(exp.relevanceNoteIncludes.toLowerCase());
        }
      });
    });
  }

  it('eval dataset covers a broad spread of episode shapes', () => {
    // Guard against the dataset silently shrinking back toward the original 3.
    expect(EVAL_CASES.length).toBeGreaterThanOrEqual(6);
    const totalEpisodes = EVAL_CASES.reduce((n, c) => n + c.episodes.length, 0);
    expect(totalEpisodes).toBeGreaterThanOrEqual(8);
  });
});
