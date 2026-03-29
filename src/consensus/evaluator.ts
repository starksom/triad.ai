import type { ConsensusResponse } from './types.js';

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .split(/\s+/)
      .filter(Boolean)
  );
}

export function semanticSimilarity(a: string, b: string): number {
  const aTokens = tokenize(a);
  const bTokens = tokenize(b);

  if (aTokens.size === 0 && bTokens.size === 0) {
    return 1;
  }

  const intersection = [...aTokens].filter(token => bTokens.has(token)).length;
  const union = new Set([...aTokens, ...bTokens]).size;

  return union === 0 ? 0 : intersection / union;
}

export function pairwiseSimilarityMatrix(responses: ConsensusResponse[]): number[][] {
  return responses.map(source =>
    responses.map(target => semanticSimilarity(source.content, target.content))
  );
}

export function rankByCohesion(responses: ConsensusResponse[]): Array<{ response: ConsensusResponse; score: number }> {
  const matrix = pairwiseSimilarityMatrix(responses);
  return responses
    .map((response, idx) => {
      const similarities = matrix[idx].filter((_, j) => j !== idx);
      const score = similarities.length === 0
        ? 1
        : similarities.reduce((sum, value) => sum + value, 0) / similarities.length;
      return { response, score };
    })
    .sort((a, b) => b.score - a.score);
}
