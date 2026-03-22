import * as fs from 'fs';
import * as path from 'path';
import type { DigestCache, DigestEntry, GuestIndex } from './types.js';

const CACHE_DIR = path.join(process.env.HOME || '~', '.podflow');
const CACHE_PATH = path.join(CACHE_DIR, 'cache.json');

export function loadCache(): DigestCache {
  if (fs.existsSync(CACHE_PATH)) {
    return JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'));
  }
  return {
    lastRun: '',
    lastRunCost: 0,
    processedEpisodes: {},
    guestIndex: {},
    stats: { totalProcessed: 0, totalGuests: 0, totalIdeas: 0, totalCost: 0 },
  };
}

export function saveCache(cache: DigestCache): void {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}

export function isProcessed(cache: DigestCache, episodeKey: string): boolean {
  return episodeKey in cache.processedEpisodes;
}

export function makeKey(podcast: string, title: string): string {
  return `${podcast}::${title}`;
}

export function mergeEntries(
  cache: DigestCache,
  entries: Map<string, DigestEntry>,
  costUsd: number
): DigestCache {
  const updated = { ...cache };
  updated.lastRun = new Date().toISOString();
  updated.lastRunCost = costUsd;
  updated.stats = { ...cache.stats };
  updated.stats.totalCost += costUsd;
  updated.processedEpisodes = { ...cache.processedEpisodes };
  updated.guestIndex = { ...cache.guestIndex };

  for (const [key, entry] of entries) {
    updated.processedEpisodes[key] = entry;
    updated.stats.totalProcessed++;
    updated.stats.totalIdeas += entry.keyIdeas.length;

    for (const guest of entry.guests) {
      const socials = Array.isArray(guest.socials) ? guest.socials : [];
      const guestKey = guest.name.toLowerCase().replace(/\s+/g, '-');
      const existing = updated.guestIndex[guestKey];

      if (existing) {
        existing.episodeCount++;
        existing.episodes.push(`${entry.podcast}: ${entry.title}`);
        existing.lastSeen = entry.lastPlayed;
        if (guest.role && !existing.role) existing.role = guest.role;
        if (guest.company && !existing.company) existing.company = guest.company;
        if (socials.length > (Array.isArray(existing.socials) ? existing.socials : []).length)
          existing.socials = socials;
        if (guest.followWorthy) existing.followWorthy = true;
        if (guest.whyFollow && !existing.whyFollow) existing.whyFollow = guest.whyFollow;
      } else {
        updated.guestIndex[guestKey] = {
          name: guest.name,
          role: guest.role,
          company: guest.company,
          socials,
          episodeCount: 1,
          episodes: [`${entry.podcast}: ${entry.title}`],
          firstSeen: entry.lastPlayed,
          lastSeen: entry.lastPlayed,
          followWorthy: guest.followWorthy,
          whyFollow: guest.whyFollow,
        };
        updated.stats.totalGuests++;
      }
    }
  }

  return updated;
}
