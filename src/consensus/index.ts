import type { MultiModelProviderResult, MultiModelResponse } from '../multi-model/types.js';

export interface ConsensusResult {
  winnerProviderId: string;
  confidence: number;
  rationale: string;
}

function normalizeContent(content: string): string {
  return content.toLowerCase().replace(/\s+/g, ' ').trim();
}

function scoreResult(result: MultiModelProviderResult): number {
  const tokenScore = (result.outputTokens ?? 0) * 0.001;
  const latencyPenalty = result.latencyMs > 0 ? Math.min(result.latencyMs / 10000, 0.2) : 0;
  return normalizeContent(result.content).length + tokenScore - latencyPenalty;
}

export function resolveConsensus(response: MultiModelResponse): ConsensusResult {
  if (response.results.length === 0) {
    throw new Error('Cannot resolve consensus from empty result set.');
  }

  const normalizedCounts = new Map<string, number>();
  for (const result of response.results) {
    const normalized = normalizeContent(result.content);
    normalizedCounts.set(normalized, (normalizedCounts.get(normalized) ?? 0) + 1);
  }

  const winner = response.results.reduce((best, current) => {
    const bestVotes = normalizedCounts.get(normalizeContent(best.content)) ?? 0;
    const currentVotes = normalizedCounts.get(normalizeContent(current.content)) ?? 0;

    if (currentVotes > bestVotes) {
      return current;
    }

    if (currentVotes === bestVotes && scoreResult(current) > scoreResult(best)) {
      return current;
    }

    return best;
  }, response.results[0]);

  const winnerVotes = normalizedCounts.get(normalizeContent(winner.content)) ?? 1;
  const confidence = Number((winnerVotes / response.results.length).toFixed(3));

  return {
    winnerProviderId: winner.providerId,
    confidence,
    rationale:
      winnerVotes > 1
        ? 'Selected by response agreement across providers.'
        : 'Selected by quality heuristic tie-break (length + latency).',
  };
}
