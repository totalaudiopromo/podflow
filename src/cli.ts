#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { loadConfig, initConfig, configExists, getTier, saveConfig } from './config/index.js';
import type { DetailedEpisode } from './types.js';
import { isAvailable, queryCompletedEpisodes } from './db/apple-podcasts.js';
import { prioritiseEpisodes } from './config/prioritiser.js';
import { extractBatch, estimateCost } from './ai/extractor.js';
import { loadCache, saveCache, isProcessed, makeKey, mergeEntries } from './cache.js';
import { generateDigest } from './output/markdown.js';
import * as ui from './ui/format.js';

const VERSION = '0.2.0';

// ── init ───────────────────────────────────────────────────────────

const PROVIDER_CHOICES = [
  { key: 'anthropic', label: 'Anthropic (Claude Haiku — recommended)', envVar: 'ANTHROPIC_API_KEY' },
  { key: 'openai', label: 'OpenAI (gpt-4o-mini)', envVar: 'OPENAI_API_KEY' },
  { key: 'google', label: 'Google (Gemini Flash)', envVar: 'GOOGLE_GENERATIVE_AI_API_KEY' },
  { key: 'ollama', label: 'Ollama (local, free, no key)', envVar: '' },
  { key: 'openrouter', label: 'OpenRouter (Claude/Llama/Gemini via OpenRouter Key)', envVar: 'OPENROUTER_API_KEY' },
] as const;

function registerInit(program: Command): void {
  program
    .command('init')
    .description('Set up podflow (interactive) — config lands at ~/.podflow/')
    .option('-y, --yes', 'Skip the wizard and write defaults (old behaviour)')
    .action(async (opts) => {
      ui.intro(VERSION);

      if (configExists()) {
        ui.stepComplete('Config already exists');
        ui.blank();
        ui.hint('Edit ~/.podflow/config.json to customise your interests');
        ui.hint('Edit ~/.podflow/podcasts.json to set podcast tiers');
        ui.blank();
        return;
      }

      // Non-interactive path: --yes flag, or no TTY (CI, scripts, agents).
      if (opts.yes || !process.stdin.isTTY) {
        initConfig();
        ui.stepComplete('Config created at ~/.podflow/ (defaults)');
        ui.blank();
        ui.nextSteps([
          { cmd: 'nano ~/.podflow/config.json', desc: 'Set your interests' },
          { cmd: 'export ANTHROPIC_API_KEY=...', desc: 'Set your API key' },
          { cmd: 'podflow digest --dry-run', desc: 'Preview episodes' },
        ]);
        ui.blank();
        return;
      }

      // Interactive wizard — a human's first five minutes should not involve
      // hand-editing JSON.
      const { createInterface } = await import('node:readline/promises');
      const rl = createInterface({ input: process.stdin, output: process.stdout });
      const ask = async (q: string, fallback = ''): Promise<string> => {
        const answer = (await rl.question(q)).trim();
        return answer || fallback;
      };

      try {
        const config = initConfig();

        console.log('');
        const about = await ask(
          'What do you do? (one line, used to judge relevance)\n> ',
          config.about
        );
        config.about = about;

        console.log('\nWhich AI provider?');
        PROVIDER_CHOICES.forEach((p, i) => console.log(`  ${i + 1}. ${p.label}`));
        const provIdx = parseInt(await ask('> ', '1'), 10);
        const chosen = PROVIDER_CHOICES[Math.min(Math.max(provIdx, 1), 4) - 1];
        config.provider = chosen.key;
        config.model = ''; // let getModel pick the provider default

        if (chosen.envVar) {
          const envKey = process.env[chosen.envVar];
          if (envKey) {
            const useEnv = await ask(
              `\nFound ${chosen.envVar} in your environment. Use it? (Y/n) > `,
              'y'
            );
            if (useEnv.toLowerCase().startsWith('y')) {
              // Store in config so scheduled runs work without shell env.
              config.apiKey = envKey;
            }
          }
          if (!config.apiKey) {
            const pasted = await ask(
              `\nPaste your ${chosen.envVar.replace(/_/g, ' ').toLowerCase()} (stored in ~/.podflow/config.json, chmod 600; leave blank to use the env var later)\n> `
            );
            if (pasted) config.apiKey = pasted;
          }
        }

        const interests = await ask(
          '\nYour interest topics, comma-separated (blank keeps sensible defaults)\n> '
        );
        if (interests) {
          config.interests = interests.split(',').map((raw) => {
            const name = raw.trim();
            return { name, keywords: [name.toLowerCase()], why: `Interested in ${name}.` };
          });
        }

        saveConfig(config);
        console.log('');
        ui.stepComplete('Config created at ~/.podflow/');
        ui.blank();
        ui.nextSteps([
          { cmd: 'podflow digest --dry-run', desc: 'Preview episodes (no API calls)' },
          { cmd: 'podflow digest --max-episodes 10', desc: 'Run your first digest' },
          { cmd: 'podflow schedule', desc: 'Get a digest every week, automatically' },
        ]);
        ui.blank();
      } finally {
        rl.close();
      }
    });
}

