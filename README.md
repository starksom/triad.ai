# triad.ai - Multi-Agent Orchestration Framework

## Objective
triad.ai solves the "AI Context Collapse" problem by enforcing strict role separation, document-based shared memory, and mandatory human control across three AI agents working together on software development.

The framework orchestrates **Claude Code** (Product Owner / Architect), **Codex** (Squad Leader / Implementer), and **Antigravity** (Tech Lead / Gatekeeper) through a file-based state machine that prevents context loss and role overlap.

## Primary Stack
- Runtime: Node.js 18+ (TypeScript)
- Orchestration: Executable state graph engine + CONTEXT_STATE.md
- CLI: Node.js (`triad`) with Bash fallback (`scripts/triad-cli`)
- Observability: Langfuse integration with local JSON fallback
- Dashboard: Express + WebSocket real-time web UI
- Checkpointing: File-based (default) or SQLite with time-travel restore
- Methodology: Planning-with-Files (BMAD/Ralph), Shift-Left Security (Snyk), Web Quality
- Skills: Priority-tiered multi-skill library (P0/P1/P2)

## Key Deliverables
- [x] Strict role separation across 3 AI agents
- [x] File-based shared memory and handoff protocol
- [x] CLI tool for scaffolding, state inspection, and validation
- [x] End-to-end example project (`examples/minimal-project`)
- [x] Setup and orchestration guides for macOS and Windows
- [x] Multi-skill library with 40+ skills across 4 agent directories
- [x] Structured rejection protocol with retry limits and escalation
- [x] Append-only memory files (AGENTS.md, progress.txt)
- [x] Executable state graph engine with guard validation
- [x] Persistent checkpointing with time-travel restore
- [x] Langfuse observability with local JSON fallback
- [x] Real-time web dashboard (`triad dashboard`)
- [x] npm distribution (`npx create-triad`)
- [x] Git-versioned memory (auto-commit on transitions)
- [ ] Phase 2: Remaining competitive parity pillars (see `TRIAD_MASTER_ROADMAP.md`)

## The 5-Phase Pipeline

```
[PLANNING] --> [DEVELOPMENT] --> [VALIDATION] --> [CONSOLIDATION] --> [RELEASE_AUDIT]
 Claude Code       Codex          Antigravity      Antigravity        Claude Code
                     ^                |                                   |
                     |                +--- REJECT (retry<3) -------------+
                     |                |                                   |
                     |                +--- ESCALATE (retry>=3) --> [PLANNING]
                     |                                                    |
                     +----------------------------------------------------+---> USER
```

1. **Planning:** Claude Code defines requirements, updates roadmap and architecture
2. **Implementation:** Codex writes production code and automated tests
3. **Validation:** Antigravity runs tests/linters, approves or rejects (max 3 retries)
4. **Consolidation:** Antigravity updates roadmap, architecture, and changelog
5. **Release Audit:** Claude Code validates semver, returns commit decision to user

## Quick Start

### Option A: npm (recommended)
```bash
# Scaffold a new project
npx create-triad my-project
cd my-project

# Install the framework
npm install create-triad

# Check current state
npx triad status

# Execute a state transition
npx triad transition START_DEVELOPMENT

# Start the dashboard
npx triad dashboard
```

### Option B: Clone + Bash
```bash
git clone https://github.com/YOUR_ORG/triad.ai my-project
cd my-project
bash scripts/triad-cli init
bash scripts/triad-cli run
```

### CLI Commands
| Command | Description |
|---------|-------------|
| `triad run` | Display current pipeline state |
| `triad status` | Combined view: state + roadmap + skills |
| `triad transition <event>` | Execute state graph transition |
| `triad validate` | Run tests and auto-transition |
| `triad reject <cat> <msg>` | Format rejection and trigger REJECT |
| `triad checkpoint list` | List saved checkpoints |
| `triad checkpoint restore <id>` | Time-travel restore |
| `triad dashboard` | Start web dashboard at localhost:3000 |
| `triad skills [agent]` | List skills per agent |
| `triad config [key] [value]` | Get/set configuration |
| `triad trace list` | List observability traces |

For detailed setup instructions, see [FIRST_SETUP.md](FIRST_SETUP.md).
For operational workflow, see [ORCHESTRATION_GUIDE.md](ORCHESTRATION_GUIDE.md).

## Repository Structure
```
triad.ai/
  src/                    TypeScript source (v3.0 engine)
    state-graph/            State graph engine + graph.json definition
    checkpoints/            Checkpoint system (file + sqlite backends)
    tracing/                Langfuse + local trace backends
    dashboard/              Express web dashboard + frontend
    utils/                  Context state parser, config, git, markdown
    __tests__/              Jest unit tests
    cli.ts                  Commander-based CLI
    create.ts               npx create-triad scaffolder
    index.ts                Public API exports
  .agent/workflows/       Antigravity workflow definitions
  docs/                   CONTEXT_STATE.md, roadmap.md, architecture.md, AGENTS.md, progress.txt
  examples/               End-to-end example project
  prompts/                Agent system prompts (Claude, Codex, Antigravity)
  scripts/                triad-cli Bash fallback
  skills/                 Multi-skill library (41+ files)
    shared/                 Cross-agent skills (7 files)
    claude_code/            Claude Code skills (8 files)
    codex/                  Codex skills (9 + 6 language-specific)
    antigravity/            Antigravity skills (11 files)
  .triad/                 Runtime data (gitignored: checkpoints, traces)
  package.json            npm package manifest (create-triad v3.0.0)
  tsconfig.json           TypeScript configuration
```

## Detailed Documentation
- [Master Roadmap](TRIAD_MASTER_ROADMAP.md) - Strategic vision and technical pillars
- [Foundation Spec](TRIAD_FOUNDATION.md) - Core architecture and principles
- [Orchestration Guide](ORCHESTRATION_GUIDE.md) - Daily workflow instructions
- [First Setup](FIRST_SETUP.md) - Installation and onboarding
- [Skill Format](skills/SKILL_FORMAT.md) - How to write skill files
- [Roadmap (Active Backlog)](docs/roadmap.md)
- [Architecture (Implemented State)](docs/architecture.md)
- [Changelog](CHANGELOG.md)
