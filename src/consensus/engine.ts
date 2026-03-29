import { rankByCohesion, semanticSimilarity } from './evaluator.js';
import type { ConsensusConfig, ConsensusResponse, ConsensusResult } from './types.js';

const DEFAULT_THRESHOLD = 0.75;
const DEFAULT_MAX_ROUNDS = 3;
const DEFAULT_MIN_DELTA = 0.05;

function normalizeConfig(config: Partial<ConsensusConfig> & Pick<ConsensusConfig, 'strategy'>): ConsensusConfig {
  return {
    strategy: config.strategy,
    threshold: config.threshold ?? DEFAULT_THRESHOLD,
    maxRounds: config.maxRounds ?? DEFAULT_MAX_ROUNDS,
    minAgreementDelta: config.minAgreementDelta ?? DEFAULT_MIN_DELTA,
    providerWeights: config.providerWeights ?? {},
  };
}

function buildResult(
  strategy: ConsensusResult['strategy'],
  winner: ConsensusResponse | null,
  confidence: number,
  voteTally: Record<string, number>,
  responses: ConsensusResponse[],
  rounds: number,
  converged: boolean,
  reasoning: string
): ConsensusResult {
  const winningId = winner?.id;
  return {
    strategy,
    winner,
    confidence,
    voteTally,
    dissentingResponses: responses.filter(r => r.id !== winningId),
    converged,
    rounds,
    reasoning,
  };
}

export function majorityVote(
  responses: ConsensusResponse[],
  config: Partial<ConsensusConfig> = {}
): ConsensusResult {
  const normalized = normalizeConfig({ strategy: 'majority_vote', ...config });
  const ranking = rankByCohesion(responses);
  const voteTally: Record<string, number> = Object.fromEntries(responses.map(r => [r.id, 0]));

  for (const voter of responses) {
    const closest = responses
      .map(candidate => ({ candidate, score: semanticSimilarity(voter.content, candidate.content) }))
      .sort((a, b) => b.score - a.score)[0];
    voteTally[closest.candidate.id] += 1;
  }

  const winnerEntry = Object.entries(voteTally).sort((a, b) => b[1] - a[1])[0];
  const winner = responses.find(r => r.id === winnerEntry?.[0]) ?? ranking[0]?.response ?? null;
  const confidence = responses.length === 0 ? 0 : (winnerEntry?.[1] ?? 0) / responses.length;

  return buildResult(
    'majority_vote',
    winner,
    confidence,
    voteTally,
    responses,
    1,
    confidence >= normalized.threshold,
    'Majority vote by nearest semantic agreement.'
  );
}

export function weightedScore(
  responses: ConsensusResponse[],
  config: Partial<ConsensusConfig> = {}
): ConsensusResult {
  const normalized = normalizeConfig({ strategy: 'weighted_score', ...config });
  const weights = normalized.providerWeights ?? {};
  const voteTally: Record<string, number> = {};
  let totalWeight = 0;

  for (const response of responses) {
    const baseWeight = response.provider ? (weights[response.provider] ?? 1) : 1;
    const confidenceBoost = response.confidence ?? 1;
    const score = baseWeight * confidenceBoost;
    voteTally[response.id] = score;
    totalWeight += score;
  }

  const winnerId = Object.entries(voteTally).sort((a, b) => b[1] - a[1])[0]?.[0];
  const winner = responses.find(r => r.id === winnerId) ?? null;
  const confidence = totalWeight === 0 || !winnerId ? 0 : voteTally[winnerId] / totalWeight;

  return buildResult(
    'weighted_score',
    winner,
    confidence,
    voteTally,
    responses,
    1,
    confidence >= normalized.threshold,
    'Weighted score using provider trust and response confidence.'
  );
}

export function confidenceRanking(
  responses: ConsensusResponse[],
  config: Partial<ConsensusConfig> = {}
): ConsensusResult {
  const normalized = normalizeConfig({ strategy: 'confidence_ranking', ...config });
  const ranked = rankByCohesion(responses).map(item => {
    const selfConfidence = item.response.confidence ?? 0.5;
    return {
      response: item.response,
      score: (selfConfidence * 0.6) + (item.score * 0.4),
    };
  }).sort((a, b) => b.score - a.score);

  const voteTally = Object.fromEntries(ranked.map(r => [r.response.id, r.score]));
  const winner = ranked[0]?.response ?? null;
  const confidence = ranked[0]?.score ?? 0;

  return buildResult(
    'confidence_ranking',
    winner,
    confidence,
    voteTally,
    responses,
    1,
    confidence >= normalized.threshold,
    'Ranking by self confidence blended with semantic cohesion.'
  );
}

export function adversarialDebate(
  responses: ConsensusResponse[],
  config: Partial<ConsensusConfig> = {}
): ConsensusResult {
  const normalized = normalizeConfig({ strategy: 'adversarial_debate', ...config });
  const maxRounds = normalized.maxRounds ?? DEFAULT_MAX_ROUNDS;
  const minDelta = normalized.minAgreementDelta ?? DEFAULT_MIN_DELTA;

  let current = responses.slice();
  let previousConfidence = 0;
  let roundResult = majorityVote(current, { threshold: normalized.threshold });

  for (let round = 1; round <= maxRounds; round += 1) {
    roundResult = majorityVote(current, { threshold: normalized.threshold });

    if (roundResult.confidence >= normalized.threshold || (round > 1 && roundResult.confidence - previousConfidence >= minDelta)) {
      return {
        ...roundResult,
        strategy: 'adversarial_debate',
        rounds: round,
        converged: roundResult.confidence >= normalized.threshold,
        reasoning: `Debate converged after ${round} round(s).`,
      };
    }

    previousConfidence = roundResult.confidence;

    current = current.map(response => {
      if (roundResult.winner && response.id !== roundResult.winner.id) {
        return {
          ...response,
          content: `${response.content} ${roundResult.winner.content}`.trim(),
        };
      }
      return response;
    });
  }

  return {
    ...roundResult,
    strategy: 'adversarial_debate',
    rounds: maxRounds,
    converged: roundResult.confidence >= normalized.threshold,
    reasoning: `Debate stopped after ${maxRounds} round(s) without full convergence.`,
  };
}