// ── digest ─────────────────────────────────────────────────────────

function registerDigest(program: Command): void {
  program
    .command('digest', { isDefault: true })
    .description('Process episodes and generate digest')
    .option('--dry-run', 'Preview without API calls')
    .option('--backfill', 'Process all episodes')
    .option('--max-episodes <n>', 'Limit episodes to process', '50')
    .option('--tier <n>', 'Only process specific tier (1-4)')
    .option('--include-all', 'Include tier 4 (entertainment)')
    .option('--provider <name>', 'AI provider: anthropic, openai, google, ollama')
    .option('--model <name>', 'Override model name')
    .option('--output <path>', 'Output file path')
    .option('--recent <days>', 'Days of history to scan', '365')
    .option('--verbose', 'Show episode details')
    .option('--rss <url>', 'Process a specific RSS feed URL')
    .option('-q, --quiet', 'Suppress output except errors')
    .option('--scheduled', 'Scheduled-run mode: end with a macOS notification')
    .action(async (opts) => {
      const startTime = Date.now();

      if (!opts.quiet) ui.intro(VERSION);

      if (!configExists()) {
        ui.error('No config found. Run `podflow init` first.');
        process.exit(1);
      }

      const config = loadConfig();
      const maxEpisodes = parseInt(opts.backfill ? '9999' : opts.maxEpisodes, 10);
      const tierFilter = opts.tier ? parseInt(opts.tier, 10) : undefined;
      const recentDays = parseInt(opts.recent, 10);
      const mode = opts.dryRun ? 'dry run' : opts.backfill ? 'backfill' : 'incremental';

      if (opts.provider) config.provider = opts.provider;
      if (opts.model) config.model = opts.model;
      if (opts.output) config.outputPath = opts.output;

      if (!opts.quiet) {
        ui.step(
          `Processing ${chalk.bold(mode)} through ${config.provider} ${chalk.dim(`(${config.model})`)}`
        );
        ui.blank();
      }

      // ── Load cache ──
      let cache = loadCache();
      // Snapshot for this run's delta (used by the --scheduled notification).
      const statsBefore = { ...cache.stats };

      // ── Query ──
      let allEpisodes: DetailedEpisode[] = [];
      const rssUrl = opts.rss;

      if (rssUrl) {
        const spinner = ui.createSpinner(`Reading RSS feed: ${rssUrl}...`);
        spinner.start();
        const { fetchRssEpisodes } = await import('./db/rss.js');
        allEpisodes = await fetchRssEpisodes(rssUrl, 20);
        spinner.succeed(`${allEpisodes.length} RSS episodes found`);
      } else if (config.feeds && config.feeds.length > 0) {
        const spinner = ui.createSpinner(`Reading ${config.feeds.length} RSS feeds...`);
        spinner.start();
        const { fetchRssEpisodes } = await import('./db/rss.js');
        for (const feed of config.feeds) {
          const eps = await fetchRssEpisodes(feed, 10);
          allEpisodes.push(...eps);
        }
        spinner.succeed(`${allEpisodes.length} RSS episodes found`);
      } else {
        if (!isAvailable()) {
          ui.error('Apple Podcasts database not found, and no RSS feeds configured.');
          ui.hint('Sync Library must be enabled in the Podcasts app or configure RSS feeds in config.json.');
          process.exit(1);
        }
        const spinner = ui.createSpinner('Reading Apple Podcasts...');
        spinner.start();
        allEpisodes = queryCompletedEpisodes(recentDays);
        spinner.succeed(`${allEpisodes.length} listened episodes`);
      }

      // ── Prioritise ──
      const prioritised = prioritiseEpisodes(config, allEpisodes, {
        maxTier: tierFilter,
        includeAll: opts.includeAll,
      });

      // ── Filter ──
      const unprocessed = prioritised.filter(
        (ep) => !isProcessed(cache, makeKey(ep.podcast, ep.title))
      );
      const toProcess = unprocessed.slice(0, maxEpisodes);

      if (!opts.quiet) {
        ui.validationRow('ok', 'prioritised', prioritised.length, 'episodes');
        ui.validationRow(
          unprocessed.length > 0 ? 'ok' : 'warn',
          'new',
          unprocessed.length,
          'episodes',
        );
        if (cache.stats.totalProcessed > 0) {
          ui.validationRow('ok', 'cached', cache.stats.totalProcessed, 'episodes');
        }
      }

      if (toProcess.length < unprocessed.length && !opts.quiet) {
        ui.hint(`Capped at ${maxEpisodes} (use --max-episodes to change)`);
      }

      if (toProcess.length === 0) {
        if (!opts.quiet) ui.blank();
        let outPath = config.outputPath;
        if (cache.stats.totalProcessed > 0) {
          const regen = ui.createSpinner('Regenerating digest...');
          regen.start();
          outPath = generateDigest(cache, config);
          regen.succeed('Digest regenerated');
          ui.outputPath(outPath);
        } else {
          ui.step('Nothing to process.');
        }
        // Scheduled runs notify even when quiet — most weeks land here.
        if (opts.scheduled) {
          const { notifyDigest } = await import('./schedule.js');
          notifyDigest(0, 0, 0, outPath);
        }
        if (!opts.quiet) ui.outro(Date.now() - startTime);
        return;
      }

      // ── Cost estimate ──
      if (!opts.quiet) {
        ui.blank();
        const estimate = estimateCost(toProcess, config);
        ui.step(
          `${toProcess.length} episodes ${chalk.dim('\u2192')} est. ${chalk.hex('#a78bfa')(estimate.estimatedCost)}`
        );
        ui.blank();
      }

      // ── Dry run ──
      if (opts.dryRun) {
        if (!opts.quiet) {
          for (const ep of toProcess.slice(0, 15)) {
            const tier = getTier(config, ep.podcast);
            ui.episodeRow(
              tier <= 2 ? 'ok' : 'warn',
              ep.podcast,
              ep.title,
              chalk.dim(`T${tier}`),
            );
          }
          if (toProcess.length > 15) {
            ui.hint(`...and ${toProcess.length - 15} more`);
          }
          ui.blank();
          ui.step(chalk.yellow('Dry run -- no API calls made'));
          ui.outro(Date.now() - startTime);
        }
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

        const batchSpinner = ui.createSpinner(
          `Batch ${batchNum}/${totalBatches} (${batch.length} episodes)`,
        );
        batchSpinner.start();

        try {
          const result = await Promise.race([
            extractBatch(config, batch),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error('API timeout (60s)')), 60_000),
            ),
          ]);

          totalInputTokens += result.inputTokens;
          totalOutputTokens += result.outputTokens;

          const guestCount = [...result.entries.values()].reduce(
            (sum, e) => sum + e.guests.length, 0,
          );
          const ideaCount = [...result.entries.values()].reduce(
            (sum, e) => sum + e.keyIdeas.length, 0,
          );

          batchSpinner.succeed(
            `Batch ${batchNum}/${totalBatches}`,
          );
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
          batchSpinner.fail(`Batch ${batchNum} failed`);
          ui.batchError((err as Error).message);
        }
      }

      // ── Summary ──
      if (!opts.quiet) {
        ui.divider();
        ui.blank();

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

        ui.extractionScore(cache.stats.totalGuests, cache.stats.totalIdeas, cache.stats.totalProcessed);
        ui.blank();
        ui.transformSummary(toProcess.length, {
          guests: cache.stats.totalGuests,
          ideas: cache.stats.totalIdeas,
          cost: costStr,
        });
        ui.blank();

        // Show episodes processed
        if (opts.verbose) {
          for (const ep of toProcess) {
            const entry = cache.processedEpisodes[makeKey(ep.podcast, ep.title)];
            if (entry) {
              const detail = entry.guests.length > 0
                ? chalk.dim(`${entry.guests.length}g ${entry.keyIdeas.length}i`)
                : chalk.dim(`${entry.keyIdeas.length}i`);
              ui.episodeRow('ok', ep.podcast, ep.title, detail);
            }
          }
          ui.blank();
        }
      }

      const digestSpinner = ui.createSpinner('Writing digest...');
      digestSpinner.start();
      const outPath = generateDigest(cache, config);
      digestSpinner.succeed('Digest written');
      ui.outputPath(outPath);

      // The human loop: scheduled runs end with a notification, not a silent file.
      if (opts.scheduled) {
        const { notifyDigest } = await import('./schedule.js');
        notifyDigest(
          cache.stats.totalProcessed - statsBefore.totalProcessed,
          cache.stats.totalGuests - statsBefore.totalGuests,
          cache.stats.totalIdeas - statsBefore.totalIdeas,
          outPath
        );
      }

      if (!opts.quiet) {
        ui.blank();
        ui.nextSteps([
          { cmd: `cat ${outPath}`, desc: 'View digest' },
          { cmd: 'podflow digest', desc: 'Process new episodes' },
        ]);
        ui.blank();
        ui.outro(Date.now() - startTime);
      }
    });
}

