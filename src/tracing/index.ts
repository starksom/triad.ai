/**
 * Trace manager — picks backend (Langfuse or local JSON) and provides
 * a unified API for creating traces and spans.
 */

import { randomBytes } from 'node:crypto';
import type { Trace, Span, TraceBackend, SpanMetadata } from './types.js';
import { LocalTraceBackend } from './local.js';
import { LangfuseTraceBackend } from './langfuse.js';
import type { TriadConfig } from '../utils/config.js';

export class TraceManager {
  private backend: TraceBackend;

  constructor(config: TriadConfig) {
    const langfusePublicKey = process.env['LANGFUSE_PUBLIC_KEY'] || config.tracing.langfuse.publicKey;
    const langfuseSecretKey = process.env['LANGFUSE_SECRET_KEY'] || config.tracing.langfuse.secretKey;

    const useLangfuse =
      config.tracing.backend === 'langfuse' ||
      (config.tracing.backend === 'auto' && langfusePublicKey && langfuseSecretKey);

    if (useLangfuse && langfusePublicKey && langfuseSecretKey) {
      try {
        this.backend = new LangfuseTraceBackend({
          publicKey: langfusePublicKey,
          secretKey: langfuseSecretKey,
          host: config.tracing.langfuse.host,
        });
        return;
      } catch {
        // Fall through to local backend
      }
    }

    this.backend = new LocalTraceBackend(config.tracing.localDirectory);
  }

  /**
   * Start a new trace for a pipeline feature cycle.
   */
  startTrace(name: string, metadata?: Record<string, unknown>): Trace {
    const trace: Trace = {
      traceId: `trace_${randomBytes(8).toString('hex')}`,
      name,
      startTime: new Date().toISOString(),
      endTime: null,
      spans: [],
    };
    this.backend.saveTrace(trace);
    return trace;
  }

  /**
   * Start a span within a trace (represents one pipeline phase).
   */
  startSpan(traceId: string, name: string, agent: string, metadata: SpanMetadata = {}): Span {
    const trace = this.backend.getTrace(traceId);
    if (!trace) throw new Error(`Trace not found: ${traceId}`);

    const span: Span = {
      spanId: `span_${randomBytes(6).toString('hex')}`,
      name,
      agent,
      startTime: new Date().toISOString(),
      endTime: null,
      metadata,
    };

    trace.spans.push(span);
    this.backend.updateTrace(trace);
    return span;
  }

  /**
   * End a span.
   */
  endSpan(traceId: string, spanId: string, metadata: SpanMetadata = {}): void {
    const trace = this.backend.getTrace(traceId);
    if (!trace) return;

    const span = trace.spans.find(s => s.spanId === spanId);
    if (!span) return;

    span.endTime = new Date().toISOString();
    Object.assign(span.metadata, metadata);
    this.backend.updateTrace(trace);
  }

  /**
   * End a trace.
   */
  endTrace(traceId: string): void {
    const trace = this.backend.getTrace(traceId);
    if (!trace) return;

    trace.endTime = new Date().toISOString();
    this.backend.updateTrace(trace);
  }

  /**
   * Get a trace by ID.
   */
  getTrace(traceId: string): Trace | null {
    return this.backend.getTrace(traceId);
  }

  /**
   * List all traces.
   */
  listTraces(): Trace[] {
    return this.backend.listTraces();
  }
}
