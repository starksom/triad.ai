# triad.ai - Multi-Agent Orchestration Framework

## Objective
triad.ai solves the "AI Context Collapse" problem by enforcing strict role separation, document-based shared memory, and mandatory human control across three AI agents working together on software development.

The framework orchestrates **Claude Code** (Product Owner / Architect), **Codex** (Squad Leader / Implementer), and **Antigravity** (Tech Lead / Gatekeeper) through a file-based state machine that prevents context loss and role overlap.

## Primary Stack
- Runtime: Node.js (example project), framework-agnostic for target projects
- Orchestration: Markdown-based state machine (`CONTEXT_STATE.md`)
- CLI: Bash (`scripts/triad-cli`)
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
- [ ] Phase 2: 19 competitive parity pillars (see `TRIAD_MASTER_ROADMAP.md`)

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
```bash
# Clone the template
git clone https://github.com/YOUR_ORG/triad.ai my-project
cd my-project

# Initialize the pipeline
bash scripts/triad-cli init

# Check current state
bash scripts/triad-cli run

# View master roadmap progress
bash scripts/triad-cli roadmap

# List skills per agent
bash scripts/triad-cli skills
bash scripts/triad-cli skills codex

# Format a structured rejection
bash scripts/triad-cli reject TEST_FAILURE "auth test broken"
```

For detailed setup instructions, see [FIRST_SETUP.md](FIRST_SETUP.md).
For operational workflow, see [ORCHESTRATION_GUIDE.md](ORCHESTRATION_GUIDE.md).

## Repository Structure
```
triad.ai/
  .agent/workflows/     Antigravity workflow definitions
  docs/                 CONTEXT_STATE.md, roadmap.md, architecture.md, AGENTS.md, progress.txt
  examples/             End-to-end example project
  prompts/              Agent system prompts (Claude, Codex, Antigravity)
  scripts/              triad-cli and automation tools
  skills/               Multi-skill library
    GLOBAL_SKILLS.md      Skill index and loading protocol
    SKILL_FORMAT.md       Skill file template specification
    shared/               Cross-agent skills (7 files)
    claude_code/          Claude Code skills (8 files)
    codex/                Codex skills (9 + 6 language-specific)
    antigravity/          Antigravity skills (11 files)
  templates/            README and scaffolding templates for new projects
  CLAUDE.md             Auto-injection instructions for Claude Code
  CHANGELOG.md          Keep a Changelog format (SemVer 2.0.0)
  FIRST_SETUP.md        New user installation guide
  LICENSE               MIT License
  ORCHESTRATION_GUIDE.md  Workflow lifecycle documentation
  TRIAD_FOUNDATION.md   Foundation specification
  TRIAD_MASTER_ROADMAP.md  Strategic roadmap (19 pillars)
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
