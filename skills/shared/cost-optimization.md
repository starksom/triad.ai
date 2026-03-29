# Skill: Cost Optimization

## Metadata
- **ID:** SKL-SHARED-011
- **Agents:** shared
- **Token Budget:** standard
- **Maturity:** beta
- **Runtime Scope:** provider tiers + `CostTracker` + `triad cost-report`
- **Pillars:** [P2-13]

## Purpose
Guide provider/strategy usage to control spend while preserving delivery quality.

## STOP Rules
- MUST NOT hide cost data from users
- MUST NOT document deprecated 3-tier taxonomy as runtime fact

## Runtime Protocol (Current)
1. Use provider-configured tiers: `free`, `low`, `medium`, `high`, `premium`.
2. Execute via `triad multi-model`.
3. Track aggregate usage automatically.
4. Report totals by provider/model/tier using `triad cost-report`.

## Checklist
- [ ] Tier terminology matches code (`free|low|medium|high|premium`)
- [ ] Costs are reviewed during validation/consolidation
- [ ] Expensive tiers are intentionally used for high-criticality tasks

## Handoff
Cost report informs manual routing decisions until Smart Router is implemented.
