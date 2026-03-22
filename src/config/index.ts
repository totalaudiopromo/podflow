import * as fs from 'fs';
import * as path from 'path';
import type { PodflowConfig, InterestTopic, PodcastConfig, PodcastTierConfig } from '../types.js';

const CONFIG_DIR = path.join(process.env.HOME || '~', '.podflow');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
const PODCASTS_FILE = path.join(CONFIG_DIR, 'podcasts.json');

const DEFAULT_INTERESTS: InterestTopic[] = [
  {
    name: 'Business & Strategy',
    keywords: ['customer acquisition', 'pricing', 'churn', 'retention', 'revenue', 'growth', 'marketing', 'sales', 'GTM', 'PLG'],
    why: 'Core business insights for growing a product or service.',
  },
  {
    name: 'Technology & AI',
    keywords: ['AI', 'LLM', 'agent', 'automation', 'SaaS', 'API', 'software', 'engineering', 'developer'],
    why: 'Technical trends and tools that shape how products are built.',
  },
  {
    name: 'Industry & Domain',
    keywords: ['industry', 'trends', 'market', 'disruption', 'competition', 'regulation'],
    why: 'Domain-specific knowledge relevant to your work.',
  },
  {
    name: 'Productivity & Solo Founder',
    keywords: ['solo founder', 'bootstrapped', 'productivity', 'focus', 'burnout', 'delegation', 'time management'],
    why: 'Operational insights for working effectively.',
  },
];

const DEFAULT_PODCASTS: PodcastConfig = {
  podcasts: {},
  defaults: { tier: 3, extractGuests: true, extractIdeas: true },
};

const DEFAULT_CONFIG: PodflowConfig = {
  about: 'A professional building software products.',
  interests: DEFAULT_INTERESTS,
  podcasts: DEFAULT_PODCASTS,
  provider: 'anthropic',
  model: 'claude-haiku-4-5-20251001',
  outputPath: './podflow-digest.md',
};

export function configExists(): boolean {
  return fs.existsSync(CONFIG_FILE);
}

export function loadConfig(): PodflowConfig {
  const config = { ...DEFAULT_CONFIG };

  if (fs.existsSync(CONFIG_FILE)) {
    const userConfig = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    Object.assign(config, userConfig);
  }

  if (fs.existsSync(PODCASTS_FILE)) {
    config.podcasts = JSON.parse(fs.readFileSync(PODCASTS_FILE, 'utf-8'));
  }

  return config;
}

export function saveConfig(config: PodflowConfig): void {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });

  const { podcasts, ...rest } = config;
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(rest, null, 2));
  fs.writeFileSync(PODCASTS_FILE, JSON.stringify(podcasts, null, 2));
}

export function initConfig(): PodflowConfig {
  if (configExists()) {
    return loadConfig();
  }
  saveConfig(DEFAULT_CONFIG);
  return DEFAULT_CONFIG;
}

export function getPodcastConfig(config: PodflowConfig, podcastName: string): PodcastTierConfig {
  return config.podcasts.podcasts[podcastName] || config.podcasts.defaults;
}

export function getTier(config: PodflowConfig, podcastName: string): number {
  return getPodcastConfig(config, podcastName).tier;
}
