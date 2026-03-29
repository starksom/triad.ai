# Current Architecture

## Overview
`triad.ai` is a Multi-Agent Orchestration Framework designed to scale software engineering through isolated AI roles interacting via a shared file-based state machine (`CONTEXT_STATE.md`).

## Implemented Functional Requirements
- FR-01 (Orchestration Loop): Seamless handoff between Claude Code, Codex, and Antigravity.
- FR-02 (CLI Integration): The `triad-cli` tool scaffolds and tracks the state of the project. Commands: `init`, `run`, `validate`, `skills`, `reject`, `consolidate`.
- FR-03 (Multi-Skill Library): Priority-tiered skill system with P0/P1/P2 loading across 4 directories (shared, claude_code, codex, antigravity).
- FR-04 (Rejection Protocol): Structured rejection with retry limits, escalation path, and append-only logging.
- FR-05 (State Graph Engine): Executable JSON graph replacing linear pipelines (`src/state-graph`), enforcing transition guards via ADR-006.
- FR-06 (Advanced CLI & SDK): Node.js Commander CLI (`triad`) with `npx create-triad` scaffolder via ADR-009.
- FR-07 (Observability): Langfuse observability with local JSON fallback mapping pipeline phases to traces/spans via ADR-008.
- FR-08 (Execution Replay & Checkpoints): File and SQLite-backed checkpoint system for time-travel restore and cross-session memory via ADR-007.
- FR-09 (Monitoring Dashboard): Express and WebSocket real-time UI for visualizing state, timeline, and decision logs.

## Main Components
- **Agent Prompts (`prompts/`)**: Strict system instructions constraining each AI to its role (PO, Squad Leader, Tech Lead). Each prompt includes STOP rules, skill loading declarations, and handoff protocols.
- **Core State Token (`docs/CONTEXT_STATE.md`)**: The volatile memory module coordinating who is acting in the current Phase. Includes story tracking, retry count, rejection log, and completion signal.
- **Skill Library (`skills/`)**: Priority-tiered skill files organized by agent (shared, claude_code, codex, antigravity). Format defined in `skills/SKILL_FORMAT.md`.
- **Memory Files**: `docs/AGENTS.md` (append-only decision log) and `docs/progress.txt` (append-only progress tracker).
- **Triad CLI (`scripts/triad-cli`)**: Bash utility for bootstrapping, state inspection, skill listing, rejection formatting, and pattern consolidation.

## Relevant Architectural Decisions
- ADR-001: File-based state machine over database/API coordination, justified by portability, zero-dependency setup, and transparency for human review.
- ADR-002: Markdown as the universal data format for all inter-agent communication, justified by version control compatibility, human readability, and LLM native comprehension.
- ADR-003: Single-assignee model (one agent active at a time), justified by preventing race conditions and ensuring deterministic pipeline progression.
- ADR-004: Multi-skill library with priority-tiered loading. Skills are organized into 4 directories (shared, claude_code, codex, antigravity) with 3 priority tiers (P0 compact <500 tokens always loaded, P1 standard 500-1500 tokens task-matched, P2 extended 1500+ on-demand). Justified by token optimization, role enforcement, and modularity.
- ADR-005: Structured rejection protocol with retry limits. Rejections use mandatory fields (category, files, error, fix, checklist failures). Max 3 retries before escalation to Claude Code for re-architecture. Justified by preventing infinite rejection loops and ensuring actionable feedback.

## Security and IAM Considerations
- Agents operate under strict role separation enforced by STOP rules in each prompt: Claude Code cannot write code, Codex cannot modify documentation artifacts, Antigravity gates all merges.
- No hardcoded secrets permitted in any artifact (enforced via `skills/shared/security-baseline.md`).
- Shift-left security: OWASP Top 10 checks applied during implementation (`skills/codex/secure-coding.md`) and validation (`skills/antigravity/security-validation.md`).
- Final commit authority reserved exclusively for the human user (no automated pushes to main).

## v3.0 Architecture Additions

### New Components
- **State Graph Engine (`src/state-graph/`)**: Executable JSON graph definition replacing informal prose state machine. Guards validate transition preconditions; actions trigger checkpoints, traces, and git commits.
- **Checkpoint System (`src/checkpoints/`)**: Persistent checkpointing with file-based (default) and SQLite (optional) backends. Supports time-travel restore.
- **Tracing Module (`src/tracing/`)**: Langfuse integration for observability with local JSON fallback. Maps pipeline phases to traces and spans.
- **Dashboard (`src/dashboard/`)**: Express + WebSocket web UI with real-time state visualization, timeline, and decision log.
- **Node.js CLI (`src/cli.ts`)**: Commander-based CLI replacing Bash triad-cli (with backward-compatible delegation).
- **Scaffolder (`src/create.ts`)**: `npx create-triad` for project initialization.

