# Skill: Cost Optimization

## Metadata
- **ID:** SKL-SHARED-011
- **Agents:** shared
- **Token Budget:** standard
- **Source:** claude-octopus (adapted)
- **Pillars:** [P2-13]

## Purpose
Define cost-tiered model selection rules to optimize LLM spending across the pipeline. Route tasks to the most cost-effective provider tier that meets quality requirements.

## STOP Rules
- MUST NOT select economy tier for security-critical or architecture decisions
- MUST NOT exceed per-cycle budget without user approval
- MUST NOT hide cost information from the user

## Protocol
1. Classify task by required quality level:
   - **Premium**: Architecture decisions, security audits, release reviews, consensus arbitration
   - **Standard**: Feature implementation, test writing, routine validation, research
   - **Economy**: Draft generation, bulk formatting, documentation scaffolding, code linting
2. Select provider and model from the appropriate cost tier
3. If preferred tier is unavailable, fall back to next available tier (prefer up, not down)
4. Track cumulative cost via `CostTracker`
5. Report cost summary via `triad cost-report`

## Checklist
- [ ] Task classified to correct quality tier
- [ ] Provider selected from appropriate cost tier
- [ ] Fallback to higher tier (not lower) when preferred unavailable
- [ ] Per-request cost logged
- [ ] Cumulative cycle cost within budget

## Handoff
Cost data appended to observability traces. Summary available via CLI.
