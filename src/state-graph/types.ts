/**
 * State Graph type definitions for the Triad Pipeline.
 */

export interface TransitionEdge {
  target: string;
  guards: string[];
  actions: string[];
}

export interface StateNode {
  assignee: string;
  description?: string;
  onEnter?: string[];
  transitions: Record<string, TransitionEdge>;
}

export interface StateGraph {
  $schema: string;
  initialState: string;
  states: Record<string, StateNode>;
}

export interface RejectionEntry {
  number: number;
  date: string;
  rejector: string;
  category: RejectionCategory;
  files: string;
  error: string;
  requiredFix: string;
  checklistFailures: string;
}

export type RejectionCategory =
  | 'TEST_FAILURE'
  | 'SECURITY_VIOLATION'
  | 'UX_VIOLATION'
  | 'PILLAR_CONFLICT'
  | 'PR_SIZE_EXCEEDED';

export type CompletionSignal = 'INCOMPLETE' | 'COMPLETE';

export interface PipelineContext {
  phase: string;
  task: string;
  story: { current: number; total: number };
  assignee: string;
  retryCount: number;
  maxRetries: number;
  rejectionLog: RejectionEntry[];
  handoffMessage: string;
  completionSignal: CompletionSignal;
  roadmapPillars: string;
}

export interface TransitionResult {
  from: string;
  to: string;
  event: string;
  agent: string;
  context: PipelineContext;
}

export interface TransitionGuardError {
  guard: string;
  message: string;
}
