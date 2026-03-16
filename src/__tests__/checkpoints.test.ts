import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { writeFileSync, unlinkSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { FileCheckpointBackend } from '../checkpoints/file-backend.js';
import { CheckpointManager } from '../checkpoints/manager.js';
import { writeContextState } from '../utils/context-state.js';
import type { PipelineContext } from '../state-graph/types.js';

const TEST_DIR = join(process.cwd(), '.triad', 'test-tmp');
const CHECKPOINT_DIR = join(TEST_DIR, 'checkpoints-test');
const CONTEXT_FILE = join(TEST_DIR, 'CONTEXT_STATE_CHECKPOINT_TEST.md');

const sampleContext: PipelineContext = {
  phase: 'DEVELOPMENT',
  task: 'Implement /health endpoint',
  story: { current: 1, total: 3 },
  assignee: 'Codex',
  retryCount: 0,
  maxRetries: 3,
  rejectionLog: [],
  handoffMessage: 'Start implementing',
  completionSignal: 'INCOMPLETE',
  roadmapPillars: '[P2-04] Graph Workflow Engine',
};

beforeEach(() => {
  if (!existsSync(TEST_DIR)) mkdirSync(TEST_DIR, { recursive: true });
  writeContextState(CONTEXT_FILE, sampleContext);
});

afterEach(() => {
  if (existsSync(CHECKPOINT_DIR)) rmSync(CHECKPOINT_DIR, { recursive: true });
  if (existsSync(CONTEXT_FILE)) unlinkSync(CONTEXT_FILE);
});

describe('FileCheckpointBackend', () => {
  it('saves and retrieves a checkpoint', () => {
    const backend = new FileCheckpointBackend(CHECKPOINT_DIR);
    const checkpoint = {
      id: 'chk_test_001',
      parentId: null,
      timestamp: new Date().toISOString(),
      transition: { from: 'PLANNING', to: 'DEVELOPMENT', event: 'START_DEVELOPMENT', agent: 'Codex' },
      contextState: sampleContext,
      metadata: { gitSha: 'abc123' },
    };

    backend.save(checkpoint);
    const retrieved = backend.get('chk_test_001');
    expect(retrieved).not.toBeNull();
    expect(retrieved!.id).toBe('chk_test_001');
    expect(retrieved!.contextState.phase).toBe('DEVELOPMENT');
  });

  it('lists checkpoints in reverse chronological order', () => {
    const backend = new FileCheckpointBackend(CHECKPOINT_DIR);

    backend.save({
      id: 'chk_a',
      parentId: null,
      timestamp: '2026-03-16T10:00:00.000Z',
      transition: { from: 'PLANNING', to: 'DEVELOPMENT', event: 'START_DEVELOPMENT', agent: 'Codex' },
      contextState: sampleContext,
      metadata: {},
    });

    backend.save({
      id: 'chk_b',
      parentId: 'chk_a',
      timestamp: '2026-03-16T11:00:00.000Z',
      transition: { from: 'DEVELOPMENT', to: 'VALIDATION', event: 'SUBMIT_FOR_VALIDATION', agent: 'Antigravity' },
      contextState: { ...sampleContext, phase: 'VALIDATION' },
      metadata: {},
    });

    const list = backend.list();
    expect(list).toHaveLength(2);
    expect(list[0].id).toBe('chk_b');
    expect(list[1].id).toBe('chk_a');
  });

  it('returns null for non-existent checkpoint', () => {
    const backend = new FileCheckpointBackend(CHECKPOINT_DIR);
    expect(backend.get('nonexistent')).toBeNull();
  });
});

describe('CheckpointManager', () => {
  it('saves a checkpoint and links parent', () => {
    const backend = new FileCheckpointBackend(CHECKPOINT_DIR);
    const manager = new CheckpointManager(backend, CONTEXT_FILE);

    const chk1 = manager.save(
      { from: 'PLANNING', to: 'DEVELOPMENT', event: 'START_DEVELOPMENT', agent: 'Codex' },
      sampleContext
    );
    expect(chk1.parentId).toBeNull();

    const chk2 = manager.save(
      { from: 'DEVELOPMENT', to: 'VALIDATION', event: 'SUBMIT_FOR_VALIDATION', agent: 'Antigravity' },
      { ...sampleContext, phase: 'VALIDATION' }
    );
    expect(chk2.parentId).toBe(chk1.id);
  });

  it('restores a checkpoint to CONTEXT_STATE.md', () => {
    const backend = new FileCheckpointBackend(CHECKPOINT_DIR);
    const manager = new CheckpointManager(backend, CONTEXT_FILE);

    const chk = manager.save(
      { from: 'PLANNING', to: 'DEVELOPMENT', event: 'START_DEVELOPMENT', agent: 'Codex' },
      sampleContext
    );

    // Change context
    writeContextState(CONTEXT_FILE, { ...sampleContext, phase: 'VALIDATION', assignee: 'Antigravity' });

    // Restore
    const restored = manager.restore(chk.id);
    expect(restored.phase).toBe('DEVELOPMENT');
    expect(restored.assignee).toBe('Codex');
  });

  it('throws on restoring non-existent checkpoint', () => {
    const backend = new FileCheckpointBackend(CHECKPOINT_DIR);
    const manager = new CheckpointManager(backend, CONTEXT_FILE);
    expect(() => manager.restore('nonexistent')).toThrow('Checkpoint not found');
  });
});
