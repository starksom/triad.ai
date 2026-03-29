# Skill: Multi-Provider Orchestration

## Metadata
- **ID:** SKL-SHARED-009
- **Agents:** shared
- **Token Budget:** standard
- **Source:** claude-octopus (adapted)
- **Pillars:** [P2-02], [P2-13]

## Purpose
Define the protocol for executing tasks across multiple LLM providers simultaneously, sequentially, or adversarially. Enables comparative response arrays and cross-provider validation.

## STOP Rules
- MUST NOT send sensitive project data to providers without user consent
- MUST NOT bypass cost tier limits
- MUST NOT use providers not registered in `ProviderRegistry`
- MUST NOT block pipeline on provider timeouts (use configurable timeout with fallback)

## Protocol
1. Read `ProviderRegistry.listAvailable()` to determine active providers
2. Select execution strategy based on task phase:
   - **Parallel**: PLANNING research tasks (all providers at once for breadth)
   - **Sequential**: PLANNING scoping tasks (chain outputs for logical flow)
   - **Adversarial**: VALIDATION review tasks (providers challenge each other)
3. Construct `MultiModelRequest` with prompt, selected providers, strategy, and timeout
4. Execute via `MultiModelExecutor` and collect `ProviderResponse[]`
5. Pass responses to Consensus Engine if consensus is configured for the current phase
6. Track costs via `CostTracker` and log to observability traces

## Checklist
- [ ] Strategy matches pipeline phase
- [ ] Provider timeouts configured (default 30s)
- [ ] Cost tracked per provider per request
- [ ] Failed providers handled gracefully (response excluded, not pipeline failure)
- [ ] All responses include provider name and model for traceability

## Handoff
Response array passed to Consensus Engine or directly to the requesting agent.
