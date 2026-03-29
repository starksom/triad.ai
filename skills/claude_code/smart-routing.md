# Skill: Smart Routing

## Metadata
- **ID:** SKL-CC-009
- **Agents:** claude_code
- **Token Budget:** standard
- **Maturity:** planned
- **Runtime Scope:** documentation-only (no `src/router` yet)
- **Pillars:** [P2-02], [P2-13]

## Purpose
Describe the future policy for automatic task classification and provider strategy routing.

## STOP Rules
- MUST NOT represent Smart Router as implemented runtime behavior
- MUST NOT override explicit user-selected providers/strategies

## Protocol (Planned)
1. Classify task intent (`research`, `design`, `implementation`, `review`).
2. Recommend provider subset + strategy.
3. Respect availability, cost policy, and operator overrides.

## Current Runtime Equivalent
Use manual strategy flags with `triad multi-model --strategy ...` and optional `--providers`.

## Checklist
- [ ] Documentation clearly labels this as planned
- [ ] Operators are pointed to current manual routing commands

## Handoff
When implemented, router output should build a `MultiModelRequest` automatically.
