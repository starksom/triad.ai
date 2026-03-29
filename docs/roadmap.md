# Roadmap

This document contains the viable project backlog, specifically items that **have not yet been delivered**.
Whenever a task is completed, it must be moved to the implemented features section in `architecture.md` and registered in `CHANGELOG.md`.

**Strategic Reference:** See `TRIAD_MASTER_ROADMAP.md` for Phase 2/3 pillar definitions. Tag tasks with pillar IDs (e.g., `[P2-01]`) when applicable.

**Inspiration Source:** Features below are informed by competitive analysis of [claude-octopus](https://github.com/nyldn/claude-octopus) multi-LLM orchestration patterns, adapted to Triad's 3-agent architecture.

## Next Release (Planned v3.1.0) — Octopus-Inspired Multi-Provider Engine

### Story 1: Multi-Backend LLM Adapter Layer [P2-13]
- [ ] Define `LLMProvider` interface (`name`, `models[]`, `isAvailable()`, `complete()`, `estimateCost()`)
- [ ] Define `ProviderConfig` with cost tier classification (`premium` | `standard` | `economy`)
- [ ] Define `ProviderResponse` with unified response envelope (`provider`, `model`, `content`, `tokens`, `latencyMs`, `cost`)
- [ ] Implement `ProviderRegistry` with `register()`, `detect()`, `get()`, `listAvailable()` methods
- [ ] Implement provider adapters: Anthropic (Claude), OpenAI (GPT/Codex), Google (Gemini), Ollama (local), OpenRouter (gateway), Mistral
- [ ] Implement `ProviderDetector` — auto-detect installed providers via env vars and CLI availability
- [ ] Add `triad providers` and `triad providers detect` CLI commands
- [ ] Export provider modules from `src/index.ts`
- [ ] Add optional peer dependencies for provider SDKs in `package.json`

### Story 2: Multi-Model Simultaneous Execution Engine [P2-02]
- [ ] Define `ExecutionStrategy` type: `parallel` | `sequential` | `adversarial`
- [ ] Define `MultiModelRequest` and `MultiModelResponse` interfaces
- [ ] Implement `executeParallel()` — query all providers simultaneously (for research/discovery phases)
- [ ] Implement `executeSequential()` — chain outputs across providers (for scoping/design phases)
- [ ] Implement `executeAdversarial()` — providers challenge each other's outputs (for review/validation phases)
- [ ] Implement `CostTracker` — per-provider cost accounting with tier-aware reporting
- [ ] Add `triad multi-model <prompt>` CLI command
- [ ] Add `triad cost-report` CLI command

### Story 3: Consensus Engine [P2-03]
- [ ] Define `ConsensusStrategy` type: `majority_vote` | `weighted_score` | `confidence_ranking` | `adversarial_debate`
- [ ] Define `ConsensusConfig` with configurable threshold (default 0.75, inspired by Octopus's 75% gate)
- [ ] Define `ConsensusResult` with winner, confidence score, vote tally, and dissenting responses
- [ ] Implement `majorityVote()` strategy — simple agreement counting
- [ ] Implement `weightedScore()` strategy — trust-based provider weighting
- [ ] Implement `confidenceRanking()` strategy — self-reported confidence scoring
- [ ] Implement `adversarialDebate()` strategy — multi-round debate until convergence
- [ ] Implement `ResponseEvaluator` — compare responses for semantic similarity
- [ ] Add optional `consensusConfig` field to `PipelineContext` in state-graph types
- [ ] Add `triad consensus <prompt>` CLI command

### Story 4: Smart Router [NEW]
- [ ] Define `TaskClassification` type: `research` | `design` | `implementation` | `review` (maps to Octopus Probe/Grasp/Tangle/Ink)
- [ ] Define `RoutingRule` and `RouterConfig` interfaces
- [ ] Implement `TaskClassifier` — classify incoming tasks by intent using keyword/pattern matching
- [ ] Implement `SmartRouter` — route tasks to optimal provider+strategy combinations based on classification, availability, cost tier, and historical performance

### Story 5: Agent Execution Engine with Personas [P2-01]
- [ ] Define formal `Agent` interface: `name`, `role`, `model`, `provider`, `instructions`, `skills[]`, `run()`
- [ ] Define `AgentType`: `generator` | `critic` | `verifier` | `arbiter`
- [ ] Define `Persona` interface: `id`, `name`, `expertise[]`, `phase`, `agentType`, `promptTemplate`
- [ ] Implement `AgentEngine` — agent lifecycle management (create, configure, execute, teardown)
- [ ] Create persona definitions (JSON) for Claude Code: `business-analyst`, `backend-architect`, `security-auditor`, `ux-designer`
- [ ] Create persona definitions (JSON) for Codex: `tdd-orchestrator`, `frontend-developer`, `debugger`, `performance-engineer`
- [ ] Create persona definitions (JSON) for Antigravity: `code-reviewer`, `security-validator`, `accessibility-auditor`
- [ ] Update agent prompts to reference persona system

### Story 6: Dark Factory Mode (Autonomous Pipeline) [P2-08]
- [ ] Define `AutonomyLevel`: `supervised` | `semi_autonomous` | `autonomous`
- [ ] Define `DarkFactoryConfig` and `CycleResult` interfaces
- [ ] Implement `DarkFactoryRunner` — autonomous pipeline executor from markdown spec
- [ ] Implement satisfaction scoring and holdout testing
- [ ] Add `DARK_FACTORY` transitions to state graph
- [ ] Add `triad dark-factory <spec.md>` CLI command
- [ ] Ensure human retains final commit authority at all autonomy levels

### Story 7: New Skills for Multi-Provider Capabilities
- [ ] Create `skills/shared/multi-provider-orchestration.md` (P1)
- [ ] Create `skills/shared/consensus-protocol.md` (P1)
- [ ] Create `skills/shared/provider-detection.md` (P0)
- [ ] Create `skills/shared/cost-optimization.md` (P1)
- [ ] Create `skills/claude_code/smart-routing.md` (P1)
- [ ] Create `skills/claude_code/dark-factory-planning.md` (P2)
- [ ] Create `skills/antigravity/consensus-validation.md` (P1)
- [ ] Register all new skills in `GLOBAL_SKILLS.md`

### Story 8: Architecture Documentation & ADRs
- [ ] ADR-010: Multi-Backend LLM Adapter Pattern (registry + auto-detection + graceful degradation)
- [ ] ADR-011: Consensus Engine with Configurable Strategies (75% default threshold)
- [ ] ADR-012: Smart Router for Task-to-Provider Mapping
- [ ] ADR-013: Dark Factory Autonomous Execution Mode (3 autonomy levels)
- [ ] Update `ORCHESTRATION_GUIDE.md` with Multi-Provider and Dark Factory sections
- [ ] Update `TRIAD_MASTER_ROADMAP.md` with Octopus-inspired enhancements

## Future Scope
- [ ] [P2-06] Layered Structured Memory — Short-term, Vector, Long-term, and Episodic memory layers.
- [ ] [P2-07] Execution Isolation (Sandboxing) — Git Worktrees, temp dirs, or Docker container isolation.
- [ ] [P2-12] Automated Benchmark Engine — HumanEval, SWE-bench, GAIA, MMLU evaluations.
- [ ] [P2-14] Security & Governance — Granular tool permissions, prompt-injection defense, token-budget limits.
- [ ] [P2-15] Human-in-the-Loop (HITL) — Standardized API for external workflow pauses (e.g., HTTP webhooks).
- [ ] [P2-16] CI/CD Native Compatibility — GitHub Actions and GitLab CI adapters for automated Triad validation.
