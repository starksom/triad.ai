import { describe, expect, it } from '@jest/globals';

import { MultiModelEngine } from '../multi-model/engine.js';
import { CostTracker } from '../multi-model/cost-tracker.js';
import { register } from '../providers/registry.js';
import type { LLMProvider } from '../providers/types.js';

const makeProvider = (id: string, tier: LLMProvider['config']['costTier']): LLMProvider => ({
  config: {
    id,
    displayName: id.toUpperCase(),
    envVars: [],
    costTier: tier,
  },
  detect: () => ({
    id,
    displayName: id.toUpperCase(),
    available: true,
    envSatisfied: true,
    localAvailable: true,
    missingEnvVars: [],
    costTier: tier,
  }),
});

const providerA = makeProvider('test-openai', 'medium');
const providerB = makeProvider('test-anthropic', 'high');
register(providerA);
register(providerB);

describe('multi-model/engine', () => {
  it('applies timeout per provider execution', async () => {
    const engine = new MultiModelEngine(async () =>
      new Promise((resolve) => setTimeout(() => resolve({ content: 'late', model: 'slow' }), 40))
    );

    await expect(
      engine.executeParallel({
        prompt: 'hello',
        strategy: 'parallel',
        providerIds: ['test-openai', 'test-anthropic'],
        timeoutMs: 10,
      })
    ).rejects.toThrow('All providers failed');
  });

  it('supports partial fallback in sequential mode', async () => {
    const engine = new MultiModelEngine(async ({ providerId }) => {
      if (providerId === 'test-openai') {
        throw new Error('provider down');
      }

      return {
        content: 'ok',
        model: 'claude-sonnet',
        inputTokens: 12,
        outputTokens: 30,
        costUsd: 0.002,
      };
    });

    const response = await engine.executeSequential({
      prompt: 'hello',
      strategy: 'sequential',
      providerIds: ['test-openai', 'test-anthropic'],
      fallbackPartial: true,
    });

    expect(response.partial).toBe(true);
    expect(response.results).toHaveLength(1);
    expect(response.errors).toHaveLength(1);
    expect(response.results[0].providerId).toBe('test-anthropic');
  });

  it('isolates provider errors during parallel execution', async () => {
    const engine = new MultiModelEngine(async ({ providerId }) => {
      if (providerId === 'test-anthropic') {
        throw new Error('rate limited');
      }

      return {
        content: 'good',
        model: 'gpt-4.1',
      };
    });

    const response = await engine.executeParallel({
      prompt: 'test',
      strategy: 'parallel',
      providerIds: ['test-openai', 'test-anthropic'],
    });

    expect(response.results).toHaveLength(1);
    expect(response.errors).toHaveLength(1);
    expect(response.errors[0].providerId).toBe('test-anthropic');
  });
});

describe('multi-model/cost-tracker', () => {
  it('consolidates usage by provider/model/tier', () => {
    const tracker = new CostTracker();

    tracker.addUsage({
      providerId: 'openai',
      model: 'gpt-4.1-mini',
      tier: 'medium',
      inputTokens: 100,
      outputTokens: 50,
      costUsd: 0.01,
    });
    tracker.addUsage({
      providerId: 'openai',
      model: 'gpt-4.1-mini',
      tier: 'medium',
      inputTokens: 200,
      outputTokens: 100,
      costUsd: 0.02,
    });

    const report = tracker.getReport();

    expect(report.byProviderModelTier).toHaveLength(1);
    expect(report.byProviderModelTier[0].requests).toBe(2);
    expect(report.byProviderModelTier[0].totalTokens).toBe(450);
    expect(report.totals.totalCostUsd).toBeCloseTo(0.03, 6);
  });
});
