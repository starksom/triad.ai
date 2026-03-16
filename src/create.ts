#!/usr/bin/env node

/**
 * npx create-triad — Interactive scaffolding for Triad Pipeline projects.
 */

import { mkdirSync, writeFileSync, existsSync, copyFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execSync } from 'node:child_process';

// Minimal scaffolding without inquirer dependency at runtime
// (inquirer is available but we keep it simple for the initial version)

const args = process.argv.slice(2);
const projectName = args[0] || 'my-triad-project';
const projectDir = resolve(projectName);

console.log(`\nCreating Triad Pipeline project: ${projectName}\n`);

// Validate environment
try {
  const nodeVersion = process.version.replace('v', '').split('.')[0];
  if (parseInt(nodeVersion) < 18) {
    console.error('Node.js >= 18 is required.');
    process.exit(1);
  }
} catch {
  console.error('Could not detect Node.js version.');
  process.exit(1);
}

// Create directory structure
const dirs = [
  '',
  '.agent/workflows',
  'docs',
  'prompts',
  'skills/shared',
  'skills/claude_code',
  'skills/codex',
  'skills/antigravity',
  'templates',
  '.triad/checkpoints',
  '.triad/traces',
  'src/state-graph',
];

for (const dir of dirs) {
  const fullPath = join(projectDir, dir);
  if (!existsSync(fullPath)) {
    mkdirSync(fullPath, { recursive: true });
  }
}

// Generate CONTEXT_STATE.md
writeFileSync(join(projectDir, 'docs', 'CONTEXT_STATE.md'), `# Context Synchronization Point (Context State)

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

---

## Handoff Message (From previous assignee)
"Project newly initialized. Claude Code must begin the planning phase."

---

## Rejection Log (if applicable)
*(Empty -- no rejections recorded)*

---

## Completion Signal
> INCOMPLETE
`);

// Generate docs/AGENTS.md
writeFileSync(join(projectDir, 'docs', 'AGENTS.md'), `# Agent Decision Log

Append-only log of agent decisions across pipeline phases.
`);

// Generate docs/progress.txt
writeFileSync(join(projectDir, 'docs', 'progress.txt'), '');

// Generate .triad/config.json
writeFileSync(join(projectDir, '.triad', 'config.json'), JSON.stringify({
  version: 1,
  stateGraph: 'src/state-graph/graph.json',
  checkpoints: { backend: 'file', directory: '.triad/checkpoints' },
  tracing: {
    backend: 'auto',
    langfuse: { publicKey: '', secretKey: '', host: 'https://cloud.langfuse.com' },
    localDirectory: '.triad/traces',
  },
  retry: { maxRetries: 3, autoRetry: true, escalateToPlanning: true },
  git: { autoCommit: true, commitPrefix: 'triad:' },
  dashboard: { port: 3000, host: 'localhost' },
}, null, 2) + '\n');

// Generate .gitignore
writeFileSync(join(projectDir, '.gitignore'), `node_modules/
dist/
.triad/checkpoints/
.triad/traces/
.triad/triad.db
.env
.env.*
!.env.example
.DS_Store
*.log
coverage/
`);

// Generate minimal state graph
writeFileSync(join(projectDir, 'src', 'state-graph', 'graph.json'), JSON.stringify({
  $schema: 'triad-state-graph/v1',
  initialState: 'PLANNING',
  states: {
    PLANNING: {
      assignee: 'Claude Code',
      description: 'Define requirements, architecture, stories',
      onEnter: ['resetRetryCount', 'clearRejectionLog'],
      transitions: {
        START_DEVELOPMENT: { target: 'DEVELOPMENT', guards: ['hasStories'], actions: ['saveCheckpoint', 'traceTransition', 'gitCommit'] },
      },
    },
    DEVELOPMENT: {
      assignee: 'Codex',
      description: 'Implement code and tests',
      transitions: {
        SUBMIT_FOR_VALIDATION: { target: 'VALIDATION', guards: [], actions: ['saveCheckpoint', 'traceTransition', 'gitCommit'] },
      },
    },
    VALIDATION: {
      assignee: 'Antigravity',
      description: 'Run tests, linters, audits; binary APPROVE/REJECT',
      transitions: {
        APPROVE: { target: 'CONSOLIDATION', guards: [], actions: ['saveCheckpoint', 'traceTransition', 'gitCommit'] },
        REJECT: { target: 'DEVELOPMENT', guards: ['retryBelowMax'], actions: ['incrementRetry', 'logRejection', 'saveCheckpoint', 'traceTransition', 'gitCommit'] },
        ESCALATE: { target: 'PLANNING', guards: ['retryAtOrAboveMax'], actions: ['logEscalation', 'saveCheckpoint', 'traceTransition', 'gitCommit'] },
      },
    },
    CONSOLIDATION: {
      assignee: 'Antigravity',
      description: 'Update roadmap, architecture, changelog',
      transitions: {
        NEXT_STORY: { target: 'DEVELOPMENT', guards: ['hasRemainingStories'], actions: ['incrementStory', 'resetRetryCount', 'saveCheckpoint', 'traceTransition', 'gitCommit'] },
        ALL_STORIES_COMPLETE: { target: 'RELEASE_AUDIT', guards: ['allStoriesComplete'], actions: ['saveCheckpoint', 'traceTransition', 'gitCommit'] },
      },
    },
    RELEASE_AUDIT: {
      assignee: 'Claude Code',
      description: 'Final quality audit, semver determination',
      transitions: {
        RELEASE_TO_USER: { target: 'USER_DECISION', guards: [], actions: ['saveCheckpoint', 'traceTransition'] },
      },
    },
    USER_DECISION: {
      assignee: 'User',
      description: 'Human commit/reject decision',
      transitions: {
        COMMIT: { target: 'PLANNING', guards: [], actions: ['saveCheckpoint', 'traceTransition'] },
        SEND_BACK: { target: 'PLANNING', guards: [], actions: ['saveCheckpoint', 'traceTransition'] },
      },
    },
  },
}, null, 2) + '\n');

// Generate README
writeFileSync(join(projectDir, 'README.md'), `# ${projectName}

Built with the [Triad Pipeline](https://github.com/starksom/triad.ai) framework.

## Getting Started

\`\`\`bash
npm install create-triad
npx triad status
npx triad transition START_DEVELOPMENT
npx triad dashboard
\`\`\`

## Pipeline Commands

| Command | Description |
|---------|-------------|
| \`triad run\` | Show current pipeline state |
| \`triad status\` | Combined view: state + skills |
| \`triad transition <event>\` | Execute state graph transition |
| \`triad validate\` | Run tests + auto-transition |
| \`triad checkpoint list\` | List checkpoints |
| \`triad checkpoint restore <id>\` | Time-travel restore |
| \`triad dashboard\` | Start web dashboard |
| \`triad skills [agent]\` | List skills per agent |
`);

// Initialize git repo
try {
  if (!existsSync(join(projectDir, '.git'))) {
    execSync('git init', { cwd: projectDir, stdio: 'pipe' });
    console.log('  Initialized git repository');
  }
} catch {
  console.log('  (git init skipped)');
}

console.log(`\nProject created at: ${projectDir}\n`);
console.log('Next steps:');
console.log(`  cd ${projectName}`);
console.log('  npm install create-triad');
console.log('  npx triad status');
console.log('  npx triad dashboard');
console.log('');
