/**
 * State Graph Engine for the Triad Pipeline.
 *
 * Reads graph definitions from JSON, validates transitions against guards,
 * executes actions, and updates CONTEXT_STATE.md.
 */

import { readFileSync } from 'node:fs';
import type { StateGraph, PipelineContext, TransitionResult } from './types.js';
import { guards as guardFns, actions as actionFns, type ActionPayload } from './transitions.js';
import { parseContextState, writeContextState } from '../utils/context-state.js';

export class TransitionGuardError extends Error {
  public readonly guard: string;

  constructor(guard: string, message: string) {
    super(message);
    this.name = 'TransitionGuardError';
    this.guard = guard;
  }
}

export class InvalidTransitionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidTransitionError';
  }
}

export interface EngineCallbacks {
  onCheckpoint?: (result: TransitionResult) => void | Promise<void>;
  onTrace?: (result: TransitionResult) => void | Promise<void>;
  onGitCommit?: (result: TransitionResult) => void | Promise<void>;
}

export class StateGraphEngine {
  private readonly graph: StateGraph;
  private readonly contextStatePath: string;
  private callbacks: EngineCallbacks;

  constructor(graphPath: string, contextStatePath: string, callbacks: EngineCallbacks = {}) {
    const raw = readFileSync(graphPath, 'utf-8');
    this.graph = JSON.parse(raw) as StateGraph;
    this.contextStatePath = contextStatePath;
    this.callbacks = callbacks;
  }

  /**
   * Read current pipeline state from CONTEXT_STATE.md.
   */
  getCurrentState(): PipelineContext {
    return parseContextState(this.contextStatePath);
  }

  /**
   * Get available transition events from the current phase.
   */
  getAvailableTransitions(ctx?: PipelineContext): string[] {
    const context = ctx ?? this.getCurrentState();
    const stateNode = this.graph.states[context.phase];
    if (!stateNode) return [];
    return Object.keys(stateNode.transitions);
  }

  /**
   * Execute a state transition.
   *
   * 1. Resolve current state
   * 2. Look up the event in the graph
   * 3. Run all guard functions
   * 4. Run all action functions (mutate context + trigger side effects)
   * 5. Update CONTEXT_STATE.md
   * 6. Return transition result
   */
  async transition(event: string, payload?: ActionPayload): Promise<TransitionResult> {
    let ctx = this.getCurrentState();
    const fromPhase = ctx.phase;

    // Look up state node
    const stateNode = this.graph.states[fromPhase];
    if (!stateNode) {
      throw new InvalidTransitionError(`Unknown state: ${fromPhase}`);
    }

    // Look up transition edge
    const edge = stateNode.transitions[event];
    if (!edge) {
      const available = Object.keys(stateNode.transitions).join(', ');
      throw new InvalidTransitionError(
        `Event "${event}" is not valid from state "${fromPhase}". Available: ${available}`
      );
    }

    // Run guards
    for (const guardName of edge.guards) {
      const guardFn = guardFns[guardName];
      if (!guardFn) {
        throw new TransitionGuardError(guardName, `Unknown guard: ${guardName}`);
      }
      if (!guardFn(ctx)) {
        throw new TransitionGuardError(
          guardName,
          `Guard "${guardName}" failed for transition ${fromPhase} -> ${edge.target} (event: ${event})`
        );
      }
    }

    // Execute onEnter actions for the target state (if defined)
    const targetNode = this.graph.states[edge.target];
    if (targetNode?.onEnter) {
      for (const actionName of targetNode.onEnter) {
        const actionFn = actionFns[actionName];
        if (actionFn) {
          ctx = actionFn(ctx, payload);
        }
      }
    }

    // Execute transition actions
    for (const actionName of edge.actions) {
      const actionFn = actionFns[actionName];
      if (actionFn) {
        ctx = actionFn(ctx, payload);
      }
    }

    // Update phase and assignee
    ctx.phase = edge.target;
    if (targetNode) {
      ctx.assignee = targetNode.assignee;
    }

    // Write back to CONTEXT_STATE.md
    writeContextState(this.contextStatePath, ctx);

    const result: TransitionResult = {
      from: fromPhase,
      to: edge.target,
      event,
      agent: ctx.assignee,
      context: ctx,
    };

    // Trigger external callbacks for side-effect actions
    if (edge.actions.includes('saveCheckpoint') && this.callbacks.onCheckpoint) {
      await this.callbacks.onCheckpoint(result);
    }
    if (edge.actions.includes('traceTransition') && this.callbacks.onTrace) {
      await this.callbacks.onTrace(result);
    }
    if (edge.actions.includes('gitCommit') && this.callbacks.onGitCommit) {
      await this.callbacks.onGitCommit(result);
    }

    return result;
  }

  /**
   * Get the full graph definition (for dashboard visualization).
   */
  getGraph(): StateGraph {
    return this.graph;
  }

  /**
   * Validate the graph for common issues.
   */
  static validateGraph(graph: StateGraph): string[] {
    const errors: string[] = [];
    const stateNames = new Set(Object.keys(graph.states));

    if (!stateNames.has(graph.initialState)) {
      errors.push(`Initial state "${graph.initialState}" is not defined in states`);
    }

    for (const [stateName, stateNode] of Object.entries(graph.states)) {
      for (const [eventName, edge] of Object.entries(stateNode.transitions)) {
        if (!stateNames.has(edge.target)) {
          errors.push(
            `State "${stateName}" event "${eventName}" targets unknown state "${edge.target}"`
          );
        }

        for (const guardName of edge.guards) {
          if (!(guardName in guardFns)) {
            errors.push(
              `State "${stateName}" event "${eventName}" references unknown guard "${guardName}"`
            );
          }
        }

        for (const actionName of edge.actions) {
          if (!(actionName in actionFns)) {
            errors.push(
              `State "${stateName}" event "${eventName}" references unknown action "${actionName}"`
            );
          }
        }
      }
    }

    // Check for unreachable states
    const reachable = new Set<string>([graph.initialState]);
    let changed = true;
    while (changed) {
      changed = false;
      for (const stateName of reachable) {
        const node = graph.states[stateName];
        if (!node) continue;
        for (const edge of Object.values(node.transitions)) {
          if (!reachable.has(edge.target)) {
            reachable.add(edge.target);
            changed = true;
          }
        }
      }
    }

    for (const stateName of stateNames) {
      if (!reachable.has(stateName)) {
        errors.push(`State "${stateName}" is unreachable from initial state "${graph.initialState}"`);
      }
    }

    return errors;
  }
}