// ── subs ───────────────────────────────────────────────────────────

function registerSubs(program: Command): void {
  program
    .command('subs')
    .description('List podcast subscriptions')
    .action(async () => {
      ui.intro(VERSION);

      if (!isAvailable()) {
        ui.error('Apple Podcasts database not found');
        process.exit(1);
      }

      const { querySubscriptions } = await import('./db/apple-podcasts.js');
      const subs = querySubscriptions();
      const config = configExists() ? loadConfig() : null;

      ui.step(`${subs.length} podcasts`);
      ui.blank();

      for (const sub of subs) {
        const tier = config ? getTier(config, sub.title || '') : 3;
        ui.episodeRow(
          tier <= 2 ? 'ok' : 'warn',
          sub.title || '(untitled)',
          `${sub.episodeCount} episodes`,
          chalk.dim(`T${tier}`),
        );
      }

      ui.blank();
      ui.hint(config ? 'Edit ~/.podflow/podcasts.json to adjust tiers' : 'Run `podflow init` to configure tiers');
      ui.blank();
    });
}

// ── stats ──────────────────────────────────────────────────────────

function registerStats(program: Command): void {
  program
    .command('stats')
    .description('Cache statistics')
    .action(async () => {
      ui.intro(VERSION);

      const cache = loadCache();
      if (!cache.lastRun) {
        ui.step('No data yet. Run `podflow digest` to get started.');
        ui.blank();
        return;
      }

      const entries = Object.values(cache.processedEpisodes);
      const guests = Object.values(cache.guestIndex);

      ui.extractionScore(cache.stats.totalGuests, cache.stats.totalIdeas, cache.stats.totalProcessed);
      ui.blank();
      ui.transformSummary(cache.stats.totalProcessed, {
        guests: cache.stats.totalGuests,
        ideas: cache.stats.totalIdeas,
        cost: `$${cache.stats.totalCost.toFixed(2)} total`,
      });
      ui.blank();

      ui.divider();
      ui.blank();

      ui.validationRow('ok', 'episodes', cache.stats.totalProcessed, 'processed');
      ui.validationRow('ok', 'guests', cache.stats.totalGuests, 'identified');
      ui.validationRow('ok', 'ideas', cache.stats.totalIdeas, 'extracted');
      ui.validationRow(
        guests.filter((g) => g.followWorthy).length > 0 ? 'ok' : 'warn',
        'follow-worthy',
        guests.filter((g) => g.followWorthy).length,
        'guests',
      );
      ui.validationRow(
        entries.filter((e) => e.relevanceScore >= 7).length > 0 ? 'ok' : 'warn',
        'high relevance',
        entries.filter((e) => e.relevanceScore >= 7).length,
        'episodes (7+)',
      );
      ui.validationRow('ok', 'podcasts', new Set(entries.map((e) => e.podcast)).size, 'unique');

      ui.blank();
      ui.stat('Last run', cache.lastRun.split('T')[0]);
      ui.stat('Last cost', `$${cache.lastRunCost.toFixed(4)}`);

      ui.blank();
    });
}