### New Architectural Decisions
- ADR-006: State Graph Engine — Replace informal markdown state machine with executable JSON graph definition. Enables programmatic transition validation, guard enforcement, visualization, and checkpoint triggers. Graph definition at `src/state-graph/graph.json`.
- ADR-007: Dual Storage Strategy — Complement CONTEXT_STATE.md (human-readable, agent-compatible) with structured JSON checkpoints (machine-queryable, restorable). CONTEXT_STATE.md remains the inter-agent API contract per ADR-002; checkpoints add time-travel debugging and audit trails.
- ADR-008: Observability with Langfuse — Langfuse selected over LangSmith for MIT licensing, self-hostability, and framework independence. Graceful fallback to local JSON traces when Langfuse keys are absent. Never crashes on tracing failure.
- ADR-009: npm Distribution — Package as installable npm module (`create-triad`) with `npx create-triad` scaffolding. Bin entries: `triad` (CLI) and `create-triad` (scaffolder). Justified by discoverability, version management, and dependency resolution.

## v3.1.0 Architecture Additions (Planned — Octopus-Inspired Multi-Provider Engine)

### New Components
- **Provider Adapter Layer (`src/providers/`)**: Registry-based LLM provider abstraction supporting Anthropic, OpenAI, Google Gemini, Mistral, Ollama, and OpenRouter. Auto-detection scans environment variables and CLI availability. Graceful degradation: system functions with Claude alone; additional providers enhance capabilities progressively.
- **Multi-Model Executor (`src/multi-model/`)**: Execution engine supporting three strategies — parallel (all providers simultaneously for research), sequential (chain outputs for design), and adversarial (providers challenge each other for review). Includes per-provider cost tracking with tier-aware reporting.
- **Consensus Engine (`src/consensus/`)**: Four configurable strategies — Majority Vote, Weighted Score, Confidence Ranking, and Adversarial Debate. Default 75% agreement threshold (inspired by claude-octopus). Optional per-phase, configurable via `CONTEXT_STATE.md` or CLI flags.
- **Smart Router (`src/router/`)**: Task classification engine mapping incoming requests to optimal provider+strategy combinations. Classifies tasks as research/design/implementation/review (mapping to Octopus Probe/Grasp/Tangle/Ink taxonomy). Routes based on availability, cost tier, and historical performance.
- **Agent Engine with Personas (`src/agents/`)**: Formal `Agent` abstraction (`name`, `role`, `model`, `provider`, `instructions`, `skills[]`, `run()`) supporting Generator, Critic, Verifier, and Arbiter types. 11 persona definitions (JSON) mapped to Triad's 3-agent model.
- **Dark Factory Mode (`src/dark-factory/`)**: Autonomous pipeline executor taking markdown specifications as input. Three autonomy levels: supervised (approve each phase), semi-autonomous (intervene on failures only), autonomous (full pipeline without interruption). Human retains final commit authority.

### New Architectural Decisions
- ADR-010: Multi-Backend LLM Adapter Pattern — Registry-based provider abstraction where each provider implements a common `LLMProvider` interface (`name`, `models[]`, `isAvailable()`, `complete()`, `estimateCost()`). Auto-detection checks environment variables (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GOOGLE_API_KEY`, etc.) and CLI availability (`ollama list`). Cost tiers (`premium`, `standard`, `economy`) enable intelligent model selection. Inspired by claude-octopus's zero-config bootstrap and graceful degradation patterns.
- ADR-011: Consensus Engine with Configurable Strategies — Four strategies behind a unified `ConsensusEngine`: Majority Vote (simple agreement), Weighted Score (trust-based provider weighting), Confidence Ranking (self-reported confidence), Adversarial Debate (multi-round convergence). Default threshold: 75% agreement, derived from claude-octopus's quality gate. Consensus is optional and phase-configurable, not mandatory for all operations.
- ADR-012: Smart Router for Task-to-Provider Mapping — Classify tasks into categories (research, design, implementation, review) and route to optimal provider combinations. Maps to claude-octopus's Probe/Grasp/Tangle/Ink taxonomy while preserving Triad's 3-agent model. Routing decisions consider provider availability, cost tier, and historical performance scores.
- ADR-013: Dark Factory Autonomous Execution Mode — Enable end-to-end autonomous pipeline execution from a markdown specification. Three autonomy levels (supervised, semi-autonomous, autonomous) with satisfaction scoring and holdout testing. Human retains final commit authority per ADR-001 and Triad's core principle of mandatory human control. Prevents runaway execution via cycle limits and satisfaction thresholds.
