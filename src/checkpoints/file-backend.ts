/**
 * File-based checkpoint storage backend.
 * Stores each checkpoint as a JSON file in .triad/checkpoints/.
 * Zero external dependencies.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import type { Checkpoint, CheckpointBackend, CheckpointListOptions } from './types.js';

export class FileCheckpointBackend implements CheckpointBackend {
  private readonly directory: string;

  constructor(directory: string) {
    this.directory = directory;
    if (!existsSync(directory)) {
      mkdirSync(directory, { recursive: true });
    }
  }

  save(checkpoint: Checkpoint): void {
    const filePath = join(this.directory, `${checkpoint.id}.json`);
    writeFileSync(filePath, JSON.stringify(checkpoint, null, 2) + '\n', 'utf-8');
  }

  list(options?: CheckpointListOptions): Checkpoint[] {
    if (!existsSync(this.directory)) return [];

    const files = readdirSync(this.directory)
      .filter(f => f.endsWith('.json'))
      .sort()
      .reverse(); // newest first

    let checkpoints: Checkpoint[] = files.map(f => {
      const raw = readFileSync(join(this.directory, f), 'utf-8');
      return JSON.parse(raw) as Checkpoint;
    });

    if (options?.fromDate) {
      checkpoints = checkpoints.filter(c => c.timestamp >= options.fromDate!);
    }
    if (options?.toDate) {
      checkpoints = checkpoints.filter(c => c.timestamp <= options.toDate!);
    }

    const offset = options?.offset ?? 0;
    const limit = options?.limit ?? checkpoints.length;

    return checkpoints.slice(offset, offset + limit);
  }

  get(id: string): Checkpoint | null {
    const filePath = join(this.directory, `${id}.json`);
    if (!existsSync(filePath)) return null;
    const raw = readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as Checkpoint;
  }

  getLatest(): Checkpoint | null {
    const all = this.list({ limit: 1 });
    return all.length > 0 ? all[0] : null;
  }
}
