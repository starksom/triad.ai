# Triad.ai - Foundation Specification

## 1. Project Vision (The "Why")
**triad.ai** is a **Multi-Agent Orchestration Framework** designed for developers who want to scale software engineering through isolated AI roles.

The project solves the "AI Context Collapse" problem by enforcing:
1. **Strict Role Separation** (Claude plans, Codex implements, Antigravity validates).
2. **Document-Based Shared Memory** (The `CONTEXT_STATE.md` token).
3. **Mandatory Human Control** (Final commit approval).

## 2. Core Principles

### Role Isolation
Each agent operates within strict boundaries defined in `prompts/`. No agent may perform actions assigned to another agent. This prevents context confusion and ensures accountability.

### File-Based Communication
Agents do not communicate directly. All inter-agent communication happens through shared markdown files (`CONTEXT_STATE.md`, `roadmap.md`, `architecture.md`, `CHANGELOG.md`). This ensures transparency and version control compatibility.

### Strategic Alignment
All work must align with the `TRIAD_MASTER_ROADMAP.md`, which defines 19 Phase 2 pillars for competitive parity and Phase 3 strategic differentiation goals. Agents read this file as part of their mandatory initialization sequence.

## 3. The 5-Phase Pipeline
Every feature travels through this state machine:
```mermaid
graph TD;
    A[Phase 1: Planning] -->|Claude| B[Phase 2: Implementation];
    B -->|Codex| C[Phase 3: Validation];
    C -->|Antigravity| D[Phase 4: Consolidation];
    D -->|Antigravity| E[Phase 5: Human Approval];
    C -.->|Rejection/Feedback| B;
```

For detailed lifecycle documentation, see [ORCHESTRATION_GUIDE.md](ORCHESTRATION_GUIDE.md).

## 4. The Triad CLI (Command Line Interface)
The CLI tool at `scripts/triad-cli` provides the following commands:

| Command | Description |
|---------|-------------|
| `triad init` | Scaffolds `.agent/`, `docs/`, `prompts/`, `skills/`, and `templates/` directories |
| `triad run` | Reads `CONTEXT_STATE.md` and outputs current phase and assignee |
| `triad validate` | Triggers local linters and test suites (verifies VALIDATION phase) |
| `triad roadmap` | Displays Master Roadmap pillar status |
| `triad status` | Combined view of pipeline state and roadmap progress |
| `triad --help` | Displays help information |
| `triad --version` | Displays CLI version |

## 5. Required Example (`examples/minimal-project`)
A fully working example (Node.js/Express) is provided to demonstrate:
- Pre-filled `roadmap.md` with tasks.
- A functional `architecture.md`.
- A failing test to demonstrate Antigravity's rejection loop to Codex.
- The `Roadmap Pillar(s)` field in `CONTEXT_STATE.md`.

---

> **Note for Contributors:** The Foundation phase DOES NOT include UI dashboards, advanced persistent memory databases, or multi-LLM routing backends. Those belong to Phase 2 (see `TRIAD_MASTER_ROADMAP.md`).
