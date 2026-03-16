/**
 * Dashboard REST API routes.
 */

import { Router } from 'express';
import { join } from 'node:path';

import { parseContextState } from '../utils/context-state.js';
import { loadConfig, redactSecrets } from '../utils/config.js';
import { FileCheckpointBackend } from '../checkpoints/file-backend.js';
import { CheckpointManager } from '../checkpoints/manager.js';
import { TraceManager } from '../tracing/index.js';
import { parseProgressLog, parseAgentsLog } from '../utils/markdown.js';
import { StateGraphEngine } from '../state-graph/engine.js';
import type { StateGraph } from '../state-graph/types.js';
import { readFileSync, existsSync } from 'node:fs';

export function createRouter(root: string): Router {
  const router = Router();
  const contextStatePath = join(root, 'docs', 'CONTEXT_STATE.md');
  const graphPath = join(root, 'src', 'state-graph', 'graph.json');
  const progressPath = join(root, 'docs', 'progress.txt');
  const agentsPath = join(root, 'docs', 'AGENTS.md');

  // GET /api/state — Current pipeline state
  router.get('/api/state', (_req, res) => {
    try {
      const ctx = parseContextState(contextStatePath);
      res.json(ctx);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // GET /api/graph — State graph definition with active node
  router.get('/api/graph', (_req, res) => {
    try {
      const ctx = parseContextState(contextStatePath);
      const graph: StateGraph = JSON.parse(readFileSync(graphPath, 'utf-8'));
      res.json({ graph, activeState: ctx.phase });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // GET /api/checkpoints — List checkpoints
  router.get('/api/checkpoints', (req, res) => {
    try {
      const config = loadConfig(root);
      const backend = new FileCheckpointBackend(join(root, config.checkpoints.directory));
      const manager = new CheckpointManager(backend, contextStatePath);
      const limit = parseInt(req.query['limit'] as string) || 50;
      const offset = parseInt(req.query['offset'] as string) || 0;
      const checkpoints = manager.list({ limit, offset });
      res.json(checkpoints);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // GET /api/checkpoints/:id — Single checkpoint
  router.get('/api/checkpoints/:id', (req, res) => {
    try {
      const config = loadConfig(root);
      const backend = new FileCheckpointBackend(join(root, config.checkpoints.directory));
      const chk = backend.get(req.params['id']!);
      if (!chk) return res.status(404).json({ error: 'Not found' });
      res.json(chk);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // POST /api/checkpoints/:id/restore — Restore checkpoint
  router.post('/api/checkpoints/:id/restore', (req, res) => {
    try {
      const config = loadConfig(root);
      const backend = new FileCheckpointBackend(join(root, config.checkpoints.directory));
      const manager = new CheckpointManager(backend, contextStatePath);
      const ctx = manager.restore(req.params['id']!);
      res.json({ restored: true, context: ctx });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // GET /api/traces — List traces
  router.get('/api/traces', (_req, res) => {
    try {
      const config = loadConfig(root);
      const manager = new TraceManager(config);
      res.json(manager.listTraces());
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // GET /api/traces/:id — Single trace
  router.get('/api/traces/:id', (req, res) => {
    try {
      const config = loadConfig(root);
      const manager = new TraceManager(config);
      const trace = manager.getTrace(req.params['id']!);
      if (!trace) return res.status(404).json({ error: 'Not found' });
      res.json(trace);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // GET /api/timeline — Parsed progress.txt
  router.get('/api/timeline', (_req, res) => {
    try {
      res.json(parseProgressLog(progressPath));
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // GET /api/agents — Parsed AGENTS.md
  router.get('/api/agents', (_req, res) => {
    try {
      res.json(parseAgentsLog(agentsPath));
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // GET /api/rejections — Rejection history from context state
  router.get('/api/rejections', (_req, res) => {
    try {
      const ctx = parseContextState(contextStatePath);
      res.json(ctx.rejectionLog);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // GET /api/config — Current config (secrets redacted)
  router.get('/api/config', (_req, res) => {
    try {
      const config = loadConfig(root);
      res.json(redactSecrets(config));
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  return router;
}
