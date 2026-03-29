# Skill: Consensus Protocol

## Metadata
- **ID:** SKL-SHARED-010
- **Agents:** shared
- **Token Budget:** standard
- **Source:** claude-octopus (adapted)
- **Pillars:** [P2-03]

## Purpose
Define when and how to apply consensus strategies to multi-provider responses. Ensures a single source of truth is derived from comparative response arrays using configurable quality gates.

## STOP Rules
- MUST NOT require consensus for single-provider responses
- MUST NOT override consensus threshold below 50% (minimum meaningful agreement)
- MUST NOT use adversarial debate for trivial or time-sensitive tasks

## Protocol
1. Check if `consensusConfig` is set in current `PipelineContext`
2. If not set, use default: `majority_vote` with 75% threshold
3. Select strategy based on task criticality:
   - **Majority Vote (75%)**: General agreement for standard tasks
   - **Weighted Score**: When specific providers are more trusted for the domain
   - **Confidence Ranking**: When providers self-report certainty scores
   - **Adversarial Debate**: For critical decisions requiring rigorous challenge
4. Execute consensus strategy via `ConsensusEngine`
5. If consensus reached: return `ConsensusResult` with winner and confidence
6. If consensus NOT reached: escalate to human or increase provider count

## Checklist
- [ ] Strategy appropriate for task criticality
- [ ] Threshold meets minimum 50% floor
- [ ] Dissenting responses logged for audit trail
- [ ] Escalation path defined for no-consensus scenarios
- [ ] Consensus result includes confidence score

## Handoff
`ConsensusResult` passed to the requesting agent. Dissenting responses logged to observability traces.
