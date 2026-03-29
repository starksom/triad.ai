#!/usr/bin/env node

/**
 * Triad Pipeline CLI — Node.js replacement for scripts/triad-cli.
 *
 * Usage: triad <command> [options]
 */

import { Command } from 'commander';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execSync } from 'node:child_process';

import { StateGraphEngine, TransitionGuardError, InvalidTransitionError } from './state-graph/engine.js';
import { parseContextState } from './utils/context-state.js';
import { loadConfig, saveConfig, getConfigValue, setConfigValue, redactSecrets } from './utils/config.js';
import { FileCheckpointBackend } from './checkpoints/file-backend.js';
import { CheckpointManager } from './checkpoints/manager.js';
import { TraceManager } from './tracing/index.js';
import { autoCommit, getCurrentSha } from './utils/git.js';
import { parseProgressLog, parseAgentsLog, appendProgressEntry } from './utils/markdown.js';
import type { ActionPayload } from './state-graph/transitions.js';
import type { TransitionResult } from './state-graph/types.js';
import { detect as detectProviders, listAvailable } from './providers/registry.js';
import {
  majorityVote,
  weightedScore,
  confidenceRanking,
  adversarialDebate,
} from './consensus/engine.js';
import type { ConsensusResponse } from './consensus/types.js';
import { MultiModelEngine } from './multi-model/engine.js';
import { CostTracker, type CostReport } from './multi-model/cost-tracker.js';
import type { ExecutionStrategy } from './multi-model/types.js';

const ROOT = resolve('.');
const CONTEXT_STATE_PATH = join(ROOT, 'docs', 'CONTEXT_STATE.md');
const GRAPH_PATH = join(ROOT, 'src', 'state-graph', 'graph.json');
const PROGRESS_PATH = join(ROOT, 'docs', 'progress.txt');
const AGENTS_PATH = join(ROOT, 'docs', 'AGENTS.md');
const COST_REPORT_PATH = join(ROOT, '.triad-cost-report.json');

const program = new Command();

function loadCostTracker(): CostTracker {
  if (!existsSync(COST_REPORT_PATH)) {
    return new CostTracker();
  }

  const raw = JSON.parse(readFileSync(COST_REPORT_PATH, 'utf-8')) as CostReport;
  return CostTracker.fromReport(raw);
}

function saveCostTracker(tracker: CostTracker): void {
  writeFileSync(COST_REPORT_PATH, JSON.stringify(tracker.getReport(), null, 2), 'utf-8');
}

program
  .name('triad')
  .version('3.0.0')
  .description('Triad Pipeline CLI — Multi-agent orchestration framework');

// ─── triad run ────────────────────────────────────────────────────────────────
program
  .command('run')
  .description('Display current pipeline state')
  .action(() => {
    if (!existsSync(CONTEXT_STATE_PATH)) {
      console.error('No CONTEXT_STATE.md found. Run "triad init" first.');
      process.exit(1);
    }
    const ctx = parseContextState(CONTEXT_STATE_PATH);
    console.log(`Phase:    [${ctx.phase}]`);
    console.log(`Task:     ${ctx.task}`);
    console.log(`Story:    ${ctx.story.current} of ${ctx.story.total}`);
    console.log(`Assignee: ${ctx.assignee}`);
    console.log(`Retry:    ${ctx.retryCount}/${ctx.maxRetries}`);
    console.log(`Signal:   ${ctx.completionSignal}`);
    if (ctx.rejectionLog.length > 0) {
      console.log(`Rejects:  ${ctx.rejectionLog.length}`);
    }
  });

