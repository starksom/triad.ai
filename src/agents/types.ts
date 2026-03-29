export type AgentType = 'claude_code' | 'codex' | 'antigravity';

export type PipelinePhase = 'PLANNING' | 'DEVELOPMENT' | 'VALIDATION' | 'RELEASE_AUDIT';

export interface Persona {
  id: string;
  agentType: AgentType;
  displayName: string;
  description: string;
  responsibilities: string[];
  prohibitedActions: string[];
  activePhases: PipelinePhase[];
  promptFile: string;
  skills: {
    p0: string[];
    p1: string[];
    p2: string[];
  };
}

export interface Agent {
  type: AgentType;
  persona: Persona;
  configured: boolean;
  activePhase?: PipelinePhase;
}

export interface AgentLifecycleInput {
  type: AgentType;
  phase: PipelinePhase;
  task: string;
}

export interface AgentRunContext extends AgentLifecycleInput {
  persona: Persona;
  loadedSkills: string[];
}
