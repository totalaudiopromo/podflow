import * as http from 'http';
import { spawn } from 'child_process';
import * as fs from 'fs';
import { loadCache } from '../cache.js';
import { loadConfig, saveConfig } from '../config/index.js';
import { isAvailable } from '../db/apple-podcasts.js';
import { DASHBOARD_HTML } from './dashboardHtml.js';

export function startServer(port = 3010): void {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    
    // Serve HTML Dashboard
    if (req.method === 'GET' && url.pathname === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(DASHBOARD_HTML);
      return;
    }

    // API: GET Data
    if (req.method === 'GET' && url.pathname === '/api/data') {
      try {
        const cache = loadCache();
        const config = loadConfig();
        const podcastsOk = isAvailable();

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          cache,
          config,
          isApplePodcastsAvailable: podcastsOk
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: (err as Error).message }));
      }
      return;
    }

    // API: POST Config
    if (req.method === 'POST' && url.pathname === '/api/config') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const newConfig = JSON.parse(body);
          
          // Load existing config to merge podcasts tiers so they aren't wiped out
          const existing = loadConfig();
          existing.about = newConfig.about;
          existing.interests = newConfig.interests;
          existing.provider = newConfig.provider;
          existing.model = newConfig.model;
          existing.outputPath = newConfig.outputPath;
          existing.feeds = newConfig.feeds || [];

          saveConfig(existing);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'ok' }));
        } catch (err) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: (err as Error).message }));
        }
      });
      return;
    }

    // API: POST Run Digest (Streams terminal stdout/stderr back in real-time)
    if (req.method === 'POST' && url.pathname === '/api/run-digest') {
      res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });

      const scriptPath = process.argv[1] || '';
      let cmd = process.execPath; // node
      let args = [scriptPath, 'digest', '--max-episodes', '10'];

      if (scriptPath.endsWith('.ts')) {
        cmd = 'npx';
        args = ['tsx', scriptPath, 'digest', '--max-episodes', '10'];
      }

      res.write(`ℹ Spawning process: ${cmd} ${args.join(' ')}\n\n`);

      const child = spawn(cmd, args, {
        env: { ...process.env, FORCE_COLOR: '1' }
      });

      child.stdout.on('data', (data) => {
        // Stream stdout chunks
        res.write(data.toString());
      });

      child.stderr.on('data', (data) => {
        // Stream stderr chunks
        res.write(data.toString());
      });

      child.on('error', (err) => {
        res.write(`\n✖ Process failed to start: ${err.message}\n`);
        res.end();
      });

      child.on('close', (code) => {
        if (code === 0) {
          res.write(`\n✔ Digest run completed successfully (exit code ${code}).\n`);
        } else {
          res.write(`\n✖ Digest run exited with error code ${code}.\n`);
        }
        res.end();
      });
      return;
    }

    // Not Found
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  });

  server.listen(port, () => {
    console.log(`\n🚀 Podflow Dashboard running at: http://localhost:${port}\n`);
    openBrowser(`http://localhost:${port}`);
  });
}

function openBrowser(url: string): void {
  const start = process.platform === 'darwin'
    ? 'open'
    : process.platform === 'win32'
      ? 'start'
      : 'xdg-open';
      
  // Spawn in background
  spawn(start, [url], { shell: true }).unref();
}
