# Skill: Implementation Protocol

## Metadata
- **ID:** SKL-CODEX-001
- **Agents:** codex
- **Token Budget:** compact
- **Source:** original + Ralph
- **Pillars:** N/A

## Purpose
Core coding workflow for Codex: read the plan, implement one story, self-validate, and hand off to Antigravity.

## STOP Rules
- MUST NOT plan features or define requirements.
- MUST NOT update docs/roadmap.md or CHANGELOG.md.
- MUST NOT determine versioning.
- MUST NOT approve or validate its own work as passing QA.
- MUST NOT implement more than one story per iteration.

## Protocol
1. Read CONTEXT_STATE.md to identify the assigned story and acceptance criteria.
2. Read relevant architecture docs and ADRs referenced in the story.
3. Implement the story in a feature branch named `feat/<story-id>`.
4. Run linter and formatter before committing.
5. Run unit tests locally; fix failures before proceeding.
6. Commit with message format: `feat(<scope>): <summary> [SKL-CODEX-001]`.
7. Update CONTEXT_STATE.md: set Phase to `[VALIDATION]`, Assignee to `Antigravity`.

## Checklist
- [ ] Story read and understood
- [ ] Feature branch created
- [ ] Code implements acceptance criteria
- [ ] Linter and formatter passed
- [ ] Unit tests pass locally
- [ ] Commit message follows convention
- [ ] CONTEXT_STATE.md updated for handoff

## Handoff
Set Phase to `[VALIDATION]` and Assignee to `Antigravity` in CONTEXT_STATE.md.
