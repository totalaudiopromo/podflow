#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { loadConfig, initConfig, configExists, getTier } from './config/index.js';
import { isAvailable, queryCompletedEpisodes } from './db/apple-podcasts.js';
import { prioritiseEpisodes } from './config/prioritiser.js';
import { extractBatch, estimateCost } from './ai/extractor.js';
import { loadCache, saveCache, isProcessed, makeKey, mergeEntries } from './cache.js';
import { generateDigest } from './output/markdown.js';
import * as ui from './ui/format.js';

const VERSION = '0.1.0';

const program = new Command()
  .name('podflow')
  .description('Your podcast listening, working for you.')
  .version(VERSION, '-v, --version');

// ── init ───────────────────────────────────────────────────────────

program
  .command('init')
  .description('Create config at ~/.podflow/')
  .action(async () => {
    ui.intro(VERSION);

    if (configExists()) {
      ui.stepComplete('Config already exists');
      ui.blank();
      ui.hint('Edit ~/.podflow/config.json to customise your interests');
      ui.hint('Edit ~/.podflow/podcasts.json to set podcast tiers');
      ui.blank();
      return;
    }

    const config = initConfig();
    ui.stepComplete('Config created at ~/.podflow/');
    ui.blank();
    ui.nextSteps([
      { cmd: 'nano ~/.podflow/config.json', desc: 'Set your "about" and interests' },
      { cmd: 'export ANTHROPIC_API_KEY=sk-ant-...', desc: 'Set your API key' },
      { cmd: 'podflow digest --dry-run', desc: 'Preview what would be processed' },
    ]);
    ui.blank();
  });

// ── digest ─────────────────────────────────────────────────────────

