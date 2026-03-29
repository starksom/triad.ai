# Roadmap

This file tracks **remaining** work and in-flight items.
Completed items are reflected in `docs/architecture.md` and `CHANGELOG.md`.

## Capability Maturity Matrix (Current)

| Capability | Status | Notes |
|---|---|---|
| Provider detection + registry | stable | Implemented in `src/providers/*` and exposed by `triad providers*`. |
| Multi-model execution (parallel/sequential/adversarial) | beta | Implemented, but currently uses mock executor wiring in CLI and no consensus stage. |
| Cost reporting | beta | Implemented via `CostTracker` and `triad cost-report`. |
| Consensus engine | planned | ADR published; module/CLI not implemented. |
| Smart router | planned | ADR published; routing remains manual via CLI flags. |
| Dark factory mode | planned | ADR published; autonomous runner/CLI not implemented. |

## Next Release (Target: v3.1.x hardening)

### Story 1: Multi-Backend LLM Adapter Layer [P2-13]
- [x] `LLMProvider` + `ProviderConfig` + detection response types
- [x] `ProviderRegistry` (`register`, `get`, `detect`, `listAvailable`)
- [x] Adapters for Anthropic, OpenAI, Gemini, Mistral, Ollama, OpenRouter
- [x] CLI: `triad providers`, `triad providers detect [id]`
- [ ] Add real provider SDK invocation path (currently detection-focused)

### Story 2: Multi-Model Simultaneous Execution Engine [P2-02]
- [x] `ExecutionStrategy` (`parallel`, `sequential`, `adversarial`)
- [x] `MultiModelEngine` with strategy methods
- [x] `CostTracker` with persisted report support
- [x] CLI: `triad multi-model <prompt>`, `triad cost-report`
- [ ] Replace placeholder provider response generation in CLI with live adapter calls

### Story 3: Consensus Engine [P2-03]
- [x] ADR-011 published
- [ ] Implement `src/consensus/*`
- [ ] Add `triad consensus` command
- [ ] Integrate consensus into validation workflow

### Story 4: Smart Router
- [x] ADR-012 published
- [ ] Implement `src/router/*`
- [ ] Add optional automatic routing mode for multi-model command

### Story 5: Agent Execution Engine with Personas [P2-01]
- [ ] Not started

### Story 6: Dark Factory Mode [P2-08]
- [x] ADR-013 published
- [ ] Implement dark-factory runner and transitions
- [ ] Add `triad dark-factory <spec.md>`

### Story 7: Skills for Multi-Provider Capabilities
- [x] Skill files created in `skills/shared`, `skills/claude_code`, `skills/antigravity`
- [x] Skills revised to match runtime maturity (`stable`, `beta`, `planned`)

### Story 8: Architecture Documentation & ADRs
- [x] ADR-010 to ADR-013 published in `docs/adr/`
- [x] `README.md`, `ORCHESTRATION_GUIDE.md`, `docs/architecture.md`, `CHANGELOG.md` synchronized with current runtime status

## Future Scope
- [ ] [P2-06] Layered structured memory
- [ ] [P2-07] Execution isolation/sandboxing
- [ ] [P2-12] Automated benchmark engine
- [ ] [P2-14] Security and governance hardening
- [ ] [P2-15] External HITL API
- [ ] [P2-16] CI/CD native adapters
