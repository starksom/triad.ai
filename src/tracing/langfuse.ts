/**
 * Langfuse trace backend.
 * Maps pipeline concepts to Langfuse: trace = feature cycle, span = phase.
 * Requires langfuse npm package and valid API keys.
 */

import type { Trace, TraceBackend, Span } from './types.js';

interface LangfuseConfig {
  publicKey: string;
  secretKey: string;
  host: string;
}

export class LangfuseTraceBackend implements TraceBackend {
  private client: unknown;
  private localCache: Map<string, Trace> = new Map();

  constructor(config: LangfuseConfig) {
    try {
      // Dynamic import to handle optional dependency
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { Langfuse } = require('langfuse');
      this.client = new Langfuse({
        publicKey: config.publicKey,
        secretKey: config.secretKey,
        baseUrl: config.host,
      });
    } catch {
      throw new Error('Langfuse package not installed. Run: npm install langfuse');
    }
  }

  saveTrace(trace: Trace): void {
    this.localCache.set(trace.traceId, trace);

    try {
      const langfuse = this.client as { trace: (opts: Record<string, unknown>) => { span: (opts: Record<string, unknown>) => void } };
      const langfuseTrace = langfuse.trace({
        id: trace.traceId,
        name: trace.name,
        metadata: { startTime: trace.startTime },
      });

      for (const span of trace.spans) {
        langfuseTrace.span({
          id: span.spanId,
          name: span.name,
          startTime: new Date(span.startTime),
          endTime: span.endTime ? new Date(span.endTime) : undefined,
          metadata: {
            agent: span.agent,
            ...span.metadata,
          },
        });
      }
    } catch {
      // Graceful degradation — never crash on tracing failure
    }
  }

  getTrace(traceId: string): Trace | null {
    return this.localCache.get(traceId) ?? null;
  }

  listTraces(): Trace[] {
    return Array.from(this.localCache.values());
  }

  updateTrace(trace: Trace): void {
    this.saveTrace(trace);
  }
}