// ─── triad status ─────────────────────────────────────────────────────────────
program
  .command('status')
  .description('Combined view: state + roadmap + skills')
  .action(() => {
    // State
    if (existsSync(CONTEXT_STATE_PATH)) {
      const ctx = parseContextState(CONTEXT_STATE_PATH);
      console.log('=== Pipeline State ===');
      console.log(`  Phase: [${ctx.phase}] | Assignee: ${ctx.assignee} | Story: ${ctx.story.current}/${ctx.story.total}`);
      console.log(`  Task: ${ctx.task}`);
      console.log(`  Retry: ${ctx.retryCount}/${ctx.maxRetries} | Signal: ${ctx.completionSignal}`);
    }

    // Skills summary
    const skillsDir = join(ROOT, 'skills');
    if (existsSync(skillsDir)) {
      console.log('\n=== Skills ===');
      for (const agent of ['shared', 'claude_code', 'codex', 'antigravity']) {
        const dir = join(skillsDir, agent);
        if (existsSync(dir)) {
          const count = readdirSync(dir).filter(f => f.endsWith('.md')).length;
          console.log(`  ${agent}: ${count} skills`);
        }
      }
    }

    // Roadmap
    const roadmapPath = join(ROOT, 'TRIAD_MASTER_ROADMAP.md');
    if (existsSync(roadmapPath)) {
      console.log('\n=== Roadmap ===');
      const content = readFileSync(roadmapPath, 'utf-8');
      const pillars = content.match(/\[P\d+-\d+\]/g);
      if (pillars) {
        console.log(`  ${pillars.length} pillars defined`);
      }
    }
  });

// ─── triad transition ─────────────────────────────────────────────────────────
program
  .command('transition <event>')
  .description('Execute a state graph transition')
  .option('--no-commit', 'Skip git commit')
  .option('--category <category>', 'Rejection category')
  .option('--error <error>', 'Rejection error message')
  .option('--fix <fix>', 'Required fix description')
  .option('--files <files>', 'Affected files')
  .action(async (event: string, options: Record<string, string | boolean>) => {
    const config = loadConfig(ROOT);
    const checkpointBackend = new FileCheckpointBackend(
      join(ROOT, config.checkpoints.directory)
    );
    const checkpointManager = new CheckpointManager(checkpointBackend, CONTEXT_STATE_PATH);
    const traceManager = new TraceManager(config);

    const payload: ActionPayload = {};
    if (options['category']) payload.rejectionCategory = options['category'] as ActionPayload['rejectionCategory'];
    if (options['error']) payload.rejectionError = options['error'] as string;
    if (options['fix']) payload.rejectionFix = options['fix'] as string;
    if (options['files']) payload.rejectionFiles = options['files'] as string;

    const engine = new StateGraphEngine(GRAPH_PATH, CONTEXT_STATE_PATH, {
      onCheckpoint: (result: TransitionResult) => {
        checkpointManager.save(
          { from: result.from, to: result.to, event: result.event, agent: result.agent },
          result.context,
          { gitSha: getCurrentSha() }
        );
      },
      onTrace: (result: TransitionResult) => {
        const traces = traceManager.listTraces();
        const activeTrace = traces.find(t => !t.endTime) ?? traceManager.startTrace(`Pipeline: ${result.context.task}`);
        traceManager.startSpan(activeTrace.traceId, result.to, result.agent, {
          decision: `${result.from} -> ${result.to} via ${result.event}`,
        });
      },
      onGitCommit: (result: TransitionResult) => {
        if (options['commit'] !== false && config.git.autoCommit) {
          autoCommit({
            message: `[${result.from}] -> [${result.to}] | Story ${result.context.story.current}/${result.context.story.total} | ${result.agent}`,
            prefix: config.git.commitPrefix,
          });
        }
      },
    });

    try {
      const result = await engine.transition(event, payload);
      const timestamp = new Date().toISOString().split('T')[0];
      appendProgressEntry(PROGRESS_PATH, {
        timestamp,
        phase: result.to,
        action: `${result.from} -> ${result.to} via ${event}`,
        agent: result.agent,
      });
      console.log(`triad: [${result.from}] -> [${result.to}] | Story ${result.context.story.current}/${result.context.story.total} | ${result.agent}`);
    } catch (err) {
      if (err instanceof TransitionGuardError) {
        console.error(`Guard failed: ${err.message}`);
      } else if (err instanceof InvalidTransitionError) {
        console.error(`Invalid transition: ${err.message}`);
      } else {
        console.error(`Error: ${(err as Error).message}`);
      }
      process.exit(1);
    }
  });

