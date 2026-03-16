/**
 * Tracing type definitions.
 */

export interface TokenUsage {
  input?: number;
  output?: number;
}

export interface SpanMetadata {
  tokenUsage?: TokenUsage;
  latencyMs?: number;
  decision?: string;
  checkpointId?: string;
  [key: string]: unknown;
}

export interface Span {
  spanId: string;
  name: string;
  agent: string;
  startTime: string;
  endTime: string | null;
  metadata: SpanMetadata;
}

export interface Trace {
  traceId: string;
  name: string;
  startTime: string;
  endTime: string | null;
  spans: Span[];
}

export interface TraceBackend {
  saveTrace(trace: Trace): void;
  getTrace(traceId: string): Trace | null;
  listTraces(): Trace[];
  updateTrace(trace: Trace): void;
}
