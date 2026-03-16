# Skill: Refactor & Harden

## Metadata
- **ID:** SKL-CODEX-009
- **Agents:** codex
- **Token Budget:** standard
- **Source:** original
- **Pillars:** P2-PERF, P2-SEC

## Purpose
Perform performance upgrades and security hardening while preserving existing API contracts and backward compatibility.

## STOP Rules
- MUST NOT break existing API contracts or public interfaces.
- MUST NOT refactor without passing test suite before and after.
- MUST NOT validate its own refactoring as complete.
- MUST NOT update docs/roadmap.md or CHANGELOG.md.
- MUST NOT determine versioning.

## Protocol
1. Run existing test suite; confirm all tests pass (baseline).
2. Identify refactoring targets from story or tech debt backlog.
3. Apply refactoring in small, committed increments:
   - Extract method/class for long functions.
   - Replace conditionals with polymorphism where appropriate.
   - Eliminate dead code and unused imports.
4. Preserve all public API signatures; use deprecation annotations if changing.
5. Apply security hardening per SKL-CODEX-007 patterns.
6. Run profiler/benchmarks before and after for performance changes.
7. Run full test suite after each increment; fix regressions immediately.
8. Commit each increment separately with descriptive message.

## Checklist
- [ ] Baseline tests pass before refactoring
- [ ] API contracts preserved
- [ ] Small incremental commits
- [ ] Dead code removed
- [ ] Security hardening applied
- [ ] Performance benchmarked before/after
- [ ] All tests pass after refactoring

## Handoff
Set Phase to `[VALIDATION]` and Assignee to `Antigravity` in CONTEXT_STATE.md.
