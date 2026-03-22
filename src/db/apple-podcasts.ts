import { execSync } from 'child_process';
import * as fs from 'fs';
import {
  CORE_DATA_EPOCH,
  APPLE_PODCASTS_DB,
  type RawDetailedEpisode,
  type DetailedEpisode,
} from '../types.js';

export function isAvailable(): boolean {
  return fs.existsSync(APPLE_PODCASTS_DB);
}

function runQuery(sql: string): string {
  const escaped = sql.replace(/"/g, '\\"');
  const cmd = `sqlite3 -json "${APPLE_PODCASTS_DB}" "${escaped}"`;
  try {
    return execSync(cmd, { encoding: 'utf-8', maxBuffer: 50 * 1024 * 1024 });
  } catch {
    return '[]';
  }
}

function coreDataToISO(timestamp: number | null): string {
  if (!timestamp) return '';
  return new Date((timestamp + CORE_DATA_EPOCH) * 1000).toISOString().split('T')[0];
}

export function queryCompletedEpisodes(recentDays?: number): DetailedEpisode[] {
  let dateFilter = '';
  if (recentDays) {
    const cutoff = Date.now() / 1000 - CORE_DATA_EPOCH - recentDays * 86400;
    dateFilter = `AND e.ZLASTDATEPLAYED > ${cutoff}`;
  }

  const sql = `
    SELECT
      e.ZTITLE as title,
      p.ZTITLE as podcast,
      e.ZPLAYCOUNT as playCount,
      e.ZDURATION as duration,
      e.ZLASTDATEPLAYED as lastPlayed,
      e.ZPUBDATE as pubDate,
      e.ZITEMDESCRIPTIONWITHOUTHTML as description,
      e.ZITEMDESCRIPTION as descriptionHtml,
      e.ZFREETRANSCRIPTSNIPPET as transcriptSnippet,
      e.ZWEBPAGEURL as webPageUrl,
      p.ZAUTHOR as podcastAuthor,
      p.ZCATEGORY as podcastCategory
    FROM ZMTEPISODE e
    JOIN ZMTPODCAST p ON e.ZPODCAST = p.Z_PK
    WHERE (e.ZPLAYCOUNT > 0 OR e.ZPLAYHEAD > 60)
    ${dateFilter}
    ORDER BY e.ZLASTDATEPLAYED DESC
  `.replace(/\n/g, ' ');

  const raw: RawDetailedEpisode[] = JSON.parse(runQuery(sql) || '[]');

  return raw.map(ep => ({
    title: (ep.title || 'Untitled').replace(/\s+/g, ' ').trim(),
    podcast: ep.podcast || 'Unknown',
    lastPlayed: coreDataToISO(ep.lastPlayed),
    pubDate: coreDataToISO(ep.pubDate),
    duration: ep.duration || 0,
    completed: (ep.playCount || 0) > 0,
    description: (ep.description || '').replace(/\s+/g, ' ').trim(),
    transcriptSnippet: ep.transcriptSnippet || '',
    webPageUrl: ep.webPageUrl || '',
    podcastAuthor: ep.podcastAuthor || '',
    podcastCategory: ep.podcastCategory || '',
  }));
}

export function querySubscriptions(): { title: string; author: string; episodeCount: number }[] {
  const sql = `
    SELECT
      p.ZTITLE as title,
      p.ZAUTHOR as author,
      COUNT(e.Z_PK) as episodeCount
    FROM ZMTPODCAST p
    LEFT JOIN ZMTEPISODE e ON e.ZPODCAST = p.Z_PK
    GROUP BY p.Z_PK
    ORDER BY p.ZTITLE
  `.replace(/\n/g, ' ');

  return JSON.parse(runQuery(sql) || '[]');
}
