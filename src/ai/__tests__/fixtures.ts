import type { PodflowConfig, DetailedEpisode } from '../../types.js';

/**
 * Shared test fixtures for the extractor suite.
 *
 * The extractor's real job is turning raw model output (an untrusted string)
 * into structured `DigestEntry` values, so every fixture here is expressed as a
 * *model response string* fed through a mocked `generateText`. No network, no
 * provider keys — the parsing/recovery/mapping logic is exercised directly.
 */

export function makeConfig(overrides: Partial<PodflowConfig> = {}): PodflowConfig {
  return {
    about: 'a solo founder building an AI podcast-intelligence product',
    interests: [
      { name: 'Business & Strategy', keywords: ['pricing', 'churn', 'growth'], why: 'core' },
      { name: 'Technology & AI', keywords: ['AI', 'LLM', 'agent'], why: 'stack' },
    ],
    podcasts: { podcasts: {}, defaults: { tier: 3, extractGuests: true, extractIdeas: true } },
    provider: 'anthropic',
    model: 'claude-haiku-4-5-20251001',
    outputPath: './podflow-digest.md',
    ...overrides,
  };
}

export function makeEpisode(overrides: Partial<DetailedEpisode> = {}): DetailedEpisode {
  return {
    title: 'An Episode',
    podcast: 'A Podcast',
    lastPlayed: '2026-01-01T00:00:00.000Z',
    pubDate: '2026-01-01T00:00:00.000Z',
    duration: 3600,
    completed: true,
    description: 'An episode description.',
    transcriptSnippet: '',
    webPageUrl: '',
    podcastAuthor: '',
    podcastCategory: '',
    ...overrides,
  };
}

/**
 * A single, spec-shaped extraction object (matches RawExtraction in the
 * extractor). Handy for composing valid model responses in tests.
 */
