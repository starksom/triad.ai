# Current Architecture

## Overview
`triad.ai` orchestrates Claude Code, Codex, and Antigravity through a file-backed phase engine with explicit transitions and guardrails.

## Implemented Functional Requirements
- FR-01 Orchestration loop with single active assignee.
- FR-02 CLI operations for lifecycle management.
- FR-03 Skill library across `shared`, `claude_code`, `codex`, `antigravity`.
- FR-04 Structured rejection protocol with retry/escalation.
- FR-05 Executable state graph engine.
- FR-06 Node.js CLI + project scaffolder.
- FR-07 Observability (Langfuse + local fallback).
- FR-08 Checkpoints with restore support.
- FR-09 Web dashboard for runtime visibility.

## Capability Maturity Matrix

| Capability | Status | Runtime Evidence |
|---|---|---|
| State graph transitions | stable | `src/state-graph/*`, `triad transition` |
| Checkpointing | stable | `src/checkpoints/*`, `triad checkpoint *` |
| Observability | stable | `src/tracing/*`, `triad trace *` |
| Provider detection/registry | stable | `src/providers/*`, `triad providers*` |
| Multi-model execution | beta | `src/multi-model/*`, `triad multi-model` |
| Cost analytics | beta | `src/multi-model/cost-tracker.ts`, `triad cost-report` |
| Consensus engine | planned | ADR-011 only |
| Smart router | planned | ADR-012 only |
| Dark factory mode | planned | ADR-013 only |

## Main Components
- Agent prompts (`prompts/`) for role constraints.
- Transaction token: `docs/CONTEXT_STATE.md`.
- Skill library (`skills/`).
- Append-only memory: `docs/AGENTS.md`, `docs/progress.txt`.
- Runtime CLI: `src/cli.ts` (with Bash fallback in `scripts/triad-cli`).

## ADR Index
- ADR-001 to ADR-005: foundational workflow and governance decisions.
- ADR-006: state graph engine.
- ADR-007: dual storage strategy (markdown + checkpoints).
- ADR-008: observability strategy.
- ADR-009: npm distribution and Node CLI.
- ADR-010: multi-backend LLM adapter pattern. See `docs/adr/ADR-010-multi-backend-llm-adapter.md`.
- ADR-011: consensus engine (proposed). See `docs/adr/ADR-011-consensus-engine.md`.
- ADR-012: smart router (proposed). See `docs/adr/ADR-012-smart-router.md`.
- ADR-013: dark factory mode (proposed). See `docs/adr/ADR-013-dark-factory-mode.md`.

## Security and IAM Considerations
- Role separation enforced by prompt STOP rules.
- No hardcoded secrets.
- Shift-left security practices via dedicated skills.
- Final commit authority remains human.
