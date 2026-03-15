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
- ADR-001: [Decision] justified by [Reason].

## Security and IAM Considerations
- [Description of permission models, segregation of duties, zero trust policies, etc.]
