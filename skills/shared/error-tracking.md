# Skill: Error Tracking

## Metadata
- **ID:** SKL-SHARED-006
- **Agents:** shared
- **Token Budget:** compact
- **Source:** OthmanAdi/planning-with-files
- **Pillars:** N/A

## Purpose
Structured error logging for cross-agent visibility.

## STOP Rules
- Never log errors without exact file/line references.
- Never use vague descriptions.

## Protocol
1. On error, append to Rejection Log in CONTEXT_STATE.md
2. Use structured format: Category, Files (with line numbers), Error (exact output), Required Fix, Checklist Failures
3. Categories: `TEST_FAILURE`, `SECURITY_VIOLATION`, `UX_VIOLATION`, `PILLAR_CONFLICT`, `PR_SIZE_EXCEEDED`
4. Error context must be self-sufficient - next agent fixes without asking questions
5. Never log vague errors like "tests failed"

## Checklist
- [ ] Error category assigned
- [ ] File paths and line numbers included
- [ ] Exact error output captured
- [ ] Required fix described specifically
- [ ] Self-sufficient for next agent

## Handoff
Error logged in CONTEXT_STATE.md. Assignee reads Rejection Log to fix.
