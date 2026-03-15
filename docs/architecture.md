# Current Architecture

## Overview
`triad.ai` is a Multi-Agent Orchestration Framework designed to scale software engineering through isolated AI roles interacting via a shared file-based state machine (`CONTEXT_STATE.md`).

## Implemented Functional Requirements
- FR-01 (Orchestration Loop): Seamless handoff between Claude Code, Codex, and Antigravity.
- FR-02 (CLI Integration): The `triad-cli` tool scaffolds and tracks the state of the project. Commands: `init`, `run`, `validate`.

## Main Components
- **Agent Prompts (`prompts/`)**: Strict system instructions constraining each AI to its role (PO, Squad Leader, Tech Lead).
- **Core State Token (`docs/CONTEXT_STATE.md`)**: The volatile memory module coordinating who is acting in the current Phase.
- **Triad CLI (`scripts/triad-cli`)**: A bash utility acting as a helper interface to bootstrap `.agent/` and read the state.

## Relevant Architectural Decisions
- ADR-001: File-based state machine over database/API coordination, justified by portability, zero-dependency setup, and transparency for human review.
- ADR-002: Markdown as the universal data format for all inter-agent communication, justified by version control compatibility, human readability, and LLM native comprehension.
- ADR-003: Single-assignee model (one agent active at a time), justified by preventing race conditions and ensuring deterministic pipeline progression.

## Security and IAM Considerations
- Agents operate under strict role separation: Claude Code cannot write code, Codex cannot modify documentation artifacts, Antigravity gates all merges.
- No hardcoded secrets permitted in any artifact (enforced via GLOBAL_SKILLS.md Section 3).
- Shift-left security: OWASP Top 10 checks (SQL/NoSQL injection, XSS, CSRF, CORS) applied during both implementation (Codex) and validation (Antigravity) phases.
- Final commit authority reserved exclusively for the human user (no automated pushes to main).
