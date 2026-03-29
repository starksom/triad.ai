# ADR-012: Smart Router for Task-to-Provider Mapping

- **Status:** Proposed
- **Date:** 2026-03-29
- **Owners:** Triad Core
- **Related Pillars:** [P2-02], [P2-13]

## Context
Triad currently supports manual strategy selection in `triad multi-model` but does not auto-classify tasks into routing categories.
Teams still choose providers and strategies explicitly.

## Decision
Plan a Smart Router layer that classifies requests (`research`, `design`, `implementation`, `review`) and maps them to provider subsets + execution strategy.
Routing must honor:
- provider availability (`listAvailable()`)
- cost tier policies
- explicit user overrides

## Consequences
### Positive
- Reduces manual orchestration overhead.
- Makes strategy selection more consistent across teams.

### Negative / Trade-offs
- Adds policy complexity and potential misclassification risk.
- Requires telemetry feedback loops to improve routing quality.

## Rollback
If automated routing underperforms:
1. Keep router as “suggest-only” mode.
2. Fall back to explicit CLI strategy flags.
3. Disable automatic routing by default until confidence improves.
