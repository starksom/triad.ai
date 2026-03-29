import type { CostTier } from '../providers/types.js';
import type { MultiModelResponse } from './types.js';

export interface CostAggregate {
  key: string;
  providerId: string;
  model: string;
  tier: CostTier;
  requests: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  totalCostUsd: number;
}

export interface CostReport {
  generatedAt: string;
  totals: {
    requests: number;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    totalCostUsd: number;
  };
  byProviderModelTier: CostAggregate[];
}

export class CostTracker {
  private readonly aggregates = new Map<string, CostAggregate>();

  addUsage(usage: {
    providerId: string;
    model: string;
    tier: CostTier;
    inputTokens?: number;
    outputTokens?: number;
    costUsd?: number;
  }): void {
    const key = `${usage.providerId}:${usage.model}:${usage.tier}`;
    const current = this.aggregates.get(key) ?? {
      key,
      providerId: usage.providerId,
      model: usage.model,
      tier: usage.tier,
      requests: 0,
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      totalCostUsd: 0,
    };

    current.requests += 1;
    current.inputTokens += usage.inputTokens ?? 0;
    current.outputTokens += usage.outputTokens ?? 0;
    current.totalTokens = current.inputTokens + current.outputTokens;
    current.totalCostUsd += usage.costUsd ?? 0;

    this.aggregates.set(key, current);
  }

  addResponse(response: MultiModelResponse): void {
    for (const result of response.results) {
      this.addUsage({
        providerId: result.providerId,
        model: result.model,
        tier: result.tier,
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
        costUsd: result.costUsd,
      });
    }
  }

  getReport(): CostReport {
    const byProviderModelTier = Array.from(this.aggregates.values()).sort((a, b) =>
      a.key.localeCompare(b.key)
    );

    const totals = byProviderModelTier.reduce(
      (acc, row) => {
        acc.requests += row.requests;
        acc.inputTokens += row.inputTokens;
        acc.outputTokens += row.outputTokens;
        acc.totalTokens += row.totalTokens;
        acc.totalCostUsd += row.totalCostUsd;
        return acc;
      },
      { requests: 0, inputTokens: 0, outputTokens: 0, totalTokens: 0, totalCostUsd: 0 }
    );

    return {
      generatedAt: new Date().toISOString(),
      totals,
      byProviderModelTier,
    };
  }

  static fromReport(report?: CostReport): CostTracker {
    const tracker = new CostTracker();
    if (!report) {
      return tracker;
    }

    for (const row of report.byProviderModelTier) {
      tracker.aggregates.set(row.key, { ...row });
    }

    return tracker;
  }
}
