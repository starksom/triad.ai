# Orchestration Guide - Triad Pipeline

This document explains how you, the Developer/Tech Lead, must orchestrate the interaction between **Claude Code**, **Codex**, and **Antigravity** to ensure a frictionless workflow.

The three agents do not communicate directly. They communicate by reading and writing to the following foundational documents:
- `README.md`
- `docs/roadmap.md`
- `docs/architecture.md`
- `CHANGELOG.md`
- `docs/CONTEXT_STATE.md`
- `docs/AGENTS.md` (append-only decision log)
- `docs/progress.txt` (append-only progress tracker)

To maintain order, strictly follow the flow below, passing the baton from one agent to the next at the precise moment.

---

## Global Skills, Guardrails, and Context State

For maximum efficiency, all agents load skills via `skills/GLOBAL_SKILLS.md` using the priority-tiered system.

**Skill Loading Protocol:**
1. Read `skills/GLOBAL_SKILLS.md` — the skill index
2. Load P0 skills (compact, always loaded) for the agent's role
3. Load P1 skills (standard) when the current task matches a skill domain
4. Load P2 skills (extended) only on explicit demand

**The Transaction Token (The Baton):**
No agent begins work without reading and subsequently updating `docs/CONTEXT_STATE.md`. This file dictates the current phase, assignee, story number, retry count, and rejection log.

**Guardrails:**
- **Claude Code:** Plans only. PO/InfoSec/Architect roles. Does not write code. Does not approve/reject.
- **Codex:** Squad Leader. Only writes code and tests. Does not update docs or decide versioning.
- **Antigravity:** Tech Lead Gatekeeper. Tests locally. Binary decisions: APPROVE or REJECT. No conditions.

---

## Rejection Loop Protocol

When Antigravity rejects Codex's implementation:

1. **Retry < 3:** Antigravity writes structured rejection (category, files, error, fix, checklist failures) to `CONTEXT_STATE.md`, increments retry count, sets Phase to `[DEVELOPMENT]` + Assignee to `Codex`
2. **Retry >= 3:** ESCALATION — Antigravity sets Phase to `[PLANNING]` + Assignee to `Claude Code` for re-architecture
3. Codex reads the rejection log and fixes only the specified issues
4. Cycle repeats until APPROVE or escalation

**Rejection Categories:** `TEST_FAILURE`, `SECURITY_VIOLATION`, `UX_VIOLATION`, `PILLAR_CONFLICT`, `PR_SIZE_EXCEEDED`

---

## Token Budget Table

| Agent | Phase | Budget | Rationale |
|-------|-------|--------|-----------|
| Claude Code | PLANNING | 40K | Requirements + architecture + skill loading |
| Codex | DEVELOPMENT | 100K | Implementation is the largest phase |
| Antigravity | VALIDATION | 30K | Validation should be efficient |
| Antigravity | CONSOLIDATION | 10K | Doc updates are mechanical |
| Claude Code | RELEASE_AUDIT | 20K | High-level review only |

**Total budget per cycle:** ~200K tokens

---

## Strategic Alignment with Master Roadmap

All pipeline phases must consider `TRIAD_MASTER_ROADMAP.md` as the strategic compass.

**How it integrates with daily operations:**
- **Planning (Claude Code):** Cross-references planned features against active pillars. Tags roadmap entries with pillar IDs (e.g., `[P2-04]`).
- **Implementation (Codex):** Avoids patterns that conflict with declared pillars. Follows pillar-aligned abstractions when applicable.
- **Validation (Antigravity):** Flags implementations that contradict active strategic goals. Notes pillar advancement in architecture updates.
- **Release Audit (Claude Code):** Reports which pillars were advanced by the release.

---

## The Lifecycle of a Feature

### Phase 1: Planning (Claude Code - The Product Owner)
1. Open **Claude Code** with `plan_project` from `prompts/claude_code.md`
2. Claude Code generates requirements, populates roadmap, verifies scope security, checks strategic alignment
3. Claude Code sets CONTEXT_STATE.md: Phase → `[DEVELOPMENT]`, Assignee → `Codex`, Story → `1 of N`
4. **Pause:** Proceed to Codex

### Phase 2: Implementation (Codex - The Squad Leader)
1. Open **Codex** with `implement_task` from `prompts/codex.md`
2. Codex reads CONTEXT_STATE.md for task, story number, and any rejection log
3. Codex implements code + tests, following pillar-consistent patterns
4. Codex sets CONTEXT_STATE.md: Phase → `[VALIDATION]`, Assignee → `Antigravity`
5. **Pause:** Call Antigravity

### Phase 3: Validation (Antigravity - The Tech Lead)
1. Run `/triad_feature_cycle Validate the task [Name]`
2. Antigravity executes tests, linters, multi-skill audit
3. **REJECT:** Structured rejection → back to Phase 2 (or Phase 1 if retry >= 3)
4. **APPROVE:** Proceed to Consolidation

### Phase 4: Consolidation (Antigravity - Release Manager)
1. Antigravity updates roadmap, architecture, changelog
2. Story iteration: if more stories, set Phase → `[DEVELOPMENT]` for next story
3. If all stories complete: set Phase → `[RELEASE_AUDIT]`

### Phase 5: Release Audit (Claude Code)
1. Call **Claude Code** with `audit_implementation`
2. Claude evaluates quality, security, pillar advancement
3. Determines semver bump. Returns commit decision to User.

### Phase 6: User Decision
1. User approves (`git commit`) or sends back to Phase 1
2. Final commit authority is exclusively human

---

## Story-Per-Iteration Workflow

Features are decomposed into stories. Each story goes through the full pipeline:
```
Story 1: PLANNING → DEVELOPMENT → VALIDATION → CONSOLIDATION
Story 2: DEVELOPMENT → VALIDATION → CONSOLIDATION
...
Story N: DEVELOPMENT → VALIDATION → CONSOLIDATION → RELEASE_AUDIT
```

The `Story` field in CONTEXT_STATE.md tracks `N of M`. Antigravity increments the story number after each approval. Only the final story triggers the Release Audit.