// ── ui ─────────────────────────────────────────────────────────────

function registerUi(program: Command): void {
  program
    .command('ui')
    .description('Start interactive local dashboard')
    .option('-p, --port <port>', 'Port to run dashboard server on', '3010')
    .action(async (opts) => {
      const port = parseInt(opts.port, 10);
      const { startServer } = await import('./ui/server.js');
      startServer(port);
    });
}

// ── import ─────────────────────────────────────────────────────────

function registerImport(program: Command): void {
  program
    .command('import <path>')
    .description('Import podcast RSS feeds from an OPML file')
    .action(async (filePath) => {
      ui.intro(VERSION);
      if (!configExists()) {
        ui.error('No config found. Run `podflow init` first.');
        process.exit(1);
      }
      const { parseOpmlFeeds } = await import('./db/rss.js');
      try {
        const urls = parseOpmlFeeds(filePath);
        if (urls.length === 0) {
          ui.warn('No feeds found in OPML file.');
          return;
        }
        const config = loadConfig();
        if (!config.feeds) config.feeds = [];
        let added = 0;
        for (const url of urls) {
          if (!config.feeds.includes(url)) {
            config.feeds.push(url);
            added++;
          }
        }
        saveConfig(config);
        ui.stepComplete(`Imported ${added} new RSS feeds (total: ${config.feeds.length})`);
      } catch (err) {
        ui.error(`Failed to parse OPML: ${(err as Error).message}`);
      }
    });
}

