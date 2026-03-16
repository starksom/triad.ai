/**
 * Local JSON file-based trace backend.
 * Fallback when Langfuse is not configured.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import type { Trace, TraceBackend } from './types.js';

export class LocalTraceBackend implements TraceBackend {
  private readonly directory: string;

  constructor(directory: string) {
    this.directory = directory;
    if (!existsSync(directory)) {
      mkdirSync(directory, { recursive: true });
    }
  }

  saveTrace(trace: Trace): void {
    const filePath = join(this.directory, `${trace.traceId}.json`);
    writeFileSync(filePath, JSON.stringify(trace, null, 2) + '\n', 'utf-8');
  }

  getTrace(traceId: string): Trace | null {
    const filePath = join(this.directory, `${traceId}.json`);
    if (!existsSync(filePath)) return null;
    return JSON.parse(readFileSync(filePath, 'utf-8')) as Trace;
  }

  listTraces(): Trace[] {
    if (!existsSync(this.directory)) return [];

    return readdirSync(this.directory)
      .filter(f => f.endsWith('.json'))
      .sort()
      .reverse()
      .map(f => JSON.parse(readFileSync(join(this.directory, f), 'utf-8')) as Trace);
  }

  updateTrace(trace: Trace): void {
    this.saveTrace(trace);
  }
}
