# Skill: Consensus Validation

## Metadata
- **ID:** SKL-AG-012
- **Agents:** antigravity
- **Token Budget:** standard
- **Source:** claude-octopus (adapted)
- **Pillars:** [P2-03]

## Purpose
Apply multi-provider consensus during the VALIDATION phase. Multiple providers independently review Codex's implementation, and a consensus quality gate determines APPROVE or REJECT.

## STOP Rules
- MUST NOT approve without meeting consensus threshold (default 75%)
- MUST NOT use consensus to override explicit test failures (tests are binary, not debatable)
- MUST NOT skip single-provider validation when multi-provider is unavailable (graceful degradation)

## Protocol
1. Read current `PipelineContext` and check if `consensusConfig` is set
2. If multi-provider available: execute adversarial review across providers
   - Each provider independently reviews the implementation against acceptance criteria
   - Providers score: APPROVE (1.0), CONCERNS (0.5), REJECT (0.0)
3. Apply consensus strategy (default: majority_vote at 75%)
4. If consensus is APPROVE (>= threshold): proceed with standard APPROVE flow
5. If consensus is REJECT (< threshold):
   - Aggregate rejection reasons from dissenting providers
   - Use most specific rejection as primary (prefer TEST_FAILURE over general concerns)
   - Format structured rejection per `rejection-protocol.md`
6. If multi-provider unavailable: fall back to single-provider validation (standard flow)

## Checklist
- [ ] Consensus threshold met before APPROVE
- [ ] Test failures take precedence over consensus opinions
- [ ] Dissenting reasons logged to rejection entry
- [ ] Graceful degradation to single-provider when needed
- [ ] All provider reviews logged to observability traces
- [ ] Consensus confidence score recorded

## Handoff
APPROVE: proceed to CONSOLIDATION. REJECT: structured rejection back to Codex per `rejection-protocol.md`.
