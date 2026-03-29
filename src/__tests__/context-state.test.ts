import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { writeFileSync, unlinkSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parseContextState, writeContextState, appendRejection } from '../utils/context-state.js';
import type { PipelineContext, RejectionEntry } from '../state-graph/types.js';

const TEST_DIR = join(process.cwd(), '.triad', 'test-tmp');
const TEST_FILE = join(TEST_DIR, 'CONTEXT_STATE_TEST.md');

const SAMPLE_CONTEXT_STATE = `# Context Synchronization Point (Context State)

This file acts as the project's "short-term memory". It serves as the transition baton between **Claude Code**, **Codex**, and **Antigravity**.
No AI agent may initiate its work without reading this file and understanding exactly which phase the development flow is currently in.

---

## Current Phase (Pipeline Status)
> **[PLANNING]**

*(Valid options: \`[PLANNING]\`, \`[DEVELOPMENT]\`, \`[VALIDATION]\`, \`[CONSOLIDATION]\`, \`[RELEASE_AUDIT]\`)*

---

## Current Task / Focus
- **Task:** N/A (Awaiting planning)
- **Story:** 0 of 0
- **Current Assignee:** Claude Code
- **Retry Count:** 0
- **Max Retries:** 3

---

## Roadmap Pillar(s)
**Active Pillar(s):** N/A
*(Reference: \`TRIAD_MASTER_ROADMAP.md\` Phase 2/3 pillars. Example: \`[P2-04] Graph Workflow Engine\`)*

---

## Handoff Message (From previous assignee)
"Project newly initialized. Claude Code must begin the planning phase."

---

## Rejection Log (if applicable)
*(Empty — no rejections recorded)*

<!-- Rejection entry format:
### Rejection #N - [YYYY-MM-DD]
- **Rejector:** Antigravity
- **Category:** [TEST_FAILURE | SECURITY_VIOLATION | UX_VIOLATION | PILLAR_CONFLICT | PR_SIZE_EXCEEDED]
- **Files:** [affected files with line numbers]
- **Error:** [exact error output]
- **Required Fix:** [specific fix instruction]
- **Checklist Failures:** [which items failed]
-->

---

## Completion Signal
> INCOMPLETE
`;

beforeEach(() => {
  if (!existsSync(TEST_DIR)) {
    mkdirSync(TEST_DIR, { recursive: true });
  }
  writeFileSync(TEST_FILE, SAMPLE_CONTEXT_STATE, 'utf-8');
});

afterEach(() => {
  if (existsSync(TEST_FILE)) {
    unlinkSync(TEST_FILE);
  }
});

describe('parseContextState', () => {
  it('parses phase correctly', () => {
    const ctx = parseContextState(TEST_FILE);
    expect(ctx.phase).toBe('PLANNING');
  });

  it('parses task correctly', () => {
    const ctx = parseContextState(TEST_FILE);
    expect(ctx.task).toBe('N/A (Awaiting planning)');
  });

  it('parses story correctly', () => {
    const ctx = parseContextState(TEST_FILE);
    expect(ctx.story).toEqual({ current: 0, total: 0 });
  });

  it('parses assignee correctly', () => {
    const ctx = parseContextState(TEST_FILE);
    expect(ctx.assignee).toBe('Claude Code');
  });

  it('parses retry count and max retries', () => {
    const ctx = parseContextState(TEST_FILE);
    expect(ctx.retryCount).toBe(0);
    expect(ctx.maxRetries).toBe(3);
  });

  it('parses handoff message correctly', () => {
    const ctx = parseContextState(TEST_FILE);
    expect(ctx.handoffMessage).toBe('Project newly initialized. Claude Code must begin the planning phase.');
  });

  it('parses completion signal correctly', () => {
    const ctx = parseContextState(TEST_FILE);
    expect(ctx.completionSignal).toBe('INCOMPLETE');
  });

  it('parses empty rejection log', () => {
    const ctx = parseContextState(TEST_FILE);
    expect(ctx.rejectionLog).toEqual([]);
  });

  it('parses roadmap pillars', () => {
    const ctx = parseContextState(TEST_FILE);
    expect(ctx.roadmapPillars).toBe('N/A');
  });

  it('parses consensus config when present', () => {
    const withConsensus = `${SAMPLE_CONTEXT_STATE}\n## Consensus Config (Optional)\n- **Strategy:** weighted_score\n- **Threshold:** 0.82\n- **Max Rounds:** 4\n- **Min Agreement Delta:** 0.03\n`;
    writeFileSync(TEST_FILE, withConsensus, 'utf-8');
    const ctx = parseContextState(TEST_FILE);
    expect(ctx.consensusConfig).toEqual({
      strategy: 'weighted_score',
      threshold: 0.82,
      maxRounds: 4,
      minAgreementDelta: 0.03,
    });
  });
});

