# Current Architecture

## Overview
`triad.ai` is a Multi-Agent Orchestration Framework designed to scale software engineering through isolated AI roles interacting via a shared file-based state machine (`CONTEXT_STATE.md`).

## Implemented Functional Requirements
- FR-01 (Orchestration Loop): Seamless handoff between Claude Code, Codex, and Antigravity.
- FR-02 (CLI Integration): The `triad-cli` tool scaffolds and tracks the state of the project. Commands: `init`, `run`, `validate`, `skills`, `reject`, `consolidate`.
- FR-03 (Multi-Skill Library): Priority-tiered skill system with P0/P1/P2 loading across 4 directories (shared, claude_code, codex, antigravity).
- FR-04 (Rejection Protocol): Structured rejection with retry limits, escalation path, and append-only logging.

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
