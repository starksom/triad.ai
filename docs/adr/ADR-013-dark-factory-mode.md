# ADR-013: Dark Factory Autonomous Execution Mode

- **Status:** Proposed
- **Date:** 2026-03-29
- **Owners:** Triad Core
- **Related Pillar:** [P2-08]

## Context
Triad has a strong phase engine and transition tooling, but no autonomous “dark factory” runner in runtime.
Earlier docs described this capability as if implemented; this ADR records the final target and safety boundaries while keeping status explicit.

## Decision
Define a future dark-factory runner that consumes a markdown specification and orchestrates bounded multi-cycle execution with autonomy levels:
- supervised
- semi-autonomous
- autonomous

Mandatory safety constraints:
- human final commit authority is always preserved
- max cycle limit must be enforced
- stop thresholds (satisfaction/failure) must be configurable

## Consequences
### Positive
- Clarifies a safe autonomy direction compatible with Triad principles.
- Makes future implementation auditable with explicit constraints.

### Negative / Trade-offs
- Increased operational complexity and incident surface when implemented.
- Requires robust rollback and observability before default enablement.

## Rollback
If autonomous mode causes instability:
1. Disable autonomous + semi-autonomous levels behind feature flag.
2. Keep supervised spec parsing only.
3. Route users back to explicit `triad transition` flow until hardening is complete.
