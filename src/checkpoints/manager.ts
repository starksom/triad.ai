/**
 * Checkpoint manager — orchestrates save/restore/list operations.
 */

import { randomBytes } from 'node:crypto';
import type { Checkpoint, CheckpointBackend, CheckpointListOptions, CheckpointTransition, CheckpointMetadata } from './types.js';
import type { PipelineContext } from '../state-graph/types.js';
import { writeContextState } from '../utils/context-state.js';

export class CheckpointManager {
  private readonly backend: CheckpointBackend;
  private readonly contextStatePath: string;

  constructor(backend: CheckpointBackend, contextStatePath: string) {
    this.backend = backend;
    this.contextStatePath = contextStatePath;
  }

  /**
   * Save a checkpoint after a transition.
   */
  save(transition: CheckpointTransition, contextState: PipelineContext, metadata: CheckpointMetadata = {}): Checkpoint {
    const latest = this.backend.getLatest();
    const now = new Date();
    const id = generateCheckpointId(now);

    const checkpoint: Checkpoint = {
      id,
      parentId: latest?.id ?? null,
      timestamp: now.toISOString(),
      transition,
      contextState,
      metadata,
    };

    this.backend.save(checkpoint);
    return checkpoint;
  }

  /**
   * List checkpoints with optional filtering.
   */
  list(options?: CheckpointListOptions): Checkpoint[] {
    return this.backend.list(options);
  }

  /**
   * Get a single checkpoint by ID.
   */
  get(id: string): Checkpoint | null {
    return this.backend.get(id);
  }

  /**
   * Get the most recent checkpoint.
   */
  getLatest(): Checkpoint | null {
    return this.backend.getLatest();
  }

  /**
   * Restore a checkpoint — writes the checkpoint's context state back to CONTEXT_STATE.md.
   */
  restore(id: string): PipelineContext {
    const checkpoint = this.backend.get(id);
    if (!checkpoint) {
      throw new Error(`Checkpoint not found: ${id}`);
    }

    writeContextState(this.contextStatePath, checkpoint.contextState);
    return checkpoint.contextState;
  }
}

function generateCheckpointId(date: Date): string {
  const ts = date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, '');
  const rand = randomBytes(3).toString('hex');
  return `chk_${ts}_${rand}`;
}
