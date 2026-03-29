# Orchestration Guide - Triad Pipeline

## Core Flow
The canonical handoff remains:

`PLANNING -> DEVELOPMENT -> VALIDATION -> CONSOLIDATION -> RELEASE_AUDIT`

Primary runtime token is `docs/CONTEXT_STATE.md`.

## Current CLI (Runtime-Synced)

### Core
- `triad run`
- `triad status`
- `triad init`
- `triad transition <event>`
- `triad validate`
- `triad reject <category> <message>`
- `triad roadmap`
- `triad skills [agent]`
- `triad consolidate`
- `triad config [key] [value]`

### Checkpoints
- `triad checkpoint list`
- `triad checkpoint show <id>`
- `triad checkpoint restore <id>`

### Tracing & Dashboard
- `triad trace list`
- `triad trace show <id>`
- `triad dashboard [--port <port>]`

### Multi-Provider (Implemented)
- `triad providers`
- `triad providers detect [id]`
- `triad multi-model <prompt> [--strategy parallel|sequential|adversarial] [--providers <ids>] [--timeout <ms>] [--fallback-partial]`
- `triad cost-report`

## Capability Maturity

| Capability | Status | Operational Guidance |
|---|---|---|
| Providers + detection | stable | Safe for normal use. |
| Multi-model execution | beta | Use with operator review; no consensus gate yet. |
| Cost reporting | beta | Use to track provider spend/tokens. |
| Consensus | planned | Do not rely on `triad consensus` (not implemented). |
| Smart routing | planned | Route manually with CLI flags. |
| Dark factory | planned | Use explicit `triad transition` flow. |

## Important Runtime Notes
- `triad consensus` is **not** implemented.
- `triad dark-factory` is **not** implemented.
- Smart router is **not** implemented; use manual strategy/provider selection.

## Recommended Operator Workflow
1. Detect providers (`triad providers detect`).
2. Run strategy manually (`triad multi-model ...`).
3. Inspect costs (`triad cost-report`).
4. Continue phase transitions with `triad transition ...`.
