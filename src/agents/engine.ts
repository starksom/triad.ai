import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import type {
  Agent,
  AgentLifecycleInput,
  AgentRunContext,
  AgentType,
  Persona,
  PipelinePhase,
} from './types.js';

const AGENT_TO_SKILL_DIRECTORY: Record<AgentType, string> = {
  claude_code: 'skills/claude_code/',
  codex: 'skills/codex/',
  antigravity: 'skills/antigravity/',
};

export class AgentEngine {
  constructor(private readonly rootDir: string = resolve('.')) {}

  create(type: AgentType): Agent {
    const persona = this.loadPersona(type);
    return {
      type,
      persona,
      configured: false,
    };
  }

  configure(agent: Agent, phase: PipelinePhase): Agent {
    if (!agent.persona.activePhases.includes(phase)) {
      throw new Error(`Persona ${agent.persona.id} is not active in phase ${phase}.`);
    }

    return {
      ...agent,
      configured: true,
      activePhase: phase,
    };
  }

  run(agent: Agent, input: AgentLifecycleInput): AgentRunContext {
    if (!agent.configured || !agent.activePhase) {
      throw new Error(`Agent ${agent.type} must be configured before run.`);
    }

    if (agent.activePhase !== input.phase) {
      throw new Error(`Agent ${agent.type} configured for ${agent.activePhase}, but got ${input.phase}.`);
    }

    const loadedSkills = this.loadSkillsForPersona(agent.persona, input.phase);

    return {
      ...input,
      persona: agent.persona,
      loadedSkills,
    };
  }

  teardown(agent: Agent): Agent {
    return {
      ...agent,
      configured: false,
      activePhase: undefined,
    };
  }

  private loadPersona(type: AgentType): Persona {
    const path = join(this.rootDir, 'src', 'agents', 'personas', `${type}.json`);
    if (!existsSync(path)) {
      throw new Error(`Persona not found: ${path}`);
    }

    const parsed = JSON.parse(readFileSync(path, 'utf-8')) as Persona;
    if (parsed.agentType !== type) {
      throw new Error(`Persona ${parsed.id} has mismatched agent type: ${parsed.agentType}`);
    }

    return parsed;
  }

  private loadSkillsForPersona(persona: Persona, phase: PipelinePhase): string[] {
    const global = this.extractGlobalSkillsForAgent(persona.agentType);
    const scoped = new Set<string>(persona.skills.p0);

    if (phase !== 'RELEASE_AUDIT') {
      for (const skill of persona.skills.p1) {
        scoped.add(skill);
      }
    }

    return [...new Set([...global.shared, ...global.agentScoped, ...scoped])];
  }

  private extractGlobalSkillsForAgent(type: AgentType): { shared: string[]; agentScoped: string[] } {
    const globalPath = join(this.rootDir, 'skills', 'GLOBAL_SKILLS.md');
    if (!existsSync(globalPath)) {
      throw new Error(`Missing global skills index: ${globalPath}`);
    }

    const content = readFileSync(globalPath, 'utf-8');
    const bulletSkills = [...content.matchAll(/- `([^`]+\.md)`/g)].map((match) => match[1]);

    const shared = bulletSkills.filter((skill) => skill.startsWith('shared/'));
    const agentPrefix = AGENT_TO_SKILL_DIRECTORY[type];
    const agentScoped = bulletSkills.filter((skill) => skill.startsWith(agentPrefix));

    return { shared, agentScoped };
  }
}
