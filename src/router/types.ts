import type { CostTier } from '../providers/types.js';
import type { ExecutionStrategy, MultiModelResponse } from '../multi-model/types.js';

export type TaskClassification = 'research' | 'design' | 'implementation' | 'review';

export interface RoutingRule {
  classification: TaskClassification;
  strategy: ExecutionStrategy;
  preferredTiers: CostTier[];
  maxProviders?: number;
}

export interface RouterConfig {
  rules: RoutingRule[];
  fallbackStrategy: ExecutionStrategy;
  fallbackTiers: CostTier[];
  historyWindowSize: number;
}

export interface RoutingHistoryEntry {
  providerId: string;
  success: boolean;
  latencyMs: number;
  costUsd?: number;
  timestamp: string;
}

export interface RoutingDecision {
  classification: TaskClassification;
  strategy: ExecutionStrategy;
  providerIds: string[];
  reason: string;
}

export interface RoutedExecutionResult {
  decision: RoutingDecision;
  response: MultiModelResponse;
  consensus: {
    winnerProviderId: string;
    confidence: number;
    rationale: string;
  };
}
