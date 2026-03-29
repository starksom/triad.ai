import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { StateGraphEngine, TransitionGuardError, InvalidTransitionError } from '../state-graph/engine.js';
import type { PipelineContext } from '../state-graph/types.js';
import type { AutonomyLevel, DarkFactoryConfig, DarkFactoryRunResult, CycleResult } from './types.js';

interface DarkFactoryRunnerOptions {
  graphPath: string;
  contextStatePath: string;
}

export class DarkFactoryRunner {
  private readonly engine: StateGraphEngine;

  constructor(options: DarkFactoryRunnerOptions) {
    this.engine = new StateGraphEngine(options.graphPath, options.contextStatePath);
  }

  async runFromSpec(specPath: string): Promise<DarkFactoryRunResult> {
    const absoluteSpecPath = resolve(specPath);
    const specMarkdown = readFileSync(absoluteSpecPath, 'utf-8');
    const config = this.parseSpec(specMarkdown, absoluteSpecPath);

    const cycles: CycleResult[] = [];

    for (let cycle = 1; cycle <= config.maxCycles; cycle += 1) {
      const cycleTransitions: string[] = [];

      await this.tryTransition(['DARK_FACTORY_START', 'START_DEVELOPMENT'], cycleTransitions);
      await this.tryTransition(['DARK_FACTORY_SUBMIT', 'SUBMIT_FOR_VALIDATION'], cycleTransitions);

      const ctxBeforeValidation = this.engine.getCurrentState();
      const satisfactionScore = this.calculateSatisfaction(config);

      const stopReason = this.matchStopCondition(config, ctxBeforeValidation, satisfactionScore);
      if (stopReason) {
        cycles.push({
          cycle,
          status: 'stopped',
          transitions: cycleTransitions,
          satisfactionScore,
          stopReason,
          phaseAfterCycle: this.engine.getCurrentState().phase,
        });

        return {
          config,
          cycles,
          finalPhase: this.engine.getCurrentState().phase,
          completed: false,
          reason: stopReason,
          humanFinalCommitAuthorityRequired: true,
        };
      }

      if (satisfactionScore >= config.satisfactionThreshold) {
        await this.tryTransition(['DARK_FACTORY_APPROVE', 'APPROVE'], cycleTransitions);

        const current = this.engine.getCurrentState();
        if (current.phase === 'CONSOLIDATION') {
          await this.tryTransition(['DARK_FACTORY_COMPLETE', 'ALL_STORIES_COMPLETE'], cycleTransitions);
        }

        const atReleaseAudit = this.engine.getCurrentState();
        if (atReleaseAudit.phase === 'RELEASE_AUDIT') {
          await this.tryTransition(
            ['DARK_FACTORY_REQUIRE_HUMAN_FINAL_AUTHORITY', 'RELEASE_TO_USER'],
            cycleTransitions
          );
        }

        cycles.push({
          cycle,
          status: 'human_authority_required',
          transitions: cycleTransitions,
          satisfactionScore,
          stopReason: 'Human final commit authority required before closure.',
          phaseAfterCycle: this.engine.getCurrentState().phase,
        });

        return {
          config,
          cycles,
          finalPhase: this.engine.getCurrentState().phase,
          completed: false,
          reason: 'Waiting for explicit human final commit authority (COMMIT/SEND_BACK).',
          humanFinalCommitAuthorityRequired: true,
        };
      }

      const current = this.engine.getCurrentState();
      const rejectEvent = current.retryCount < current.maxRetries
        ? ['DARK_FACTORY_REJECT', 'REJECT']
        : ['DARK_FACTORY_ESCALATE', 'ESCALATE'];
      await this.tryTransition(rejectEvent, cycleTransitions);

      cycles.push({
        cycle,
        status: 'continue',
        transitions: cycleTransitions,
        satisfactionScore,
        phaseAfterCycle: this.engine.getCurrentState().phase,
      });
    }

    return {
      config,
      cycles,
      finalPhase: this.engine.getCurrentState().phase,
      completed: false,
      reason: `Max cycles reached (${config.maxCycles}) without meeting satisfaction threshold.`,
      humanFinalCommitAuthorityRequired: true,
    };
  }

