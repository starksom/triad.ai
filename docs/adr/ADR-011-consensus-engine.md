# ADR-011: Consensus Engine with Configurable Strategies

- **Status:** Proposed
- **Date:** 2026-03-29
- **Owners:** Triad Core
- **Related Pillar:** [P2-03]

## Context
Multi-provider execution exists in runtime, but Triad does not yet have a first-class consensus module or `triad consensus` command.
Some docs and skills already describe consensus behavior; this ADR formalizes the intended direction and current gap.

## Decision
Define consensus as an optional post-processing stage for multi-model responses, with planned strategies:
- majority vote
- weighted score
- confidence ranking
- adversarial debate

Default target threshold remains 75% agreement for majority-based strategies.
Until implementation lands, validation remains test-driven and single gatekeeper-led.

## Consequences
### Positive
- Preserves architecture direction without pretending runtime completeness.
- Enables progressive rollout without breaking current CLI.

### Negative / Trade-offs
- Capability remains undocumented-as-planned instead of operational.
- Skills and guides must explicitly mark consensus as beta/planned to avoid operator confusion.

## Rollback
If consensus is deprioritized:
1. Keep multi-model execution without consensus stage.
2. Mark ADR as Superseded by a simpler “best-response selection” decision.
3. Remove planned `triad consensus` command from roadmap and guides.
