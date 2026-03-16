---
description: Pipeline Triad - Feature Cycle Implementation
---
This workflow guides Antigravity to coordinate building a feature, from reading the roadmap to updating the changelog. It includes the rejection loop, retry escalation, and story iteration protocols.

# State Machine

```
[PLANNING] --> [DEVELOPMENT] --> [VALIDATION]
                    ^                |
                    |          REJECT (retry<3)
                    +<---------------+
                                     |
                               APPROVE
                                     v
                          [CONSOLIDATION] --> [RELEASE_AUDIT] --> [USER_DECISION]
                                                                        |
                                                                 MERGE or BACK --> [PLANNING]

ESCALATION: retry>=3 --> [PLANNING] (Claude Code re-architects)
```

# Flow Steps

## 1. Context Reading
- Read `docs/CONTEXT_STATE.md` — confirm Phase is `[VALIDATION]`
- Read `skills/GLOBAL_SKILLS.md` — load skill index, then P0 skills
- Read `TRIAD_MASTER_ROADMAP.md` — identify relevant pillars
- Read `docs/roadmap.md` and `docs/architecture.md`
- Read the diff of Codex's code changes
- Note the current **Story** (N of M) and **Retry Count**

## 2. Validation and Gatekeeping
- Execute linters, type checks, and test suites in the terminal
- Run security scans per `skills/antigravity/security-validation.md`
- Verify UX: Light Theme, responsive (21:9, 16:9, 4:3, Mobile Vertical)
- Verify accessibility per `skills/antigravity/accessibility-audit.md`
- Cross-reference implementation against active strategic pillars

## 3. Binary Decision

### If REJECTED:
1. Check **Retry Count** in `docs/CONTEXT_STATE.md`
2. **If retry >= 3: ESCALATE**
   - Set Phase → `[PLANNING]`
   - Set Assignee → `Claude Code`
   - Append to `docs/AGENTS.md`: escalation reason
   - Append to `docs/progress.txt`: `ESCALATED - [reason] - back to Claude Code`
   - Output: *"Escalation: 3 retries exhausted. Returning to Claude Code for re-architecture."*
3. **If retry < 3: REJECT**
   - Increment Retry Count
   - Set Phase → `[DEVELOPMENT]`
   - Set Assignee → `Codex`
   - Write structured rejection in CONTEXT_STATE.md Rejection Log:
     - Category: `TEST_FAILURE | SECURITY_VIOLATION | UX_VIOLATION | PILLAR_CONFLICT | PR_SIZE_EXCEEDED`
     - Files: affected files with line numbers
     - Error: exact error output
     - Required Fix: specific fix instruction
     - Checklist Failures: which items failed
   - Append to `docs/AGENTS.md` and `docs/progress.txt`
   - Output: *"Code Blocked: [category]. Context State updated. Return to Codex."*

### If APPROVED:
1. Proceed to **Artifact Update** (Step 4)

## 4. Artifact Update (Consolidation)
- Remove completed task from `docs/roadmap.md`
- Update `CHANGELOG.md` in `[Unreleased]` section
- Update `docs/architecture.md` — register validated pattern, note pillar advancement
- Update `Roadmap Pillar(s)` in `docs/CONTEXT_STATE.md` if applicable
- Append to `docs/AGENTS.md` and `docs/progress.txt`

## 5. Story Iteration Check
- Read **Story** field: `N of M`
- **If N < M** (more stories remain):
  - Set Phase → `[DEVELOPMENT]`
  - Set Assignee → `Codex`
  - Set Story → `N+1 of M`
  - Set Retry Count → `0`
  - Clear Rejection Log
  - Output: *"Story N complete. Context State updated for story N+1. Open Codex."*
- **If N == M** (all stories complete):
  - Set Phase → `[RELEASE_AUDIT]`
  - Set Assignee → `Claude Code`
  - Output: *"All stories complete. Context State updated. Conduct release audit with Claude Code."*

## 6. Notification and Transition
- Request validation for semantic version bumping (`MAJOR.MINOR.PATCH`)
- Include summary of which strategic pillars were impacted
- Set Completion Signal in CONTEXT_STATE.md:
  - `INCOMPLETE` → stories remain
  - `READY_FOR_RELEASE` → all stories approved, awaiting release audit
  - `RELEASED` → user committed
