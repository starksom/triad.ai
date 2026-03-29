# Skill: Dark Factory Planning

## Metadata
- **ID:** SKL-CC-010
- **Agents:** claude_code
- **Token Budget:** extended
- **Maturity:** planned
- **Runtime Scope:** specification guidance only (no `triad dark-factory` command yet)
- **Pillars:** [P2-08]

## Purpose
Define how to write autonomous execution specs in a future-compatible format without implying runtime support today.

## STOP Rules
- MUST NOT run or document `triad dark-factory` as currently available
- MUST NOT bypass human final commit authority

## Protocol (Planned)
1. Draft markdown spec with requirements, constraints, acceptance criteria.
2. Declare intended autonomy level and cycle limits.
3. Define rollback and escalation behavior.

## Current Runtime Equivalent
Execute phases explicitly with `triad transition <event>`.

## Checklist
- [ ] Spec includes status, constraints, and rollback intent
- [ ] Guide references manual transitions as current path

## Handoff
Spec can be stored for future Dark Factory runner adoption.
