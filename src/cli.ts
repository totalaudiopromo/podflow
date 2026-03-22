#!/usr/bin/env node

import { loadConfig, initConfig, configExists, getTier } from './config/index.js';
import { isAvailable, queryCompletedEpisodes } from './db/apple-podcasts.js';
import { prioritiseEpisodes } from './config/prioritiser.js';
import { extractBatch, estimateCost } from './ai/extractor.js';
import { loadCache, saveCache, isProcessed, makeKey, mergeEntries } from './cache.js';
import { generateDigest } from './output/markdown.js';

const VERSION = '0.1.0';

function parseArgs() {
  const args = process.argv.slice(2);
  const command = args[0] || 'digest';

  const getFlag = (name: string) => args.includes(`--${name}`);
  const getValue = (name: string): string | undefined => {
    const idx = args.indexOf(`--${name}`);
    return idx !== -1 ? args[idx + 1] : undefined;
  };

  return {
    command,
    help: getFlag('help') || args.includes('-h'),
    version: getFlag('version') || args.includes('-v'),
    dryRun: getFlag('dry-run'),
    backfill: getFlag('backfill'),
    maxEpisodes: parseInt(getValue('max-episodes') || (getFlag('backfill') ? '9999' : '50'), 10),
    tier: getValue('tier') ? parseInt(getValue('tier')!, 10) : undefined,
    includeAll: getFlag('include-all'),
    provider: getValue('provider') as 'anthropic' | 'openai' | 'google' | 'ollama' | undefined,
    model: getValue('model'),
    output: getValue('output'),
    recentDays: parseInt(getValue('recent') || '365', 10),
  };
}

function showHelp() {
  console.log(`
podflow v${VERSION} -- Podcast Listen Intelligence

Usage:
  podflow init                Create config at ~/.podflow/
  podflow digest              Process new episodes (default)
  podflow digest --dry-run    Show what would be processed
  podflow digest --backfill   Process all episodes

Options:
  --max-episodes N    Limit episodes to process (default: 50)
  --tier N            Only process specific tier (1-4)
  --include-all       Include tier 4 (entertainment)
  --provider NAME     AI provider: anthropic, openai, google, ollama
  --model NAME        Override model name
  --output PATH       Output file path
  --recent N          Days of history to scan (default: 365)
  --help, -h          Show this help
  --version, -v       Show version

Providers need API keys in environment:
  anthropic   ANTHROPIC_API_KEY
  openai      OPENAI_API_KEY
  google      GOOGLE_GENERATIVE_AI_API_KEY
  ollama      (no key needed, runs locally)

Examples:
  podflow init
  podflow digest --dry-run
  podflow digest --max-episodes 10
  podflow digest --provider openai --model gpt-4o-mini
  podflow digest --backfill --provider ollama --model llama3.2
`);
}

async function runInit() {
  if (configExists()) {
    console.log('Config already exists at ~/.podflow/');
    console.log('Edit ~/.podflow/config.json to customise your interests.');
    console.log('Edit ~/.podflow/podcasts.json to set podcast tiers.');
    return;
  }

  const config = initConfig();
  console.log('Created config at ~/.podflow/');
  console.log('');
  console.log('Next steps:');
  console.log('  1. Edit ~/.podflow/config.json');
  console.log('     - Set "about" to describe yourself and your work');
  console.log('     - Customise "interests" with your topic areas');
  console.log(`     - Set "provider" (default: ${config.provider})`);
  console.log('  2. Set your API key:');
  console.log('     export ANTHROPIC_API_KEY=sk-ant-...');
  console.log('  3. Run: podflow digest --dry-run');
}

