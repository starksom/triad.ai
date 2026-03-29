import { describe, it, expect } from '@jest/globals';
import { majorityVote, weightedScore, adversarialDebate } from '../consensus/engine.js';
import { semanticSimilarity, rankByCohesion } from '../consensus/evaluator.js';
import type { ConsensusResponse } from '../consensus/types.js';

describe('consensus engine', () => {
  const tieResponses: ConsensusResponse[] = [
    { id: 'a', content: 'Use PostgreSQL with Prisma.' },
    { id: 'b', content: 'Adopt PostgreSQL via Prisma ORM.' },
    { id: 'c', content: 'Use Redis cache for sessions.' },
    { id: 'd', content: 'Store sessions in Redis cache.' },
  ];

  it('resolves tie scenarios deterministically with semantic majority', () => {
    const result = majorityVote(tieResponses, { threshold: 0.51 });
    expect(result.winner).not.toBeNull();
    expect(Object.values(result.voteTally).reduce((sum, v) => sum + v, 0)).toBe(tieResponses.length);
  });

  it('captures extreme dissent in weighted scoring', () => {
    const responses: ConsensusResponse[] = [
      { id: 'safe', provider: 'trusted', content: 'Rollback and add migration guard.', confidence: 0.9 },
      { id: 'risky', provider: 'untrusted', content: 'Drop the table and recreate in production.', confidence: 0.9 },
      { id: 'neutral', provider: 'standard', content: 'Add tests before changing migration.', confidence: 0.7 },
    ];

    const result = weightedScore(responses, {
      threshold: 0.7,
      providerWeights: { trusted: 3, standard: 1.5, untrusted: 0.25 },
    });

    expect(result.winner?.id).toBe('safe');
    expect(result.dissentingResponses.map(r => r.id)).toContain('risky');
  });

  it('converges across rounds in adversarial debate', () => {
    const responses: ConsensusResponse[] = [
      { id: 'x', content: 'Implement feature flags for rollout.' },
      { id: 'y', content: 'Add progressive rollout using feature flags.' },
      { id: 'z', content: 'Ship directly to all users now.' },
    ];

    const result = adversarialDebate(responses, { threshold: 0.74, maxRounds: 3, minAgreementDelta: 0.02 });
    expect(result.rounds).toBeGreaterThanOrEqual(1);
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.winner).not.toBeNull();
  });
});

describe('consensus evaluator', () => {
  it('computes semantic similarity', () => {
    const similarity = semanticSimilarity('Use Redis for cache', 'Use Redis cache');
    expect(similarity).toBeGreaterThan(0.4);
  });

  it('ranks responses by cohesion', () => {
    const ranked = rankByCohesion([
      { id: 'a', content: 'feature flags rollout plan' },
      { id: 'b', content: 'rollout plan with feature flags' },
      { id: 'c', content: 'database schema migration for billing' },
    ]);

    expect(ranked[0].response.id).toBe('a');
    expect(ranked[1].response.id).toBe('b');
  });
});
