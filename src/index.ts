/**
 * Triad Pipeline Framework — Public API exports.
 */

export { StateGraphEngine, TransitionGuardError, InvalidTransitionError } from './state-graph/engine.js';
export type { StateGraph, StateNode, TransitionEdge, PipelineContext, RejectionEntry, TransitionResult } from './state-graph/types.js';
export { guards, actions } from './state-graph/transitions.js';
export type { GuardFn, ActionFn, ActionPayload } from './state-graph/transitions.js';

export { CheckpointManager } from './checkpoints/manager.js';
export { FileCheckpointBackend } from './checkpoints/file-backend.js';
export { SqliteCheckpointBackend } from './checkpoints/sqlite-backend.js';
export type { Checkpoint, CheckpointBackend, CheckpointListOptions } from './checkpoints/types.js';

export { TraceManager } from './tracing/index.js';
export { LocalTraceBackend } from './tracing/local.js';
export { LangfuseTraceBackend } from './tracing/langfuse.js';
export type { Trace, Span, TraceBackend, SpanMetadata } from './tracing/types.js';

export { parseContextState, writeContextState, appendRejection } from './utils/context-state.js';
export {
  loadConfig,
  saveConfig,
  getConfigValue,
  setConfigValue,
  redactSecrets,
  getFeatureFlags,
  isV31ModuleEnabled,
  resolveModuleBehavior,
} from './utils/config.js';
export type { TriadConfig, FeatureFlags, V31FeatureModule } from './utils/config.js';
export { autoCommit, getCurrentSha, isClean } from './utils/git.js';
export { parseAgentsLog, parseProgressLog, appendAgentEntry, appendProgressEntry } from './utils/markdown.js';

export type { CostTier, ProviderConfig, ProviderResponse, LLMProvider } from './providers/types.js';
export { register, get, detect, listAvailable } from './providers/registry.js';

export { majorityVote, weightedScore, confidenceRanking, adversarialDebate } from './consensus/engine.js';
export { semanticSimilarity, pairwiseSimilarityMatrix, rankByCohesion } from './consensus/evaluator.js';
export type { ConsensusStrategy, ConsensusConfig, ConsensusResult, ConsensusResponse } from './consensus/types.js';
export { MultiModelEngine } from './multi-model/engine.js';
export { CostTracker } from './multi-model/cost-tracker.js';
export type {
  ExecutionStrategy,
  MultiModelRequest,
  MultiModelResponse,
  MultiModelProviderResult,
  MultiModelProviderError,
  ProviderExecutionInput,
  ProviderExecutionOutput,
  ProviderExecutor,
} from './multi-model/types.js';


export { resolveConsensus } from './consensus/index.js';
export type { ConsensusResult } from './consensus/index.js';

export { RouterEngine, DEFAULT_ROUTER_CONFIG } from './router/engine.js';
export { classifyTask } from './router/classifier.js';
export type {
  TaskClassification,
  RoutingRule,
  RouterConfig,
  RoutingHistoryEntry,
  RoutingDecision,
  RoutedExecutionResult,
} from './router/types.js';