export function extraction(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    guests: [],
    keyIdeas: [],
    peopleMentioned: [],
    relevanceScore: 5,
    relevanceNote: '',
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Eval dataset — synthetic-but-realistic (episode, model response, expectation)
// triples. No real Apple Podcasts transcripts are available in the repo, so
// these mirror the shape of real interview / solo / panel episodes.
// ---------------------------------------------------------------------------

export interface EvalCase {
  name: string;
  episodes: DetailedEpisode[];
  /** Raw model output string, exactly as an LLM might return it. */
  response: string;
  /** Assertions run against the resulting Map<key, DigestEntry>. */
  expect: {
    entryCount: number;
    /** Per-entry expectations, keyed by episode index. */
    entries: Array<{
      guestNames?: string[];
      guestCount?: number;
      ideaCount?: number;
      peopleCount?: number;
      relevanceScore?: number;
      relevanceNoteIncludes?: string;
    }>;
  };
}

export const EVAL_CASES: EvalCase[] = [
  {
    name: 'single guest interview — founder',
    episodes: [
      makeEpisode({
        title: 'Scaling a Bootstrapped SaaS to $2M ARR',
        podcast: 'Indie Founders',
        description: 'Sarah Chen on pricing experiments and churn.',
      }),
    ],
    response: JSON.stringify([
      {
        guests: [
          {
            name: 'Sarah Chen',
            role: 'Founder & CEO',
            company: 'Loopmetrics',
            socials: ['@sarahchen'],
            followWorthy: true,
            whyFollow: 'Shares concrete bootstrapped pricing playbooks.',
          },
        ],
        keyIdeas: [
          { idea: 'Raise prices 20% and grandfather existing customers to test elasticity.', category: 'Business & Strategy', actionable: true, relevance: 9 },
          { idea: 'Annual plans cut churn by pushing the cancel decision 12 months out.', category: 'Business & Strategy', actionable: true, relevance: 8 },
        ],
        peopleMentioned: [{ name: 'Patrick Campbell', context: 'Cited for pricing research from ProfitWell.' }],
        relevanceScore: 9,
        relevanceNote: 'Directly applicable pricing and churn tactics for a bootstrapped SaaS.',
      },
    ]),
    expect: {
      entryCount: 1,
      entries: [{ guestNames: ['Sarah Chen'], ideaCount: 2, peopleCount: 1, relevanceScore: 9, relevanceNoteIncludes: 'pricing' }],
    },
  },
  {
    name: 'solo host monologue — no guests',
    episodes: [
      makeEpisode({
        title: 'Why I Killed My Biggest Feature',
        podcast: 'Building in Public',
        description: 'A solo reflection on scope and focus.',
      }),
    ],
    response: JSON.stringify([
      {
        guests: [],
        keyIdeas: [
          { idea: 'Track feature usage before building v2; sunset anything under 5% adoption.', category: 'Technology & AI', actionable: true, relevance: 7 },
        ],
        peopleMentioned: [],
        relevanceScore: 6,
        relevanceNote: 'Useful framing on ruthless scope-cutting for solo founders.',
      },
    ]),
    expect: {
      entryCount: 1,
      entries: [{ guestCount: 0, ideaCount: 1, peopleCount: 0, relevanceScore: 6 }],
    },
  },
  {
    name: 'multi-guest panel',
    episodes: [
      makeEpisode({
        title: 'The Future of AI Agents — Panel',
        podcast: 'AI Weekly',
        description: 'Three researchers debate agent architectures.',
      }),
    ],
    response: JSON.stringify([
      {
        guests: [
          { name: 'Dr. Maya Okafor', role: 'Research Scientist', company: 'DeepThink', socials: [], followWorthy: true, whyFollow: 'Agent-evaluation research.' },
          { name: 'Tom Rivera', role: 'Staff Engineer', company: 'Toolchain', socials: ['@triv'], followWorthy: false, whyFollow: '' },
          { name: 'Lena Park', role: 'CTO', company: 'Autoflow', socials: ['@lenap'], followWorthy: true, whyFollow: 'Ships production agent systems.' },
        ],
        keyIdeas: [
          { idea: 'Give agents a scratchpad tool and force plan-before-act to cut tool-call errors.', category: 'Technology & AI', actionable: true, relevance: 9 },
        ],
        peopleMentioned: [
          { name: 'Andrej Karpathy', context: 'Referenced re: LLM-as-OS framing.' },
          { name: 'Yann LeCun', context: 'Mentioned re: world models.' },
        ],
        relevanceScore: 8,
        relevanceNote: 'Concrete agent-design patterns relevant to the product stack.',
      },
    ]),
    expect: {
      entryCount: 1,
      entries: [{ guestNames: ['Dr. Maya Okafor', 'Tom Rivera', 'Lena Park'], ideaCount: 1, peopleCount: 2, relevanceScore: 8 }],
    },
  },
  {
    name: 'low-relevance off-topic episode',
    episodes: [
      makeEpisode({
        title: 'Marathon Training for Beginners',
        podcast: 'Runners High',
        description: 'Couch to 26.2 miles.',
      }),
    ],
    response: JSON.stringify([
      {
        guests: [{ name: 'Coach Dan', role: 'Running Coach', company: '', socials: [], followWorthy: false, whyFollow: '' }],
        keyIdeas: [],
        peopleMentioned: [],
        relevanceScore: 1,
        relevanceNote: '',
      },
    ]),
    expect: {
      entryCount: 1,
      entries: [{ guestNames: ['Coach Dan'], ideaCount: 0, peopleCount: 0, relevanceScore: 1 }],
    },
  },
  {
    name: 'batch of three mixed episodes',
    episodes: [
      makeEpisode({ title: 'Ep A — Growth Loops', podcast: 'Growth Pod' }),
      makeEpisode({ title: 'Ep B — Solo Rant', podcast: 'Growth Pod' }),
      makeEpisode({ title: 'Ep C — LLM Ops', podcast: 'Growth Pod' }),
    ],
    response: JSON.stringify([
      {
        guests: [{ name: 'Alex Boyd', role: 'Head of Growth', company: 'Fizz', socials: [], followWorthy: true, whyFollow: 'Growth-loop teardowns.' }],
        keyIdeas: [{ idea: 'Instrument referral loops before paid; measure viral coefficient weekly.', category: 'Business & Strategy', actionable: true, relevance: 8 }],
        peopleMentioned: [],
        relevanceScore: 8,
        relevanceNote: 'Growth-loop instrumentation is directly useful.',
      },
      {
        guests: [],
        keyIdeas: [],
        peopleMentioned: [],
        relevanceScore: 3,
        relevanceNote: '',
      },
      {
        guests: [{ name: 'Priya Nair', role: 'ML Platform Lead', company: 'Corely', socials: ['@priyan'], followWorthy: true, whyFollow: 'Practical LLMOps.' }],
        keyIdeas: [
          { idea: 'Cache prompts by hash to cut token spend on repeated batch jobs.', category: 'Technology & AI', actionable: true, relevance: 9 },
          { idea: 'Log token usage per feature to find cost hot-spots.', category: 'Technology & AI', actionable: true, relevance: 7 },
        ],
        peopleMentioned: [{ name: 'Simon Willison', context: 'Cited on prompt logging.' }],
        relevanceScore: 9,
        relevanceNote: 'LLMOps cost-control tactics map onto podflow itself.',
      },
    ]),
    expect: {
      entryCount: 3,
      entries: [
        { guestNames: ['Alex Boyd'], ideaCount: 1, relevanceScore: 8 },
        { guestCount: 0, ideaCount: 0, relevanceScore: 3 },
        { guestNames: ['Priya Nair'], ideaCount: 2, peopleCount: 1, relevanceScore: 9 },
      ],
    },
  },
  {
    name: 'realistic code-fenced response (model wrapped JSON in ```json)',
    episodes: [makeEpisode({ title: 'Fenced Reply', podcast: 'Meta Pod' })],
    response:
      '```json\n' +
      JSON.stringify([
        {
          guests: [{ name: 'Jordan Vale', role: 'Author', company: '', socials: [], followWorthy: true, whyFollow: 'Writing systems.' }],
          keyIdeas: [{ idea: 'Draft in public to force clarity.', category: 'Business & Strategy', actionable: true, relevance: 6 }],
          peopleMentioned: [],
          relevanceScore: 6,
          relevanceNote: 'Light but useful writing workflow tips.',
        },
      ]) +
      '\n```',
    expect: {
      entryCount: 1,
      entries: [{ guestNames: ['Jordan Vale'], ideaCount: 1, relevanceScore: 6, relevanceNoteIncludes: 'writing' }],
    },
  },
];
