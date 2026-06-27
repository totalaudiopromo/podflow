import Parser from 'rss-parser';
import * as fs from 'fs';
import type { DetailedEpisode } from '../types.js';

const parser = new Parser();

function formatPubDate(pubDateStr?: string): string {
  if (!pubDateStr) return new Date().toISOString().split('T')[0];
  try {
    return new Date(pubDateStr).toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

function parseDuration(durationStr?: string | number): number {
  if (!durationStr) return 0;
  if (typeof durationStr === 'number') return durationStr;
  
  const parts = durationStr.split(':').map(Number);
  if (parts.some(isNaN)) return 0;
  
  if (parts.length === 3) {
    // HH:MM:SS
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    // MM:SS
    return parts[0] * 60 + parts[1];
  }
  return parts[0] || 0;
}

export async function fetchRssEpisodes(feedUrl: string, limit = 20): Promise<DetailedEpisode[]> {
  try {
    const feed = await parser.parseURL(feedUrl);
    const podcastName = feed.title || 'Unknown Podcast';
    const author = feed.itunes?.author || feed.creator || 'Unknown Author';
    
    // Support category lists, e.g., ["Business", "Technology"]
    const category = Array.isArray(feed.categories) 
      ? feed.categories.join(', ') 
      : feed.itunes?.categories 
        ? (Array.isArray(feed.itunes.categories) ? feed.itunes.categories.join(', ') : String(feed.itunes.categories))
        : 'Unknown Category';

    const items = feed.items || [];
    const sliced = items.slice(0, limit);

    return sliced.map(item => {
      const pubDate = formatPubDate(item.pubDate);
      const cleanDesc = (item.contentSnippet || item.summary || item.content || '')
        .replace(/\s+/g, ' ')
        .trim();

      return {
        title: (item.title || 'Untitled').replace(/\s+/g, ' ').trim(),
        podcast: podcastName,
        lastPlayed: pubDate, // In RSS mode, treat pubDate as lastPlayed to allow processing
        pubDate: pubDate,
        duration: parseDuration(item.itunes?.duration),
        completed: true, // RSS feeds are processed on-demand
        description: cleanDesc,
        transcriptSnippet: '',
        webPageUrl: item.link || item.enclosure?.url || '',
        podcastAuthor: author,
        podcastCategory: category,
      };
    });
  } catch (error) {
    console.error(`Error fetching RSS feed ${feedUrl}:`, (error as Error).message);
    return [];
  }
}

export function parseOpmlFeeds(filePath: string): string[] {
  if (!fs.existsSync(filePath)) {
    throw new Error(`OPML file not found: ${filePath}`);
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  // Simple XML tag attributes match for xmlUrl
  const matches = content.matchAll(/xmlUrl="([^"]+)"/g);
  const urls: string[] = [];
  for (const match of matches) {
    if (match[1] && !urls.includes(match[1])) {
      urls.push(match[1]);
    }
  }
  return urls;
}
