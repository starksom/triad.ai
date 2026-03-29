export type AutonomyLevel = 'supervised' | 'semi_autonomous' | 'autonomous';

export interface DarkFactoryConfig {
  specPath: string;
  autonomyLevel: AutonomyLevel;
  maxCycles: number;
  satisfactionThreshold: number;
  requirements: string[];
  acceptanceCriteria: Array<{ text: string; checked: boolean }>;
  constraints: string[];
  stopConditions: string[];
  humanFinalCommitAuthority: boolean;
}

export type DarkFactoryCycleStatus =
  | 'continue'
  | 'satisfied'
  | 'stopped'
  | 'max_cycles_reached'
  | 'human_authority_required';

export interface CycleResult {
  cycle: number;
  status: DarkFactoryCycleStatus;
  transitions: string[];
  satisfactionScore: number;
  stopReason?: string;
  phaseAfterCycle: string;
}

export interface DarkFactoryRunResult {
  config: DarkFactoryConfig;
  cycles: CycleResult[];
  finalPhase: string;
  completed: boolean;
  reason: string;
  humanFinalCommitAuthorityRequired: boolean;
}