// ─── triad validate ───────────────────────────────────────────────────────────
program
  .command('validate')
  .description('Run validation and auto-transition based on result')
  .option('--test-cmd <cmd>', 'Test command to run', 'npm test')
  .action(async (options: { testCmd: string }) => {
    const ctx = parseContextState(CONTEXT_STATE_PATH);
    console.log(`Running validation: ${options.testCmd}`);

    try {
      execSync(options.testCmd, { stdio: 'inherit', cwd: ROOT });
      console.log('Validation PASSED');

      // Execute APPROVE transition
      execSync(`node ${join(ROOT, 'dist', 'cli.js')} transition APPROVE`, {
        stdio: 'inherit',
        cwd: ROOT,
      });
    } catch {
      console.log('Validation FAILED');
      if (ctx.retryCount < ctx.maxRetries) {
        console.log(`Retry ${ctx.retryCount + 1}/${ctx.maxRetries} — returning to DEVELOPMENT`);
        execSync(
          `node ${join(ROOT, 'dist', 'cli.js')} transition REJECT --category TEST_FAILURE --error "Validation failed"`,
          { stdio: 'inherit', cwd: ROOT }
        );
      } else {
        console.log(`Max retries reached — escalating to PLANNING`);
        execSync(
          `node ${join(ROOT, 'dist', 'cli.js')} transition ESCALATE`,
          { stdio: 'inherit', cwd: ROOT }
        );
      }
    }
  });

// ─── triad reject ─────────────────────────────────────────────────────────────
program
  .command('reject <category> <message>')
  .description('Format structured rejection and execute REJECT transition')
  .option('--files <files>', 'Affected files')
  .action(async (category: string, message: string, options: { files?: string }) => {
    try {
      execSync(
        `node ${join(ROOT, 'dist', 'cli.js')} transition REJECT --category ${category} --error "${message}" ${options.files ? `--files "${options.files}"` : ''}`,
        { stdio: 'inherit', cwd: ROOT }
      );
    } catch {
      process.exit(1);
    }
  });

// ─── triad checkpoint ─────────────────────────────────────────────────────────
const checkpoint = program
  .command('checkpoint')
  .description('Checkpoint management');

checkpoint
  .command('list')
  .description('List checkpoints')
  .option('--limit <n>', 'Limit results', '10')
  .action((options: { limit: string }) => {
    const config = loadConfig(ROOT);
    const backend = new FileCheckpointBackend(join(ROOT, config.checkpoints.directory));
    const manager = new CheckpointManager(backend, CONTEXT_STATE_PATH);
    const checkpoints = manager.list({ limit: parseInt(options.limit, 10) });

    if (checkpoints.length === 0) {
      console.log('No checkpoints found.');
      return;
    }

    for (const chk of checkpoints) {
      const ts = chk.timestamp.split('T')[0];
      console.log(`  ${chk.id}  ${ts}  [${chk.transition.from}] -> [${chk.transition.to}]  ${chk.transition.agent}`);
    }
  });

checkpoint
  .command('show <id>')
  .description('Show checkpoint details')
  .action((id: string) => {
    const config = loadConfig(ROOT);
    const backend = new FileCheckpointBackend(join(ROOT, config.checkpoints.directory));
    const chk = backend.get(id);

    if (!chk) {
      console.error(`Checkpoint not found: ${id}`);
      process.exit(1);
    }

    console.log(JSON.stringify(chk, null, 2));
  });

