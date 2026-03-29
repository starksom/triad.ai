export type ConsensusStrategy =
  | 'majority_vote'
  | 'weighted_score'
  | 'confidence_ranking'
  | 'adversarial_debate';

export interface ConsensusResponse {
  id: string;
  content: string;
  provider?: string;
  weight?: number;
  confidence?: number;
}

export interface ConsensusConfig {
  strategy: ConsensusStrategy;
  threshold: number;
  maxRounds?: number;
  minAgreementDelta?: number;
  providerWeights?: Record<string, number>;
}

export interface ConsensusResult {
  strategy: ConsensusStrategy;
  winner: ConsensusResponse | null;
  confidence: number;
  voteTally: Record<string, number>;
  dissentingResponses: ConsensusResponse[];
  converged: boolean;
  rounds: number;
  reasoning: string;
}
