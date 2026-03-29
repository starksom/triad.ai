/**
 * Guard functions and action handlers for state graph transitions.
 *
 * Guards return true to allow a transition, false to block it.
 * Actions perform side effects (checkpoint, trace, git, state mutations).
 */

import type { PipelineContext, RejectionEntry, RejectionCategory } from './types.js';

// ---------------------------------------------------------------------------
// Guard Functions
// ---------------------------------------------------------------------------

export type GuardFn = (ctx: PipelineContext) => boolean;

export const guards: Record<string, GuardFn> = {
  hasStories: (ctx) => ctx.story.total > 0,

  retryBelowMax: (ctx) => ctx.retryCount < ctx.maxRetries,

  retryAtOrAboveMax: (ctx) => ctx.retryCount >= ctx.maxRetries,

  hasRemainingStories: (ctx) => ctx.story.current < ctx.story.total,

  allStoriesComplete: (ctx) => ctx.story.current >= ctx.story.total,

  humanFinalCommitAuthority: () => true,
};

// ---------------------------------------------------------------------------
// Action Functions (synchronous state mutations)
// ---------------------------------------------------------------------------

export type ActionFn = (ctx: PipelineContext, payload?: ActionPayload) => PipelineContext;

export interface ActionPayload {
  rejectionCategory?: RejectionCategory;
  rejectionFiles?: string;
  rejectionError?: string;
  rejectionFix?: string;
  rejectionChecklist?: string;
  escalationReason?: string;
}

export const actions: Record<string, ActionFn> = {
  incrementRetry: (ctx) => ({
    ...ctx,
    retryCount: ctx.retryCount + 1,
  }),

  resetRetryCount: (ctx) => ({
    ...ctx,
    retryCount: 0,
  }),

  clearRejectionLog: (ctx) => ({
    ...ctx,
    rejectionLog: [],
  }),

  incrementStory: (ctx) => ({
    ...ctx,
    story: { current: ctx.story.current + 1, total: ctx.story.total },
  }),

  logRejection: (ctx, payload) => {
    const rejection: RejectionEntry = {
      number: ctx.rejectionLog.length + 1,
      date: new Date().toISOString().split('T')[0],
      rejector: 'Antigravity',
      category: payload?.rejectionCategory ?? 'TEST_FAILURE',
      files: payload?.rejectionFiles ?? '',
      error: payload?.rejectionError ?? '',
      requiredFix: payload?.rejectionFix ?? '',
      checklistFailures: payload?.rejectionChecklist ?? '',
    };
    return {
      ...ctx,
      rejectionLog: [...ctx.rejectionLog, rejection],
    };
  },

  logEscalation: (ctx, payload) => ({
    ...ctx,
    handoffMessage: `Escalated after ${ctx.retryCount} retries. ${payload?.escalationReason ?? 'Max retries exceeded.'}`,
  }),

  // These are handled externally by the engine (checkpoint, trace, git).
  // They are no-ops in terms of context mutation.
  saveCheckpoint: (ctx) => ctx,
  traceTransition: (ctx) => ctx,
  gitCommit: (ctx) => ctx,
};