describe('writeContextState', () => {
  it('round-trips a context correctly', () => {
    const original = parseContextState(TEST_FILE);
    writeContextState(TEST_FILE, original);
    const roundTripped = parseContextState(TEST_FILE);

    expect(roundTripped.phase).toBe(original.phase);
    expect(roundTripped.task).toBe(original.task);
    expect(roundTripped.story).toEqual(original.story);
    expect(roundTripped.assignee).toBe(original.assignee);
    expect(roundTripped.retryCount).toBe(original.retryCount);
    expect(roundTripped.maxRetries).toBe(original.maxRetries);
    expect(roundTripped.handoffMessage).toBe(original.handoffMessage);
    expect(roundTripped.completionSignal).toBe(original.completionSignal);
  });

  it('writes a modified context correctly', () => {
    const ctx: PipelineContext = {
      phase: 'DEVELOPMENT',
      task: 'Implement /health endpoint',
      story: { current: 1, total: 3 },
      assignee: 'Codex',
      retryCount: 0,
      maxRetries: 3,
      rejectionLog: [],
      handoffMessage: '3 stories planned. Start with /health endpoint.',
      completionSignal: 'INCOMPLETE',
      roadmapPillars: '[P2-04] Graph Workflow Engine',
    };

    writeContextState(TEST_FILE, ctx);
    const parsed = parseContextState(TEST_FILE);

    expect(parsed.phase).toBe('DEVELOPMENT');
    expect(parsed.task).toBe('Implement /health endpoint');
    expect(parsed.story).toEqual({ current: 1, total: 3 });
    expect(parsed.assignee).toBe('Codex');
    expect(parsed.roadmapPillars).toBe('[P2-04] Graph Workflow Engine');
    expect(parsed.consensusConfig).toBeUndefined();
  });

  it('writes and parses consensus config section', () => {
    const ctx: PipelineContext = {
      phase: 'DEVELOPMENT',
      task: 'Consensus test',
      story: { current: 2, total: 3 },
      assignee: 'Codex',
      retryCount: 0,
      maxRetries: 3,
      rejectionLog: [],
      handoffMessage: 'Use consensus engine defaults.',
      completionSignal: 'INCOMPLETE',
      roadmapPillars: '[P2-03] Consensus Engine',
      consensusConfig: {
        strategy: 'adversarial_debate',
        threshold: 0.8,
        maxRounds: 5,
        minAgreementDelta: 0.01,
      },
    };

    writeContextState(TEST_FILE, ctx);
    const parsed = parseContextState(TEST_FILE);
    expect(parsed.consensusConfig).toEqual(ctx.consensusConfig);
  });
});

describe('appendRejection', () => {
  it('appends a rejection entry', () => {
    const rejection: RejectionEntry = {
      number: 1,
      date: '2026-03-16',
      rejector: 'Antigravity',
      category: 'TEST_FAILURE',
      files: 'src/index.js:15',
      error: 'Expected 200, got 404',
      requiredFix: 'Add /health route handler',
      checklistFailures: 'FR-01: Route responds with 200',
    };

    appendRejection(TEST_FILE, rejection);
    const ctx = parseContextState(TEST_FILE);

    expect(ctx.rejectionLog).toHaveLength(1);
    expect(ctx.rejectionLog[0].category).toBe('TEST_FAILURE');
    expect(ctx.rejectionLog[0].files).toBe('src/index.js:15');
  });
});
