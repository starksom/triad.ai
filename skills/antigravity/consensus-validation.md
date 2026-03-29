# Skill: Consensus Validation

## Metadata
- **ID:** SKL-AG-012
- **Agents:** antigravity
- **Token Budget:** standard
- **Maturity:** planned
- **Runtime Scope:** validation policy draft (consensus engine not implemented)
- **Pillars:** [P2-03]

## Purpose
Define future multi-provider validation gates once consensus becomes available.

## STOP Rules
- MUST NOT require consensus for approval in current runtime
- MUST NOT override hard test failures with subjective model votes

## Protocol (Planned)
1. Collect independent provider review outputs.
2. Apply configured consensus strategy and threshold.
3. Produce APPROVE/REJECT recommendation with dissent rationale.

## Current Runtime Fallback
Use deterministic validation: tests + manual Antigravity review + structured rejection protocol.

## Checklist
- [ ] Planned status is explicit
- [ ] Fallback to existing validation is documented

## Handoff
Consensus output will eventually feed transition decisions.