async function runDigest() {
  const opts = parseArgs();

  if (!configExists()) {
    console.log('No config found. Run `podflow init` first.');
    process.exit(1);
  }

  const config = loadConfig();

  // Apply CLI overrides
  if (opts.provider) config.provider = opts.provider;
  if (opts.model) config.model = opts.model;
  if (opts.output) config.outputPath = opts.output;

  console.log('Podcast Digest');
  console.log('==============');
  console.log(`Provider: ${config.provider} (${config.model})`);
  console.log(`Mode: ${opts.dryRun ? 'DRY RUN' : opts.backfill ? 'BACKFILL' : 'INCREMENTAL'}`);

  if (!isAvailable()) {
    console.error('Apple Podcasts database not found.');
    console.error('Make sure you use the Podcasts app on your Mac with Sync Library enabled.');
    process.exit(1);
  }

  let cache = loadCache();
  if (cache.lastRun) {
    console.log(`\nLast run: ${cache.lastRun.split('T')[0]}`);
    console.log(
      `  ${cache.stats.totalProcessed} episodes processed, ${cache.stats.totalGuests} guests, ${cache.stats.totalIdeas} ideas`
    );
  }

  console.log(`\nQuerying Apple Podcasts DB (last ${opts.recentDays} days)...`);
  const allEpisodes = queryCompletedEpisodes(opts.recentDays);
  console.log(`  ${allEpisodes.length} listened episodes found`);

  const prioritised = prioritiseEpisodes(config, allEpisodes, {
    maxTier: opts.tier,
    includeAll: opts.includeAll,
  });
  console.log(
    `  ${prioritised.length} after prioritisation (tier ${opts.tier || '1-3'}, excluding entertainment)`
  );

  const unprocessed = prioritised.filter(ep => !isProcessed(cache, makeKey(ep.podcast, ep.title)));
  console.log(`  ${unprocessed.length} new episodes to process`);

  const toProcess = unprocessed.slice(0, opts.maxEpisodes);
  if (toProcess.length < unprocessed.length) {
    console.log(`  Capped at ${opts.maxEpisodes} episodes (use --max-episodes to change)`);
  }

  if (toProcess.length === 0) {
    console.log('\nNo new episodes to process.');
    if (cache.stats.totalProcessed > 0) {
      console.log('Regenerating digest from cache...');
      const outputPath = generateDigest(cache, config);
      console.log(`Digest written to: ${outputPath}`);
    }
    return;
  }

  // Show tier breakdown
  const tierCounts: Record<number, number> = {};
  for (const ep of toProcess) {
    const t = getTier(config, ep.podcast);
    tierCounts[t] = (tierCounts[t] || 0) + 1;
  }
  console.log(`\nTier breakdown:`);
  for (const [tier, count] of Object.entries(tierCounts).sort()) {
    console.log(`  Tier ${tier}: ${count} episodes`);
  }

  const estimate = estimateCost(toProcess, config);
  console.log(
    `\nEstimated cost: ${estimate.estimatedCost} (${estimate.inputTokens} input + ${estimate.outputTokens} output tokens)`
  );

  if (opts.dryRun) {
    console.log('\n--- DRY RUN -- no API calls made ---');
    console.log('\nSample episodes that would be processed:');
    for (const ep of toProcess.slice(0, 10)) {
      const tier = getTier(config, ep.podcast);
      const hasTranscript = ep.transcriptSnippet.length > 2;
      console.log(`  [T${tier}] ${ep.podcast}: ${ep.title}`);
      console.log(
        `        ${ep.lastPlayed} | desc: ${ep.description.length} chars | transcript: ${hasTranscript ? 'yes' : 'no'}`
      );
    }
    if (toProcess.length > 10) {
      console.log(`  ... and ${toProcess.length - 10} more`);
    }
    return;
  }

  // Process in batches
  const BATCH_SIZE = 5;
  let totalInputTokens = 0;
  let totalOutputTokens = 0;
  let prevCost = 0;

  console.log(`\nProcessing ${toProcess.length} episodes in batches of ${BATCH_SIZE}...`);

  for (let i = 0; i < toProcess.length; i += BATCH_SIZE) {
    const batch = toProcess.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(toProcess.length / BATCH_SIZE);

    console.log(`\n  Batch ${batchNum}/${totalBatches} (${batch.length} episodes):`);
    for (const ep of batch) {
      console.log(`    ${ep.podcast}: ${ep.title}`);
    }

    try {
      const result = await Promise.race([
        extractBatch(config, batch),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('API call timed out after 60s')), 60_000)
        ),
      ]);
      totalInputTokens += result.inputTokens;
      totalOutputTokens += result.outputTokens;

      const guestCount = [...result.entries.values()].reduce((sum, e) => sum + e.guests.length, 0);
      const ideaCount = [...result.entries.values()].reduce((sum, e) => sum + e.keyIdeas.length, 0);
      console.log(
        `    Extracted: ${guestCount} guests, ${ideaCount} ideas (${result.inputTokens} in / ${result.outputTokens} out tokens)`
      );

      if (result.entries.size > 0) {
        // Estimate running cost for this provider
        const rates: Record<string, { input: number; output: number }> = {
          anthropic: { input: 0.8, output: 4.0 },
          openai: { input: 0.15, output: 0.6 },
          google: { input: 0.075, output: 0.3 },
          ollama: { input: 0, output: 0 },
        };
        const rate = rates[config.provider] || rates.anthropic;
        const runningCost =
          (totalInputTokens / 1_000_000) * rate.input + (totalOutputTokens / 1_000_000) * rate.output;
        const deltaCost = runningCost - prevCost;
        prevCost = runningCost;

        cache = mergeEntries(cache, result.entries, deltaCost);
        saveCache(cache);
      }
    } catch (err) {
      console.error(`    Batch failed: ${(err as Error).message}`);
    }
  }

  // Final stats
  const rates: Record<string, { input: number; output: number }> = {
    anthropic: { input: 0.8, output: 4.0 },
    openai: { input: 0.15, output: 0.6 },
    google: { input: 0.075, output: 0.3 },
    ollama: { input: 0, output: 0 },
  };
  const rate = rates[config.provider] || rates.anthropic;
  const actualCost =
    (totalInputTokens / 1_000_000) * rate.input + (totalOutputTokens / 1_000_000) * rate.output;

  const costStr = config.provider === 'ollama' ? 'free (local)' : `$${actualCost.toFixed(4)}`;
  console.log(
    `\nTotal: ${totalInputTokens} input + ${totalOutputTokens} output tokens = ${costStr}`
  );

  const outputPath = generateDigest(cache, config);
  console.log(`\nDigest written to: ${outputPath}`);
  console.log(
    `  ${cache.stats.totalProcessed} episodes, ${cache.stats.totalGuests} guests, ${cache.stats.totalIdeas} ideas`
  );
}

async function main() {
  const opts = parseArgs();

  if (opts.version) {
    console.log(`podflow v${VERSION}`);
    return;
  }

  if (opts.help) {
    showHelp();
    return;
  }

  switch (opts.command) {
    case 'init':
      await runInit();
      break;
    case 'digest':
      await runDigest();
      break;
    default:
      console.error(`Unknown command: ${opts.command}`);
      showHelp();
      process.exit(1);
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
