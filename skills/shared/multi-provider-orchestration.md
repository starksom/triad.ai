# Skill: Multi-Provider Orchestration

## Metadata
- **ID:** SKL-SHARED-009
- **Agents:** shared
- **Token Budget:** standard
- **Maturity:** beta
- **Runtime Scope:** `src/multi-model/*` + `triad multi-model` + `triad cost-report`
- **Pillars:** [P2-02], [P2-13]

## Purpose
Execute a prompt across multiple detected providers using explicit strategy selection.

## STOP Rules
- MUST NOT use providers outside `ProviderRegistry`
- MUST NOT ignore timeout/failure handling
- MUST NOT assume consensus engine availability

## Runtime Protocol (Current)
1. Confirm provider state with `triad providers` / `triad providers detect`.
2. Run `triad multi-model <prompt>` with `--strategy parallel|sequential|adversarial`.
3. Optionally restrict providers via `--providers` and timeout via `--timeout`.
4. Persist usage for aggregated reporting in `.triad-cost-report.json`.
5. Inspect spend and token totals with `triad cost-report`.

## Checklist
- [ ] Strategy is explicitly selected or defaulted to `parallel`
- [ ] Provider list only includes available ids
- [ ] Partial failures are tolerated and surfaced
- [ ] Cost accounting is persisted

## Handoff
Result winners/errors are returned to caller; no built-in consensus stage is applied yet.