  private parseSpec(markdown: string, specPath: string): DarkFactoryConfig {
    const autonomyRaw = this.extractSingle(markdown, 'Autonomy Level') ?? 'supervised';
    if (!this.isAutonomyLevel(autonomyRaw)) {
      throw new Error(`Invalid autonomy level in spec: ${autonomyRaw}`);
    }

    const maxCycles = Number(this.extractSingle(markdown, 'Max Cycles') ?? '5');
    if (!Number.isFinite(maxCycles) || maxCycles <= 0) {
      throw new Error('Invalid Max Cycles. Must be a positive number.');
    }

    const satisfactionThreshold = Number(this.extractSingle(markdown, 'Satisfaction Threshold') ?? '0.8');
    if (!Number.isFinite(satisfactionThreshold) || satisfactionThreshold < 0 || satisfactionThreshold > 1) {
      throw new Error('Invalid Satisfaction Threshold. Must be between 0 and 1.');
    }

    const requirements = this.extractList(markdown, 'Requirements');
    const acceptanceCriteria = this.extractChecklist(markdown, 'Acceptance Criteria');
    const constraints = this.extractList(markdown, 'Constraints');
    const stopConditions = this.extractList(markdown, 'Stop Conditions');

    if (requirements.length === 0) {
      throw new Error('Spec must include at least one requirement.');
    }
    if (acceptanceCriteria.length === 0) {
      throw new Error('Spec must include at least one acceptance criterion.');
    }

    return {
      specPath,
      autonomyLevel: autonomyRaw,
      maxCycles,
      satisfactionThreshold,
      requirements,
      acceptanceCriteria,
      constraints,
      stopConditions,
      humanFinalCommitAuthority: true,
    };
  }

  private extractSingle(markdown: string, key: string): string | null {
    const regex = new RegExp(`^##\\s+${this.escapeRegex(key)}:\\s*(.+)$`, 'im');
    const match = markdown.match(regex);
    return match ? match[1].trim() : null;
  }

  private extractList(markdown: string, section: string): string[] {
    const block = this.extractSectionBlock(markdown, section);
    if (!block) return [];

    return block
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('- '))
      .map(line => line.replace(/^-\s+/, '').trim());
  }

  private extractChecklist(markdown: string, section: string): Array<{ text: string; checked: boolean }> {
    const block = this.extractSectionBlock(markdown, section);
    if (!block) return [];

    return block
      .split('\n')
      .map(line => line.trim())
      .map(line => {
        const checked = /^-\s*\[[xX]\]/.test(line);
        const open = /^-\s*\[\s\]/.test(line);
        if (!checked && !open) return null;

        return {
          text: line.replace(/^-\s*\[[xX\s]\]\s*/, '').trim(),
          checked,
        };
      })
      .filter((item): item is { text: string; checked: boolean } => Boolean(item));
  }

  private extractSectionBlock(markdown: string, section: string): string | null {
    const regex = new RegExp(
      `^##\\s+${this.escapeRegex(section)}\\s*$([\\s\\S]*?)(?=^##\\s+|\\Z)`,
      'im'
    );

    const match = markdown.match(regex);
    return match ? match[1].trim() : null;
  }

  private calculateSatisfaction(config: DarkFactoryConfig): number {
    const total = config.acceptanceCriteria.length;
    if (total === 0) return 0;

    const checked = config.acceptanceCriteria.filter(item => item.checked).length;
    return checked / total;
  }

  private matchStopCondition(
    config: DarkFactoryConfig,
    ctx: PipelineContext,
    satisfactionScore: number
  ): string | null {
    for (const condition of config.stopConditions) {
      const normalized = condition.trim().toLowerCase();

      if (normalized.startsWith('phase:')) {
        const phase = normalized.replace('phase:', '').trim().toUpperCase();
        if (ctx.phase.toUpperCase() === phase) {
          return `Stop condition reached: ${condition}`;
        }
      }

      if (normalized === 'max_retries' && ctx.retryCount >= ctx.maxRetries) {
        return `Stop condition reached: ${condition}`;
      }

      const scoreMatch = normalized.match(/^satisfaction\s*>=\s*(\d(?:\.\d+)?)$/);
      if (scoreMatch) {
        const threshold = Number(scoreMatch[1]);
        if (satisfactionScore >= threshold) {
          return `Stop condition reached: ${condition}`;
        }
      }
    }

    return null;
  }

  private async tryTransition(events: string[], transitions: string[]): Promise<void> {
    for (const event of events) {
      try {
        const current = this.engine.getCurrentState();
        const available = this.engine.getAvailableTransitions(current);
        if (!available.includes(event)) {
          continue;
        }

        await this.engine.transition(event);
        transitions.push(event);
        return;
      } catch (error) {
        if (error instanceof TransitionGuardError || error instanceof InvalidTransitionError) {
          continue;
        }
        throw error;
      }
    }

    const ctx = this.engine.getCurrentState();
    throw new Error(`No valid transition found for current phase ${ctx.phase}. Tried: ${events.join(', ')}`);
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private isAutonomyLevel(value: string): value is AutonomyLevel {
    return value === 'supervised' || value === 'semi_autonomous' || value === 'autonomous';
  }
}
