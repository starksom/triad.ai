import { resolveConsensus } from '../consensus/index.js';
import { MultiModelEngine } from '../multi-model/engine.js';
import type { MultiModelRequest, ProviderExecutor } from '../multi-model/types.js';
import { listAvailable } from '../providers/registry.js';
import type { CostTier } from '../providers/types.js';
import { classifyTask } from './classifier.js';
import type {
  RoutedExecutionResult,
  RouterConfig,
  RoutingDecision,
  RoutingHistoryEntry,
  RoutingRule,
  TaskClassification,
} from './types.js';

const TIER_PRIORITY: CostTier[] = ['free', 'low', 'medium', 'high', 'premium'];

export const DEFAULT_ROUTER_CONFIG: RouterConfig = {
  rules: [
    { classification: 'research', strategy: 'parallel', preferredTiers: ['free', 'low', 'medium'], maxProviders: 3 },
    { classification: 'design', strategy: 'parallel', preferredTiers: ['low', 'medium', 'high'], maxProviders: 2 },
    { classification: 'implementation', strategy: 'sequential', preferredTiers: ['free', 'low', 'medium'], maxProviders: 2 },
    { classification: 'review', strategy: 'adversarial', preferredTiers: ['medium', 'high', 'premium'], maxProviders: 2 },
  ],
  fallbackStrategy: 'sequential',
  fallbackTiers: ['free', 'low', 'medium', 'high', 'premium'],
  historyWindowSize: 50,
};

export class RouterEngine {
  private readonly multiModel: MultiModelEngine;
  private readonly history: RoutingHistoryEntry[] = [];

  constructor(
    executeProvider: ProviderExecutor,
    private readonly config: RouterConfig = DEFAULT_ROUTER_CONFIG,
    private readonly onDecision?: (decision: RoutingDecision) => void
  ) {
    this.multiModel = new MultiModelEngine(executeProvider);
  }

  private pickRule(classification: TaskClassification): RoutingRule {
    return this.config.rules.find((rule) => rule.classification === classification) ?? {
      classification,
      strategy: this.config.fallbackStrategy,
      preferredTiers: this.config.fallbackTiers,
      maxProviders: 2,
    };
  }

  private providerScore(providerId: string): number {
    const recent = this.history
      .filter((entry) => entry.providerId === providerId)
      .slice(-this.config.historyWindowSize);

    if (recent.length === 0) {
      return 1;
    }

    const successes = recent.filter((entry) => entry.success).length;
    const successRate = successes / recent.length;
    const avgLatency = recent.reduce((sum, entry) => sum + entry.latencyMs, 0) / recent.length;
    const latencyFactor = 1 / (1 + avgLatency / 2000);

    return successRate * 0.8 + latencyFactor * 0.2;
  }

  private selectProviders(preferredTiers: CostTier[], maxProviders = 2): string[] {
    const available = listAvailable();

    const allowed = available.filter((provider) => preferredTiers.includes(provider.config.costTier));
    const candidates = (allowed.length > 0 ? allowed : available).sort((a, b) => {
      const scoreDiff = this.providerScore(b.config.id) - this.providerScore(a.config.id);
      if (scoreDiff !== 0) {
        return scoreDiff;
      }

      return TIER_PRIORITY.indexOf(a.config.costTier) - TIER_PRIORITY.indexOf(b.config.costTier);
    });

    return candidates.slice(0, Math.max(maxProviders, 1)).map((provider) => provider.config.id);
  }

  route(prompt: string): RoutingDecision {
    const classification = classifyTask(prompt);
    const rule = this.pickRule(classification);
    const providerIds = this.selectProviders(rule.preferredTiers, rule.maxProviders);

    if (providerIds.length === 0) {
      throw new Error('No providers available for routing. Run "triad providers detect" first.');
    }

    const decision = {
      classification,
      strategy: rule.strategy,
      providerIds,
      reason: `classification=${classification}; tiers=${rule.preferredTiers.join(',')}; historySize=${this.history.length}`,
    };

    this.onDecision?.(decision);
    return decision;
  }

  async executeRouted(prompt: string, overrides: Partial<MultiModelRequest> = {}): Promise<RoutedExecutionResult> {
    const decision = this.route(prompt);

    const request: MultiModelRequest = {
      prompt,
      strategy: decision.strategy,
      providerIds: decision.providerIds,
      fallbackPartial: true,
      ...overrides,
    };

    const response =
      decision.strategy === 'parallel'
        ? await this.multiModel.executeParallel(request)
        : decision.strategy === 'sequential'
          ? await this.multiModel.executeSequential(request)
          : await this.multiModel.executeAdversarial(request);

    for (const result of response.results) {
      this.history.push({
        providerId: result.providerId,
        success: true,
        latencyMs: result.latencyMs,
        costUsd: result.costUsd,
        timestamp: new Date().toISOString(),
      });
    }

    for (const error of response.errors) {
      this.history.push({
        providerId: error.providerId,
        success: false,
        latencyMs: overrides.timeoutMs ?? 0,
        timestamp: new Date().toISOString(),
      });
    }

    this.trimHistory();

    return {
      decision,
      response,
      consensus: resolveConsensus(response),
    };
  }

  getHistory(): RoutingHistoryEntry[] {
    return [...this.history];
  }

  private trimHistory(): void {
    const max = this.config.historyWindowSize;
    if (this.history.length > max) {
      this.history.splice(0, this.history.length - max);
    }
  }
}
