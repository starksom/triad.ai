import { describe, expect, it } from '@jest/globals';
import { resolve } from 'node:path';

import { AgentEngine } from '../agents/engine.js';

describe('agents/engine', () => {
  const engine = new AgentEngine(resolve('.'));

  it('binds persona to allowed phase', () => {
    const codex = engine.create('codex');
    const configured = engine.configure(codex, 'DEVELOPMENT');

    const run = engine.run(configured, {
      type: 'codex',
      phase: 'DEVELOPMENT',
      task: 'Implement feature',
    });

    expect(run.persona.id).toBe('codex-implementer');
    expect(run.phase).toBe('DEVELOPMENT');
    expect(run.loadedSkills).toContain('codex/implementation-protocol.md');
  });

  it('rejects phase/persona mismatch', () => {
    const codex = engine.create('codex');
    expect(() => engine.configure(codex, 'VALIDATION')).toThrow('is not active in phase VALIDATION');
  });

  it('isolates skill loading by agent responsibility boundaries', () => {
    const antigravity = engine.configure(engine.create('antigravity'), 'VALIDATION');
    const run = engine.run(antigravity, {
      type: 'antigravity',
      phase: 'VALIDATION',
      task: 'Validate PR',
    });

    expect(run.loadedSkills).toContain('antigravity/validation-protocol.md');
    expect(run.loadedSkills).not.toContain('codex/implementation-protocol.md');
    expect(run.loadedSkills).not.toContain('claude_code/architecture-design.md');
  });

  it('supports lifecycle teardown', () => {
    const agent = engine.configure(engine.create('claude_code'), 'PLANNING');
    const tornDown = engine.teardown(agent);

    expect(tornDown.configured).toBe(false);
    expect(tornDown.activePhase).toBeUndefined();
  });
});
