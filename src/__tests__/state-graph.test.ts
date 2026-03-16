import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { writeFileSync, readFileSync, unlinkSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { StateGraphEngine, TransitionGuardError, InvalidTransitionError } from '../state-graph/engine.js';
import type { PipelineContext } from '../state-graph/types.js';
import { writeContextState } from '../utils/context-state.js';

const TEST_DIR = join(process.cwd(), '.triad', 'test-tmp');
const CONTEXT_FILE = join(TEST_DIR, 'CONTEXT_STATE_GRAPH_TEST.md');
const GRAPH_FILE = join(process.cwd(), 'src', 'state-graph', 'graph.json');

function writeTestContext(overrides: Partial<PipelineContext> = {}): void {
  const defaults: PipelineContext = {
    phase: 'PLANNING',
    task: 'Test task',
    story: { current: 1, total: 3 },
    assignee: 'Claude Code',
    retryCount: 0,
    maxRetries: 3,
    rejectionLog: [],
    handoffMessage: 'Test handoff',
    completionSignal: 'INCOMPLETE',
    roadmapPillars: 'N/A',
  };
  writeContextState(CONTEXT_FILE, { ...defaults, ...overrides });
}

beforeEach(() => {
  if (!existsSync(TEST_DIR)) {
    mkdirSync(TEST_DIR, { recursive: true });
  }
});

afterEach(() => {
  if (existsSync(CONTEXT_FILE)) {
    unlinkSync(CONTEXT_FILE);
  }
});

describe('StateGraphEngine', () => {
  describe('getCurrentState', () => {
    it('reads context from CONTEXT_STATE.md', () => {
      writeTestContext();
      const engine = new StateGraphEngine(GRAPH_FILE, CONTEXT_FILE);
      const state = engine.getCurrentState();
      expect(state.phase).toBe('PLANNING');
      expect(state.task).toBe('Test task');
    });
  });

  describe('getAvailableTransitions', () => {
    it('returns valid events from current state', () => {
      writeTestContext({ phase: 'PLANNING' });
      const engine = new StateGraphEngine(GRAPH_FILE, CONTEXT_FILE);
      const transitions = engine.getAvailableTransitions();
      expect(transitions).toContain('START_DEVELOPMENT');
    });

    it('returns validation transitions for VALIDATION phase', () => {
      writeTestContext({ phase: 'VALIDATION' });
      const engine = new StateGraphEngine(GRAPH_FILE, CONTEXT_FILE);
      const transitions = engine.getAvailableTransitions();
      expect(transitions).toContain('APPROVE');
      expect(transitions).toContain('REJECT');
      expect(transitions).toContain('ESCALATE');
    });
  });

  describe('transition', () => {
    it('transitions from PLANNING to DEVELOPMENT when stories exist', async () => {
      writeTestContext({ phase: 'PLANNING', story: { current: 1, total: 3 } });
      const engine = new StateGraphEngine(GRAPH_FILE, CONTEXT_FILE);
      const result = await engine.transition('START_DEVELOPMENT');

      expect(result.from).toBe('PLANNING');
      expect(result.to).toBe('DEVELOPMENT');
      expect(result.agent).toBe('Codex');

      // Verify CONTEXT_STATE.md was updated
      const newState = engine.getCurrentState();
      expect(newState.phase).toBe('DEVELOPMENT');
      expect(newState.assignee).toBe('Codex');
    });

    it('throws TransitionGuardError when guard fails', async () => {
      writeTestContext({ phase: 'PLANNING', story: { current: 0, total: 0 } });
      const engine = new StateGraphEngine(GRAPH_FILE, CONTEXT_FILE);

      await expect(engine.transition('START_DEVELOPMENT'))
        .rejects.toThrow(TransitionGuardError);
    });

    it('throws InvalidTransitionError for invalid event', async () => {
      writeTestContext({ phase: 'PLANNING' });
      const engine = new StateGraphEngine(GRAPH_FILE, CONTEXT_FILE);

      await expect(engine.transition('APPROVE'))
        .rejects.toThrow(InvalidTransitionError);
    });

    it('transitions DEVELOPMENT to VALIDATION', async () => {
      writeTestContext({ phase: 'DEVELOPMENT' });
      const engine = new StateGraphEngine(GRAPH_FILE, CONTEXT_FILE);
      const result = await engine.transition('SUBMIT_FOR_VALIDATION');

      expect(result.from).toBe('DEVELOPMENT');
      expect(result.to).toBe('VALIDATION');
    });

    it('REJECT increments retry count and logs rejection', async () => {
      writeTestContext({ phase: 'VALIDATION', retryCount: 0, maxRetries: 3 });
      const engine = new StateGraphEngine(GRAPH_FILE, CONTEXT_FILE);

      const result = await engine.transition('REJECT', {
        rejectionCategory: 'TEST_FAILURE',
        rejectionError: 'Test failed',
        rejectionFix: 'Fix the test',
      });

      expect(result.to).toBe('DEVELOPMENT');
      expect(result.context.retryCount).toBe(1);
      expect(result.context.rejectionLog).toHaveLength(1);
      expect(result.context.rejectionLog[0].category).toBe('TEST_FAILURE');
    });

    it('REJECT fails when retry count >= max', async () => {
      writeTestContext({ phase: 'VALIDATION', retryCount: 3, maxRetries: 3 });
      const engine = new StateGraphEngine(GRAPH_FILE, CONTEXT_FILE);

      await expect(engine.transition('REJECT'))
        .rejects.toThrow(TransitionGuardError);
    });

    it('ESCALATE succeeds when retry >= max', async () => {
      writeTestContext({ phase: 'VALIDATION', retryCount: 3, maxRetries: 3 });
      const engine = new StateGraphEngine(GRAPH_FILE, CONTEXT_FILE);
      const result = await engine.transition('ESCALATE');

      expect(result.to).toBe('PLANNING');
      // onEnter resets retry count for PLANNING
      expect(result.context.retryCount).toBe(0);
    });

    it('NEXT_STORY advances story counter', async () => {
      writeTestContext({ phase: 'CONSOLIDATION', story: { current: 1, total: 3 } });
      const engine = new StateGraphEngine(GRAPH_FILE, CONTEXT_FILE);
      const result = await engine.transition('NEXT_STORY');

      expect(result.to).toBe('DEVELOPMENT');
      expect(result.context.story.current).toBe(2);
      expect(result.context.retryCount).toBe(0);
    });

    it('ALL_STORIES_COMPLETE transitions to RELEASE_AUDIT', async () => {
      writeTestContext({ phase: 'CONSOLIDATION', story: { current: 3, total: 3 } });
      const engine = new StateGraphEngine(GRAPH_FILE, CONTEXT_FILE);
      const result = await engine.transition('ALL_STORIES_COMPLETE');

      expect(result.to).toBe('RELEASE_AUDIT');
    });

    it('callbacks are triggered for checkpoint/trace/git actions', async () => {
      writeTestContext({ phase: 'DEVELOPMENT' });

      let checkpointCalled = false;
      let traceCalled = false;
      let gitCalled = false;

      const engine = new StateGraphEngine(GRAPH_FILE, CONTEXT_FILE, {
        onCheckpoint: () => { checkpointCalled = true; },
        onTrace: () => { traceCalled = true; },
        onGitCommit: () => { gitCalled = true; },
      });

      await engine.transition('SUBMIT_FOR_VALIDATION');

      expect(checkpointCalled).toBe(true);
      expect(traceCalled).toBe(true);
      expect(gitCalled).toBe(true);
    });
  });

  describe('validateGraph', () => {
    it('validates the default graph without errors', () => {
      const graphJson = JSON.parse(
        readFileSync(GRAPH_FILE, 'utf-8')
      );
      const errors = StateGraphEngine.validateGraph(graphJson);
      expect(errors).toEqual([]);
    });
  });
});