checkpoint
  .command('restore <id>')
  .description('Restore a checkpoint (time travel)')
  .action((id: string) => {
    const config = loadConfig(ROOT);
    const backend = new FileCheckpointBackend(join(ROOT, config.checkpoints.directory));
    const manager = new CheckpointManager(backend, CONTEXT_STATE_PATH);

    try {
      const ctx = manager.restore(id);
      console.log(`Restored to: [${ctx.phase}] | Story ${ctx.story.current}/${ctx.story.total} | ${ctx.assignee}`);
    } catch (err) {
      console.error((err as Error).message);
      process.exit(1);
    }
  });

// ─── triad skills ─────────────────────────────────────────────────────────────
program
  .command('skills [agent]')
  .description('List skills per agent')
  .action((agent?: string) => {
    const skillsDir = join(ROOT, 'skills');
    const agents = agent ? [agent] : ['shared', 'claude_code', 'codex', 'antigravity'];

    for (const a of agents) {
      const dir = join(skillsDir, a);
      if (!existsSync(dir)) {
        console.log(`  ${a}: (not found)`);
        continue;
      }

      const files = readdirSync(dir).filter(f => f.endsWith('.md'));
      console.log(`\n  ${a} (${files.length} skills):`);
      for (const f of files) {
        console.log(`    - ${f.replace('.md', '')}`);
      }
    }
  });

// ─── triad roadmap ────────────────────────────────────────────────────────────
program
  .command('roadmap')
  .description('Display Master Roadmap pillar status')
  .action(() => {
    const roadmapPath = join(ROOT, 'TRIAD_MASTER_ROADMAP.md');
    if (!existsSync(roadmapPath)) {
      console.error('TRIAD_MASTER_ROADMAP.md not found.');
      process.exit(1);
    }
    const content = readFileSync(roadmapPath, 'utf-8');
    const lines = content.split('\n');
    for (const line of lines) {
      if (line.match(/^\s*\d+\.\s/) || line.match(/^##/)) {
        console.log(line);
      }
    }
  });

// ─── triad consolidate ───────────────────────────────────────────────────────
program
  .command('consolidate')
  .description('Review AGENTS.md for patterns worth promoting to skills')
  .action(() => {
    const entries = parseAgentsLog(AGENTS_PATH);
    if (entries.length === 0) {
      console.log('No agent decisions recorded yet.');
      return;
    }

    console.log(`\n=== ${entries.length} Agent Decisions ===\n`);
    for (const entry of entries) {
      console.log(`  [${entry.timestamp}] ${entry.agent} (${entry.phase})`);
      console.log(`    Decided: ${entry.decided}`);
      if (entry.pillar) console.log(`    Pillar: ${entry.pillar}`);
      console.log('');
    }
  });

// ─── triad config ─────────────────────────────────────────────────────────────
program
  .command('config [key] [value]')
  .description('Get or set configuration values')
  .action((key?: string, value?: string) => {
    let config = loadConfig(ROOT);

    if (!key) {
      console.log(JSON.stringify(redactSecrets(config), null, 2));
      return;
    }

    if (!value) {
      const val = getConfigValue(config, key);
      console.log(typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val));
      return;
    }

    // Parse value
    let parsed: unknown = value;
    if (value === 'true') parsed = true;
    else if (value === 'false') parsed = false;
    else if (!isNaN(Number(value))) parsed = Number(value);

    config = setConfigValue(config, key, parsed);
    saveConfig(ROOT, config);
    console.log(`Set ${key} = ${value}`);
  });

// ─── triad trace ──────────────────────────────────────────────────────────────
const trace = program
  .command('trace')
  .description('Trace management');

trace
  .command('list')
  .description('List traces')
  .action(() => {
    const config = loadConfig(ROOT);
    const manager = new TraceManager(config);
    const traces = manager.listTraces();

    if (traces.length === 0) {
      console.log('No traces found.');
      return;
    }

    for (const t of traces) {
      const status = t.endTime ? 'completed' : 'active';
      console.log(`  ${t.traceId}  ${t.name}  [${status}]  ${t.spans.length} spans`);
    }
  });

