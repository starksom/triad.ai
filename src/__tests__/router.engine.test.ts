import { beforeEach, describe, expect, it, jest } from '@jest/globals';
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

const providers: LLMProvider[] = [
  makeProvider('p-free', 'free'),
  makeProvider('p-low', 'low'),
  makeProvider('p-high', 'high'),
];

jest.unstable_mockModule('../providers/registry.js', () => ({
  listAvailable: jest.fn(() => providers),
  get: jest.fn((id: string) => providers.find((provider) => provider.config.id === id)),
}));

const { RouterEngine } = await import('../router/engine.js');
const { classifyTask } = await import('../router/classifier.js');

describe('router/classifier', () => {
  it('classifies prompts with deterministic heuristics', () => {
    expect(classifyTask('Pesquise trade-offs de banco vetorial')).toBe('research');
    expect(classifyTask('Definir arquitetura e schema do serviço')).toBe('design');
    expect(classifyTask('Implementar endpoint de autenticação')).toBe('implementation');
    expect(classifyTask('Fazer code review e validar testes')).toBe('review');
  });
});

describe('router/engine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('routes implementation tasks to cost-aware sequential strategy', () => {
    const router = new RouterEngine(async ({ providerId, prompt }) => ({
      model: `${providerId}-model`,
      content: `${providerId}:${prompt}`,
      outputTokens: 20,
      costUsd: providerId === 'p-free' ? 0 : 0.01,
    }));

    const decision = router.route('Implementar feature de login');

    expect(decision.classification).toBe('implementation');
    expect(decision.strategy).toBe('sequential');
    expect(decision.providerIds[0]).toBe('p-free');
  });

  it('falls back to available providers when preferred tiers are unavailable', async () => {
    const router = new RouterEngine(
      async ({ providerId, prompt }) => {
        if (providerId === 'p-free') {
          throw new Error('temporary outage');
        }

        return {
          model: `${providerId}-model`,
          content: `answer:${prompt}`,
          outputTokens: 30,
          costUsd: 0.01,
        };
      },
      {
        rules: [
          {
            classification: 'implementation',
            strategy: 'sequential',
            preferredTiers: ['premium'],
            maxProviders: 2,
          },
        ],
        fallbackStrategy: 'sequential',
        fallbackTiers: ['free', 'low', 'high'],
        historyWindowSize: 20,
      }
    );

    const routed = await router.executeRouted('Implementar fallback de roteamento', { timeoutMs: 100 });

    expect(routed.decision.providerIds).toEqual(['p-free', 'p-low']);
    expect(routed.response.partial).toBe(true);
    expect(routed.response.results[0].providerId).toBe('p-low');
    expect(routed.consensus.winnerProviderId).toBe('p-low');
  });
});
