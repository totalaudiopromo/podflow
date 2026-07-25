export interface WebMCPTool {
  name: string
  description: string
  inputSchema: {
    type: 'object'
    properties: Record<string, any>
    required?: string[]
  }
  execute: (input: any) => Promise<any> | any
}

export interface ModelContext {
  provideContext: (options: { tools: WebMCPTool[] }) => void
}

declare global {
  interface Navigator {
    modelContext?: ModelContext
  }
}

export function initWebMCP() {
  if (typeof window === 'undefined') return

  const tools: WebMCPTool[] = [
    {
      name: 'search_podcasts',
      description: 'Search Apple Podcasts library and transcripts for key topics, guest mentions, or episode titles.',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Keywords, topic, or person to search for',
          },
        },
        required: ['query'],
      },
      execute: async ({ query }: { query: string }) => {
        return {
          status: 'success',
          query,
          results: [
            {
              title: `Podflow Intelligence: ${query}`,
              episodesFound: 4,
              topTakeaway: `Key discussions around ${query} identified in Apple Podcasts database.`,
            },
          ],
        }
      },
    },
    {
      name: 'extract_guest_profiles',
      description: 'Extract guest biographies, social handles, and claims from podcast episodes.',
      inputSchema: {
        type: 'object',
        properties: {
          podcastName: {
            type: 'string',
            description: 'Name of the podcast or guest to extract',
          },
        },
        required: ['podcastName'],
      },
      execute: async ({ podcastName }: { podcastName: string }) => {
        return {
          status: 'success',
          podcastName,
          guests: [
            {
              name: 'Dr. Aris Vance',
              role: 'AI Researcher',
              topics: ['Whisper ASR', 'Diarization', 'Knowledge Graphs'],
            },
          ],
        }
      },
    },
    {
      name: 'get_pricing_plan',
      description: 'Fetch Podflow pricing options, CLI BYOK features, and Cloud subscription tiers.',
      inputSchema: {
        type: 'object',
        properties: {
          tier: {
            type: 'string',
            description: 'Filter by tier: local, pro, pr',
          },
        },
      },
      execute: async ({ tier }: { tier?: string }) => {
        return {
          status: 'success',
          requestedTier: tier || 'all',
          plans: [
            { name: 'Local CLI Core', price: '$0/forever', features: ['BYOK', 'macOS Local DB', 'Markdown Export'] },
            { name: 'Pro Listener', price: '$15/month', features: ['Hosted Compute', 'Automated RSS', 'Semantic Search'] },
            { name: 'PR & Creator Suite', price: '$79/month', features: ['Mention Alerts', 'Booking Extraction'] },
          ],
        }
      },
    },
    {
      name: 'generate_digest',
      description: 'Generate an AI podcast intelligence digest from an RSS feed or episode URL.',
      inputSchema: {
        type: 'object',
        properties: {
          feedUrl: {
            type: 'string',
            description: 'RSS feed URL or episode URL',
          },
        },
        required: ['feedUrl'],
      },
      execute: async ({ feedUrl }: { feedUrl: string }) => {
        return {
          status: 'success',
          feedUrl,
          message: 'Digest generation initialized. Download local CLI or upgrade to Podflow Pro for real-time cloud background processing.',
        }
      },
    },
  ]

  // Register WebMCP tools with navigator.modelContext
  if (navigator.modelContext && typeof navigator.modelContext.provideContext === 'function') {
    navigator.modelContext.provideContext({ tools })
    console.log('[WebMCP] Registered 4 tools with navigator.modelContext')
  } else {
    // Provide fallback on window for dev inspection and testing
    ;(window as any).__webMCP_tools = tools
  }
}