program
  .command('digest', { isDefault: true })
  .description('Process new episodes and generate digest')
  .option('--dry-run', 'Show what would be processed, no API calls')
  .option('--backfill', 'Process all episodes')
  .option('--max-episodes <n>', 'Limit episodes to process', '50')
  .option('--tier <n>', 'Only process specific tier (1-4)')
  .option('--include-all', 'Include tier 4 (entertainment)')
  .option('--provider <name>', 'AI provider: anthropic, openai, google, ollama')
  .option('--model <name>', 'Override model name')
  .option('--output <path>', 'Output file path')
  .option('--recent <days>', 'Days of history to scan', '365')
  .action(async (opts) => {
    const startTime = Date.now();
    ui.intro(VERSION);

    if (!configExists()) {
      ui.error('No config found');
      ui.hint('Run `podflow init` to create your config');
      ui.blank();
      process.exit(1);
    }

    const config = loadConfig();
    const maxEpisodes = parseInt(opts.backfill ? '9999' : opts.maxEpisodes, 10);
    const tierFilter = opts.tier ? parseInt(opts.tier, 10) : undefined;
    const recentDays = parseInt(opts.recent, 10);
    const mode = opts.dryRun ? 'DRY RUN' : opts.backfill ? 'BACKFILL' : 'INCREMENTAL';

    // Apply CLI overrides
    if (opts.provider) config.provider = opts.provider;
    if (opts.model) config.model = opts.model;
    if (opts.output) config.outputPath = opts.output;

    ui.providerInfo(config.provider, config.model);
    ui.modeInfo(mode);

    // ── Check Apple Podcasts DB ──
    if (!isAvailable()) {
      ui.error('Apple Podcasts database not found');
      ui.hint('Make sure you use the Podcasts app on your Mac with Sync Library enabled');
      ui.blank();
      process.exit(1);
    }

    // ── Load cache ──
    let cache = loadCache();
    if (cache.lastRun) {
      ui.cacheInfo(
        cache.lastRun.split('T')[0],
        cache.stats.totalProcessed,
        cache.stats.totalGuests,
        cache.stats.totalIdeas
      );
    }

    ui.divider();

    // ── Query episodes ──
    const spinner = ui.createSpinner('Querying Apple Podcasts database...');
    spinner.start();

    const allEpisodes = queryCompletedEpisodes(recentDays);
    spinner.succeed(`${allEpisodes.length} listened episodes found (last ${recentDays} days)`);

    // ── Prioritise ──
    const prioritised = prioritiseEpisodes(config, allEpisodes, {
      maxTier: tierFilter,
      includeAll: opts.includeAll,
    });
    ui.stepComplete(
      `${prioritised.length} after prioritisation ${chalk.dim(`(tier ${tierFilter || '1-3'})`)}`
    );

    // ── Filter processed ──
    const unprocessed = prioritised.filter(
      (ep) => !isProcessed(cache, makeKey(ep.podcast, ep.title))
    );
    ui.stepComplete(`${unprocessed.length} new episodes to process`);

    const toProcess = unprocessed.slice(0, maxEpisodes);
    if (toProcess.length < unprocessed.length) {
      ui.hint(`Capped at ${maxEpisodes} (use --max-episodes to change)`);
    }

    if (toProcess.length === 0) {
      ui.blank();
      ui.step('Nothing new to process.');
      if (cache.stats.totalProcessed > 0) {
        const regenSpinner = ui.createSpinner('Regenerating digest from cache...');
        regenSpinner.start();
        const outPath = generateDigest(cache, config);
        regenSpinner.succeed('Digest regenerated');
        ui.outputPath(outPath);
      }
      ui.outro(Date.now() - startTime);
      return;
    }

    // ── Tier breakdown ──
    ui.blank();
    ui.heading('Tier breakdown');
    const tierCounts: Record<number, number> = {};
    for (const ep of toProcess) {
      const t = getTier(config, ep.podcast);
      tierCounts[t] = (tierCounts[t] || 0) + 1;
    }
    for (const [tier, count] of Object.entries(tierCounts).sort()) {
      ui.tierRow(parseInt(tier), count);
    }

    // ── Cost estimate ──
    ui.blank();
    const estimate = estimateCost(toProcess, config);
    ui.costEstimate(estimate.estimatedCost, config.provider);

    // ── Dry run ──
    if (opts.dryRun) {
      ui.blank();
      ui.heading(chalk.yellow('DRY RUN -- no API calls'));
      ui.blank();
      ui.heading('Sample episodes');
      for (const ep of toProcess.slice(0, 15)) {
        const tier = getTier(config, ep.podcast);
        ui.episodeRow(ep.podcast, ep.title, `T${tier}`);
      }
      if (toProcess.length > 15) {
        ui.hint(`...and ${toProcess.length - 15} more`);
      }
      ui.blank();
      ui.outro(Date.now() - startTime);
      return;
    }

    // ── Process batches ──
    const BATCH_SIZE = 5;
    let totalInputTokens = 0;
    let totalOutputTokens = 0;
    let prevCost = 0;
    const totalBatches = Math.ceil(toProcess.length / BATCH_SIZE);

    for (let i = 0; i < toProcess.length; i += BATCH_SIZE) {
      const batch = toProcess.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;

      ui.batchHeader(batchNum, totalBatches, batch.length);
      for (const ep of batch) {
        ui.episodeRow(ep.podcast, ep.title);
      }

      const batchSpinner = ui.createSpinner('Extracting...');
      batchSpinner.start();

      try {
        const result = await Promise.race([
          extractBatch(config, batch),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('API call timed out after 60s')), 60_000)
          ),
        ]);

        totalInputTokens += result.inputTokens;
        totalOutputTokens += result.outputTokens;

        const guestCount = [...result.entries.values()].reduce(
          (sum, e) => sum + e.guests.length,
          0
        );
        const ideaCount = [...result.entries.values()].reduce(
          (sum, e) => sum + e.keyIdeas.length,
          0
        );

        batchSpinner.stop();
        ui.batchResult(guestCount, ideaCount, {
          input: result.inputTokens,
          output: result.outputTokens,
        });

        if (result.entries.size > 0) {
          const rates: Record<string, { input: number; output: number }> = {
            anthropic: { input: 0.8, output: 4.0 },
            openai: { input: 0.15, output: 0.6 },
            google: { input: 0.075, output: 0.3 },
            ollama: { input: 0, output: 0 },
          };
          const rate = rates[config.provider] || rates.anthropic;
          const runningCost =
            (totalInputTokens / 1_000_000) * rate.input +
            (totalOutputTokens / 1_000_000) * rate.output;
          const deltaCost = runningCost - prevCost;
          prevCost = runningCost;

          cache = mergeEntries(cache, result.entries, deltaCost);
          saveCache(cache);
        }
      } catch (err) {
        batchSpinner.stop();
        ui.batchError((err as Error).message);
      }
    }

    // ── Final output ──
    ui.divider();

    const rates: Record<string, { input: number; output: number }> = {
      anthropic: { input: 0.8, output: 4.0 },
      openai: { input: 0.15, output: 0.6 },
      google: { input: 0.075, output: 0.3 },
      ollama: { input: 0, output: 0 },
    };
    const rate = rates[config.provider] || rates.anthropic;
    const actualCost =
      (totalInputTokens / 1_000_000) * rate.input +
      (totalOutputTokens / 1_000_000) * rate.output;
    const costStr =
      config.provider === 'ollama' ? 'free (local)' : `$${actualCost.toFixed(4)}`;

    ui.blank();
    ui.runSummary({
      processed: toProcess.length,
      guests: cache.stats.totalGuests,
      ideas: cache.stats.totalIdeas,
      cost: costStr,
    });

    const digestSpinner = ui.createSpinner('Generating digest...');
    digestSpinner.start();
    const outPath = generateDigest(cache, config);
    digestSpinner.succeed('Digest generated');
    ui.outputPath(outPath);

    ui.blank();
    ui.nextSteps([
      { cmd: `cat ${outPath}`, desc: 'View your digest' },
      { cmd: 'podflow digest', desc: 'Process new episodes next time' },
    ]);

    ui.outro(Date.now() - startTime);
  });

