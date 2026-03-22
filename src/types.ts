// Apple Podcasts Core Data epoch: 2001-01-01 00:00:00 UTC
export const CORE_DATA_EPOCH = 978307200;

export const APPLE_PODCASTS_DB = `${process.env.HOME}/Library/Group Containers/243LU875E5.groups.com.apple.podcasts/Documents/MTLibrary.sqlite`;

// ---------- DB types ----------

export interface RawDetailedEpisode {
  title: string;
  podcast: string;
  playCount: number;
  duration: number;
  lastPlayed: number | null;
  pubDate: number | null;
  description: string | null;
  descriptionHtml: string | null;
  transcriptSnippet: string | null;
  webPageUrl: string | null;
  podcastAuthor: string | null;
  podcastCategory: string | null;
}

export interface DetailedEpisode {
  title: string;
  podcast: string;
  lastPlayed: string;
  pubDate: string;
  duration: number;
  completed: boolean;
  description: string;
  transcriptSnippet: string;
  webPageUrl: string;
  podcastAuthor: string;
  podcastCategory: string;
}

// ---------- Extraction types ----------

export interface Guest {
  name: string;
  role: string;
  company: string;
  socials: string[];
  followWorthy: boolean;
  whyFollow: string;
}

export interface KeyIdea {
  idea: string;
  category: string;
  actionable: boolean;
  relevance: number;
}

export interface PersonMentioned {
  name: string;
  context: string;
}

export interface DigestEntry {
  title: string;
  podcast: string;
  lastPlayed: string;
  guests: Guest[];
  keyIdeas: KeyIdea[];
  peopleMentioned: PersonMentioned[];
  relevanceScore: number;
  relevanceNote: string;
  processedAt: string;
}

// ---------- Cache types ----------

export interface GuestIndex {
  name: string;
  role: string;
  company: string;
  socials: string[];
  episodeCount: number;
  episodes: string[];
  firstSeen: string;
  lastSeen: string;
  followWorthy: boolean;
  whyFollow: string;
}

export interface DigestCache {
  lastRun: string;
  lastRunCost: number;
  processedEpisodes: Record<string, DigestEntry>;
  guestIndex: Record<string, GuestIndex>;
  stats: {
    totalProcessed: number;
    totalGuests: number;
    totalIdeas: number;
    totalCost: number;
  };
}

// ---------- Config types ----------

export interface PodcastTierConfig {
  tier: 1 | 2 | 3 | 4;
  extractGuests: boolean;
  extractIdeas: boolean;
  skipPatterns?: string[];
}

export interface PodcastConfig {
  podcasts: Record<string, PodcastTierConfig>;
  defaults: PodcastTierConfig;
}

export interface InterestTopic {
  name: string;
  keywords: string[];
  why: string;
}

export interface PodflowConfig {
  about: string;
  interests: InterestTopic[];
  podcasts: PodcastConfig;
  provider: 'anthropic' | 'openai' | 'google' | 'ollama';
  model: string;
  outputPath: string;
}
