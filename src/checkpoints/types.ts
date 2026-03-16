/**
 * Checkpoint type definitions.
 */

import type { PipelineContext } from '../state-graph/types.js';

export interface CheckpointTransition {
  from: string;
  to: string;
  event: string;
  agent: string;
}

export interface CheckpointMetadata {
  gitSha?: string;
  traceId?: string;
  spanId?: string;
  filesChanged?: string[];
}

export interface Checkpoint {
  id: string;
  parentId: string | null;
  timestamp: string;
  transition: CheckpointTransition;
  contextState: PipelineContext;
  metadata: CheckpointMetadata;
}

export interface CheckpointListOptions {
  limit?: number;
  offset?: number;
  fromDate?: string;
  toDate?: string;
}

export interface CheckpointBackend {
  save(checkpoint: Checkpoint): void;
  list(options?: CheckpointListOptions): Checkpoint[];
  get(id: string): Checkpoint | null;
  getLatest(): Checkpoint | null;
}