// ── subscriptions ──────────────────────────────────────────────────

program
  .command('subs')
  .description('List your podcast subscriptions')
  .action(async () => {
    ui.intro(VERSION);

    if (!isAvailable()) {
      ui.error('Apple Podcasts database not found');
      ui.blank();
      process.exit(1);
    }

    const { querySubscriptions } = await import('./db/apple-podcasts.js');
    const subs = querySubscriptions();

    ui.heading(`${subs.length} podcasts`);
    ui.blank();

    const config = configExists() ? loadConfig() : null;

    for (const sub of subs) {
      const tier = config ? getTier(config, sub.title) : 3;
      const tierLabel = chalk.dim(`T${tier}`);
      const name = (sub.title || '(untitled)').padEnd(40);
      const count = chalk.dim(`${sub.episodeCount} eps`);
      console.log(`  ${tierLabel}  ${name} ${count}`);
    }

    ui.blank();
    if (!config) {
      ui.hint('Run `podflow init` to configure podcast tiers');
    } else {
      ui.hint('Edit ~/.podflow/podcasts.json to adjust tiers');
    }
    ui.blank();
  });

// ── stats ──────────────────────────────────────────────────────────

program
  .command('stats')
  .description('Show cache statistics')
  .action(async () => {
    ui.intro(VERSION);

    const cache = loadCache();
    if (!cache.lastRun) {
      ui.step('No data yet. Run `podflow digest` to get started.');
      ui.blank();
      return;
    }

    ui.heading('Statistics');
    ui.blank();
    ui.stat('Episodes', cache.stats.totalProcessed);
    ui.stat('Guests', cache.stats.totalGuests);
    ui.stat('Ideas', cache.stats.totalIdeas);
    ui.stat('Total cost', `$${cache.stats.totalCost.toFixed(2)}`);
    ui.stat('Last run', cache.lastRun.split('T')[0]);
    ui.stat('Last run cost', `$${cache.lastRunCost.toFixed(4)}`);

    const entries = Object.values(cache.processedEpisodes);
    const guests = Object.values(cache.guestIndex);

    // Top guests
    const followWorthy = guests.filter((g) => g.followWorthy).length;
    const multiAppearance = guests.filter((g) => g.episodeCount > 1).length;

    ui.blank();
    ui.divider();
    ui.blank();
    ui.stat('Follow-worthy', followWorthy, 'guests');
    ui.stat('Multi-appearance', multiAppearance, 'guests');

    // High relevance episodes
    const highRelevance = entries.filter((e) => e.relevanceScore >= 7).length;
    ui.stat('High relevance', highRelevance, 'episodes (7+)');

    // Unique podcasts
    const podcasts = new Set(entries.map((e) => e.podcast));
    ui.stat('Unique podcasts', podcasts.size);

    ui.blank();
  });

// ── parse ──────────────────────────────────────────────────────────

program.parse();
