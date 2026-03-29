import type { CostTier } from '../providers/types.js';

export type ExecutionStrategy = 'parallel' | 'sequential' | 'adversarial';

export interface MultiModelRequest {
  prompt: string;
  strategy: ExecutionStrategy;
  providerIds?: string[];
  timeoutMs?: number;
  fallbackPartial?: boolean;
}

export interface MultiModelProviderResult {
  providerId: string;
  providerName: string;
  model: string;
  tier: CostTier;
  content: string;
  latencyMs: number;
  inputTokens?: number;
  outputTokens?: number;
  costUsd?: number;
}

export interface MultiModelProviderError {
  providerId: string;
  providerName: string;
  tier: CostTier;
  error: string;
}

export interface MultiModelResponse {
  strategy: ExecutionStrategy;
  prompt: string;
  partial: boolean;
  durationMs: number;
  winners: MultiModelProviderResult[];
  results: MultiModelProviderResult[];
  errors: MultiModelProviderError[];
}

export interface ProviderExecutionInput {
  providerId: string;
  prompt: string;
  timeoutMs?: number;
}

export interface ProviderExecutionOutput {
  content: string;
  model: string;
  inputTokens?: number;
  outputTokens?: number;
  costUsd?: number;
}

export type ProviderExecutor = (input: ProviderExecutionInput) => Promise<ProviderExecutionOutput>;