trace
  .command('show <id>')
  .description('Show trace details')
  .action((id: string) => {
    const config = loadConfig(ROOT);
    const manager = new TraceManager(config);
    const t = manager.getTrace(id);

    if (!t) {
      console.error(`Trace not found: ${id}`);
      process.exit(1);
    }

    console.log(JSON.stringify(t, null, 2));
  });

// ─── triad dashboard ──────────────────────────────────────────────────────────
program
  .command('dashboard')
  .description('Start the web dashboard')
  .option('--port <port>', 'Port number')
  .action(async (options: { port?: string }) => {
    const config = loadConfig(ROOT);
    const port = options.port ? parseInt(options.port, 10) : config.dashboard.port;

    const { startDashboard } = await import('./dashboard/server.js');
    startDashboard(ROOT, port);
  });

// ─── triad providers ──────────────────────────────────────────────────────────
const providers = program
  .command('providers')
  .description('List provider availability');

providers
  .action(() => {
    const available = listAvailable();
    if (available.length === 0) {
      console.log('No providers are currently available.');
      return;
    }

    console.log('Available providers:');
    for (const provider of available) {
      console.log(`  - ${provider.config.displayName} (${provider.config.id})`);
    }
  });

providers
  .command('detect [id]')
  .description('Detect provider availability (all providers or one by id)')
  .action((id?: string) => {
    try {
      const result = detectProviders(id);
      const detections = Array.isArray(result) ? result : [result];

      for (const detection of detections) {
        const status = detection.available ? 'available' : 'unavailable';
        const reason = detection.reason ? ` | ${detection.reason}` : '';
        console.log(
          `${detection.displayName} (${detection.id}): ${status} | cost=${detection.costTier}${reason}`
        );
      }
    } catch (error) {
      console.error((error as Error).message);
      process.exit(1);
    }
  });

