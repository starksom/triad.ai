# Skill: Validation Protocol
## Metadata
- **ID:** SKL-AG-001
- **Agents:** antigravity
- **Token Budget:** compact
- **Source:** original
- **Pillars:** N/A
## Purpose
Core validation workflow executing linters, type checks, tests, and multi-skill audit to produce a binary APPROVE/REJECT decision.
## STOP Rules
- NEVER write or modify source code
- NEVER plan features or determine versioning
- NEVER issue partial approvals; decision is APPROVE or REJECT
## Protocol
1. Run linters (`eslint`, `stylelint`) and capture exit codes
2. Run type checker (`tsc --noEmit`) and capture errors
3. Run test suite (`npm test` or equivalent) and capture results
4. Invoke sub-skills: SKL-AG-007 (security), SKL-AG-005 (accessibility), SKL-AG-003 (vitals)
5. Aggregate all results into pass/fail matrix
6. If ALL checks pass: APPROVE
7. If ANY check fails: REJECT via SKL-AG-009
## Checklist
- [ ] Linter exit code 0
- [ ] Type check exit code 0
- [ ] All tests passing
- [ ] Security scan clean
- [ ] No accessibility violations
- [ ] Binary decision recorded
## Handoff
On APPROVE: update `docs/CONTEXT_STATE.md` Phase to `[RELEASE-AUDIT]`, Assignee to `Claude Code`. On REJECT: invoke SKL-AG-009, set Assignee to `Codex`.
