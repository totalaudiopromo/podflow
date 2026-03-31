import type { DetailedEpisode, PodflowConfig } from '../types.js';
import { getPodcastConfig, getTier } from './index.js';

function shouldSkip(config: PodflowConfig, episode: DetailedEpisode): boolean {
  const podConfig = getPodcastConfig(config, episode.podcast);

  if (podConfig.tier === 4) return true;

  if (podConfig.skipPatterns) {
    const titleLower = episode.title.toLowerCase();
    for (const pattern of podConfig.skipPatterns) {
      if (titleLower.includes(pattern.toLowerCase())) return true;
    }
  }

  return false;
}

export function prioritiseEpisodes(
  config: PodflowConfig,
  episodes: DetailedEpisode[],
  opts: { maxTier?: number; includeAll?: boolean } = {}
): DetailedEpisode[] {
  const { maxTier, includeAll = false } = opts;

  let filtered = episodes;

  if (!includeAll) {
    filtered = episodes.filter(ep => !shouldSkip(config, ep));
  }

  if (maxTier) {
    filtered = filtered.filter(ep => getTier(config, ep.podcast) <= maxTier);
  }

  return filtered.sort((a, b) => {
    const tierDiff = getTier(config, a.podcast) - getTier(config, b.podcast);
    if (tierDiff !== 0) return tierDiff;
    return new Date(b.lastPlayed).getTime() - new Date(a.lastPlayed).getTime();
  });
}