// ─── triad consensus ──────────────────────────────────────────────────────────
program
  .command('consensus <prompt>')
  .description('Run consensus engine on candidate responses separated by "||"')
  .option('--strategy <strategy>', 'Consensus strategy override')
  .option('--threshold <threshold>', 'Consensus threshold override')
  .action((prompt: string, options: { strategy?: string; threshold?: string }) => {
    const ctx = parseContextState(CONTEXT_STATE_PATH);
    const defaults = ctx.consensusConfig;
    const strategy = (options.strategy ?? defaults?.strategy ?? 'majority_vote') as NonNullable<typeof defaults>['strategy'];
    const threshold = options.threshold ? parseFloat(options.threshold) : (defaults?.threshold ?? 0.75);

    const parts = prompt.split('||').map(part => part.trim()).filter(Boolean);
    if (parts.length < 2) {
      console.error('Provide at least two candidate responses separated by "||".');
      process.exit(1);
    }

    const responses: ConsensusResponse[] = parts.map((content, idx) => ({
      id: `candidate_${idx + 1}`,
      content,
      provider: `provider_${idx + 1}`,
      confidence: 0.7,
    }));

    const config = {
      threshold,
      maxRounds: defaults?.maxRounds,
      minAgreementDelta: defaults?.minAgreementDelta,
    };

    const result = strategy === 'weighted_score'
      ? weightedScore(responses, config)
      : strategy === 'confidence_ranking'
        ? confidenceRanking(responses, config)
        : strategy === 'adversarial_debate'
          ? adversarialDebate(responses, config)
          : majorityVote(responses, config);

    console.log(`Strategy: ${result.strategy}`);
    console.log(`Winner: ${result.winner?.id ?? 'none'}`);
    console.log(`Confidence: ${result.confidence.toFixed(3)}`);
    console.log(`Converged: ${result.converged ? 'yes' : 'no'} in ${result.rounds} round(s)`);
    console.log(`Reasoning: ${result.reasoning}`);
    console.log('Vote tally:');
    for (const [candidate, score] of Object.entries(result.voteTally)) {
      console.log(`  - ${candidate}: ${score.toFixed(3)}`);
// ─── triad multi-model ───────────────────────────────────────────────────────
program
  .command('multi-model <prompt>')
  .description('Execute a prompt across multiple providers')
  .option('--strategy <strategy>', 'parallel | sequential | adversarial', 'parallel')
  .option('--providers <ids>', 'Comma-separated provider ids to use')
  .option('--timeout <ms>', 'Timeout in milliseconds', '30000')
  .option('--fallback-partial', 'In sequential mode, continue after first success')
  .action(async (prompt: string, options: { strategy: ExecutionStrategy; providers?: string; timeout: string; fallbackPartial?: boolean }) => {
    const strategy = options.strategy;
    if (!['parallel', 'sequential', 'adversarial'].includes(strategy)) {
      console.error(`Invalid strategy: ${strategy}`);
      process.exit(1);
    }

    const providerIds = options.providers
      ? options.providers.split(',').map((id) => id.trim()).filter(Boolean)
      : undefined;

    const engine = new MultiModelEngine(async ({ providerId, prompt: providerPrompt }) => {
      const provider = listAvailable().find((candidate) => candidate.config.id === providerId);
      if (!provider) {
        throw new Error(`Provider ${providerId} is not available`);
      }

      const response = `(${provider.config.displayName}) ${providerPrompt}`;
      return {
        model: `${providerId}-default`,
        content: response,
        inputTokens: Math.ceil(providerPrompt.length / 4),
        outputTokens: Math.ceil(response.length / 4),
        costUsd: provider.config.costTier === 'free' ? 0 : Number((response.length * 0.00001).toFixed(6)),
      };
    });

    try {
      const result =
        strategy === 'parallel'
          ? await engine.executeParallel({
              prompt,
              strategy,
              providerIds,
              timeoutMs: parseInt(options.timeout, 10),
              fallbackPartial: options.fallbackPartial,
            })
          : strategy === 'sequential'
            ? await engine.executeSequential({
                prompt,
                strategy,
                providerIds,
                timeoutMs: parseInt(options.timeout, 10),
                fallbackPartial: options.fallbackPartial,
              })
            : await engine.executeAdversarial({
                prompt,
                strategy,
                providerIds,
                timeoutMs: parseInt(options.timeout, 10),
                fallbackPartial: options.fallbackPartial,
              });

      const tracker = loadCostTracker();
      tracker.addResponse(result);
      saveCostTracker(tracker);

      console.log(`Strategy: ${result.strategy}`);
      console.log(`Duration: ${result.durationMs}ms`);
      if (result.errors.length > 0) {
        console.log(`Errors: ${result.errors.length}`);
      }
      for (const winner of result.winners) {
        console.log(`Winner: ${winner.providerName} (${winner.providerId})`);
        console.log(`  ${winner.content}`);
      }
    } catch (error) {
      console.error((error as Error).message);
      process.exit(1);
    }
  });

// ─── triad cost-report ───────────────────────────────────────────────────────
program
  .command('cost-report')
  .description('Display aggregated provider/model/tier costs')
  .action(() => {
    const tracker = loadCostTracker();
    const report = tracker.getReport();

    if (report.byProviderModelTier.length === 0) {
      console.log('No cost data recorded yet. Run "triad multi-model <prompt>" first.');
      return;
    }

    console.log(`Generated: ${report.generatedAt}`);
    console.log(`Total requests: ${report.totals.requests}`);
    console.log(`Total cost (USD): ${report.totals.totalCostUsd.toFixed(6)}`);
    console.log('');

    for (const row of report.byProviderModelTier) {
      console.log(
        `${row.providerId} | ${row.model} | ${row.tier} | requests=${row.requests} | tokens=${row.totalTokens} | cost=$${row.totalCostUsd.toFixed(6)}`
      );
    }
  });

// ─── triad init ───────────────────────────────────────────────────────────────
program
  .command('init')
  .description('Initialize Triad Pipeline in current directory')
  .action(() => {
    console.log('Use "npx create-triad" for full interactive scaffolding.');
    console.log('Or run the Bash CLI: bash scripts/triad-cli init');
  });

program.parse();