// ── schedule ───────────────────────────────────────────────────────

function registerSchedule(program: Command): void {
  program
    .command('schedule')
    .description('Run the digest automatically (weekly by default) and get notified — macOS')
    .option('--daily', 'Run every day instead of weekly')
    .option('--time <HH:MM>', 'Time of day (24h)', '08:00')
    .option('--max-episodes <n>', 'Episodes per scheduled run', '15')
    .option('--off', 'Remove the schedule')
    .option('--status', 'Show schedule status')
    .action(async (opts) => {
      const { installSchedule, removeSchedule, scheduleStatus } = await import('./schedule.js');
      ui.intro(VERSION);

      if (opts.status) {
        const s = scheduleStatus();
        if (!s.installed) {
          ui.hint('No schedule installed. Run `podflow schedule` to set one up.');
        } else {
          ui.stepComplete(`Schedule installed (${s.loaded ? 'loaded' : 'NOT loaded — try re-running podflow schedule'})`);
          ui.hint(`Plist: ${s.plistPath}`);
          ui.hint('Logs: ~/.podflow/logs/schedule.log');
        }
        ui.blank();
        return;
      }

      if (opts.off) {
        const existed = removeSchedule();
        ui.stepComplete(existed ? 'Schedule removed' : 'No schedule was installed');
        ui.blank();
        return;
      }

      if (!configExists()) {
        ui.error('No config found. Run `podflow init` first.');
        process.exit(1);
      }
      const config = loadConfig();
      if (!config.apiKey && config.provider !== 'ollama') {
        ui.error(
          'Scheduled runs need an API key in ~/.podflow/config.json (launchd cannot see your shell env).\n' +
            'Re-run `podflow init` after removing the config, or add "apiKey": "..." to config.json.'
        );
        process.exit(1);
      }

      try {
        const { summary } = installSchedule({
          daily: Boolean(opts.daily),
          time: opts.time,
          maxEpisodes: parseInt(opts.maxEpisodes, 10) || 15,
        });
        ui.stepComplete('Schedule installed');
        ui.hint(summary);
        ui.hint('Check anytime: podflow schedule --status  |  remove: podflow schedule --off');
        ui.blank();
      } catch (err) {
        ui.error((err as Error).message);
        process.exit(1);
      }
    });
}

// ── mcp ────────────────────────────────────────────────────────────

function registerMcp(program: Command): void {
  program
    .command('mcp')
    .description('Start the podflow MCP server (stdio) — ears for agents')
    .action(async () => {
      // Lazy import keeps normal CLI startup free of the MCP SDK.
      // NOTE: no stdout writes in this path — stdio IS the MCP transport.
      const { startMcpServer } = await import('./mcp/server.js');
      await startMcpServer();
    });
}

// ── main ───────────────────────────────────────────────────────────

const program = new Command()
  .name('podflow')
  .description('Your podcast listening, working for you.')
  .version(VERSION, '-v, --version');

registerInit(program);
registerDigest(program);
registerSubs(program);
registerStats(program);
registerUi(program);
registerImport(program);
registerSchedule(program);
registerMcp(program);

program.parse();
