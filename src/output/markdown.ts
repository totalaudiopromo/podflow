import * as fs from 'fs';
import * as path from 'path';
import type { DigestCache, PodflowConfig } from '../types.js';

export function generateDigest(cache: DigestCache, config: PodflowConfig): string {
  const entries = Object.values(cache.processedEpisodes);
  const guests = Object.values(cache.guestIndex);

  entries.sort((a, b) => new Date(b.lastPlayed).getTime() - new Date(a.lastPlayed).getTime());

  const lines: string[] = [
    '# Podcast Digest',
    '',
    `> ${cache.stats.totalProcessed} episodes processed. ${cache.stats.totalGuests} guests identified. ${cache.stats.totalIdeas} ideas extracted.`,
    `> Last run: ${cache.lastRun.split('T')[0]}. Total cost: $${cache.stats.totalCost.toFixed(2)}.`,
    '',
  ];

  // === People to Follow ===
  lines.push('## People to Follow', '');

  const followWorthy = guests
    .filter(g => g.followWorthy)
    .sort((a, b) => b.episodeCount - a.episodeCount);
  const otherGuests = guests
    .filter(g => !g.followWorthy && g.episodeCount > 1)
    .sort((a, b) => b.episodeCount - a.episodeCount);

  if (followWorthy.length > 0) {
    lines.push('### Recommended (flagged as follow-worthy)', '');
    lines.push('| Name | Role | Company | Appearances | Why Follow |');
    lines.push('|------|------|---------|-------------|------------|');
    for (const g of followWorthy) {
      const socialsList = Array.isArray(g.socials) ? g.socials : [];
      const socials = socialsList.length > 0 ? ` ${socialsList.join(', ')}` : '';
      lines.push(
        `| ${g.name}${socials} | ${g.role} | ${g.company} | ${g.episodeCount} | ${g.whyFollow} |`
      );
    }
    lines.push('');
  }

  if (otherGuests.length > 0) {
    lines.push('### Repeat Guests (appeared 2+ times)', '');
    lines.push('| Name | Role | Company | Appearances | Episodes |');
    lines.push('|------|------|---------|-------------|----------|');
    for (const g of otherGuests.slice(0, 30)) {
      const epList = g.episodes.slice(0, 2).join('; ');
      lines.push(`| ${g.name} | ${g.role} | ${g.company} | ${g.episodeCount} | ${epList} |`);
    }
    lines.push('');
  }

  // === Ideas by Topic ===
  lines.push('## Ideas by Topic', '');

  const ideaByTopic = new Map<
    string,
    { idea: string; episode: string; podcast: string; relevance: number }[]
  >();
  for (const t of config.interests) ideaByTopic.set(t.name, []);

  for (const entry of entries) {
    for (const idea of entry.keyIdeas) {
      let bestTopic = '';
      let bestScore = 0;
      const ideaCatLower = (idea.category || '').toLowerCase();

      for (const topic of config.interests) {
        const topicWords = topic.name.toLowerCase().split(/\s+/);
        const score = topicWords.filter(w => ideaCatLower.includes(w)).length;
        if (score > bestScore) {
          bestScore = score;
          bestTopic = topic.name;
        }
      }

      if (!bestTopic && config.interests.length > 0) bestTopic = config.interests[0].name;

      ideaByTopic.get(bestTopic)?.push({
        idea: idea.idea,
        episode: entry.title,
        podcast: entry.podcast,
        relevance: idea.relevance,
      });
    }
  }

  for (const topic of config.interests) {
    const topicIdeas = ideaByTopic.get(topic.name) || [];
    if (topicIdeas.length === 0) continue;

    topicIdeas.sort((a, b) => b.relevance - a.relevance);
    const top = topicIdeas.slice(0, 10);

    lines.push(`### ${topic.name}`, '');
    for (const item of top) {
      lines.push(`- **${item.episode}** (${item.podcast}) -- ${item.idea}`);
    }
    lines.push('');
  }

  // === High Relevance episodes ===
  const highRelevance = entries
    .filter(e => e.relevanceScore >= 7)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 20);

  if (highRelevance.length > 0) {
    lines.push('## High Relevance (score >= 7)', '');
    for (const ep of highRelevance) {
      lines.push(`### ${ep.title}`);
      lines.push(`**${ep.podcast}** | ${ep.lastPlayed} | Score: ${ep.relevanceScore}/10`);
      if (ep.relevanceNote) {
        lines.push(`> ${ep.relevanceNote}`);
      }
      if (ep.guests.length > 0) {
        lines.push(
          `Guests: ${ep.guests.map(g => `${g.name} (${g.role}, ${g.company})`).join(', ')}`
        );
      }
      if (ep.keyIdeas.length > 0) {
        for (const idea of ep.keyIdeas) {
          lines.push(`- ${idea.idea}`);
        }
      }
      lines.push('');
    }
  }

  // === Recent Insights (last 30 days) ===
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recent = entries.filter(e => new Date(e.lastPlayed) >= thirtyDaysAgo);

  if (recent.length > 0) {
    lines.push('## Recent Insights (last 30 days)', '');
    for (const ep of recent) {
      if (ep.keyIdeas.length === 0 && ep.guests.length === 0) continue;
      lines.push(`**${ep.lastPlayed}** -- ${ep.title} (${ep.podcast})`);
      for (const idea of ep.keyIdeas) {
        lines.push(`- ${idea.idea}`);
      }
      if (ep.guests.length > 0) {
        lines.push(`- Guests: ${ep.guests.map(g => g.name).join(', ')}`);
      }
      lines.push('');
    }
  }

  // === Guest Index ===
  lines.push('## Guest Index', '');
  lines.push(`${guests.length} unique guests extracted.`, '');

  const sortedGuests = guests.sort((a, b) => a.name.localeCompare(b.name));
  for (const g of sortedGuests) {
    const socialsList = Array.isArray(g.socials) ? g.socials : [];
    const socials = socialsList.length > 0 ? ` | ${socialsList.join(', ')}` : '';
    const badge = g.followWorthy ? ' *' : '';
    lines.push(
      `- **${g.name}**${badge} -- ${g.role}, ${g.company} (${g.episodeCount} eps)${socials}`
    );
  }
  lines.push('');

  const content = lines.join('\n');

  // Write to file
  const outputPath = path.resolve(config.outputPath);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, content);

  return outputPath;
}
