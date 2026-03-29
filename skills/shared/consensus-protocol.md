# Skill: Consensus Protocol

## Metadata
- **ID:** SKL-SHARED-010
- **Agents:** shared
- **Token Budget:** standard
- **Maturity:** planned
- **Runtime Scope:** documentation-only (no `src/consensus` module yet)
- **Pillars:** [P2-03]

## Purpose
Define target behavior for selecting a single decision from multi-provider outputs once consensus support is implemented.

## STOP Rules
- MUST NOT claim consensus is enforced in current runtime
- MUST NOT block validation waiting for a non-existent consensus command

## Protocol (Planned)
1. Accept `MultiModelResponse` candidates.
2. Apply strategy-specific scoring (majority, weighted, confidence, debate).
3. Return winner, confidence, and dissenting evidence.
4. Escalate to human decision if threshold is not reached.

## Current Fallback
Until implementation exists, use explicit reviewer judgment plus test outcomes.

## Checklist
- [ ] Planned behavior is documented without overstating implementation
- [ ] Runtime flow defines a fallback decision gate

## Handoff
When implemented, output should feed validation/release decisions.
