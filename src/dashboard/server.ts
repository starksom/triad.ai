/**
 * Dashboard server — Express + WebSocket with file watching.
 */

import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import { watch } from 'chokidar';
import { join } from 'node:path';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { createRouter } from './routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function startDashboard(root: string, port: number = 3000): void {
  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ server });

  // Serve static files
  const publicDir = join(__dirname, '..', '..', 'src', 'dashboard', 'public');
  app.use(express.static(publicDir));
  app.use(express.json());

  // Mount API routes
  app.use(createRouter(root));

  // WebSocket connections
  const clients = new Set<WebSocket>();
  wss.on('connection', (ws) => {
    clients.add(ws);
    ws.on('close', () => clients.delete(ws));
  });

  function broadcast(event: string, data?: unknown): void {
    const message = JSON.stringify({ event, data, timestamp: new Date().toISOString() });
    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }

  // File watchers for real-time updates
  const contextStatePath = join(root, 'docs', 'CONTEXT_STATE.md');
  const checkpointDir = join(root, '.triad', 'checkpoints');

  const watcher = watch([contextStatePath, checkpointDir], {
    ignoreInitial: true,
    awaitWriteFinish: { stabilityThreshold: 300 },
  });

  watcher.on('change', (path) => {
    if (path.includes('CONTEXT_STATE')) {
      broadcast('state-changed');
    }
  });

  watcher.on('add', (path) => {
    if (path.includes('checkpoints')) {
      broadcast('checkpoint-created');
    }
  });

  // Fallback to index.html for SPA
  app.get('/', (_req, res) => {
    res.sendFile(join(publicDir, 'index.html'));
  });

  server.listen(port, () => {
    console.log(`Triad Dashboard running at http://localhost:${port}`);
    console.log('Press Ctrl+C to stop.');
  });
}
