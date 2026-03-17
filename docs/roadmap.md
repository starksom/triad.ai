# Roadmap

This document contains the viable project backlog, specifically items that **have not yet been delivered**.
Whenever a task is completed, it must be moved to the implemented features section in `architecture.md` and registered in `CHANGELOG.md`.

**Strategic Reference:** See `TRIAD_MASTER_ROADMAP.md` for Phase 2/3 pillar definitions. Tag tasks with pillar IDs (e.g., `[P2-01]`) when applicable.

## Next Release (Planned v3.1.0)
- [ ] [P2-01] Agent Execution Engine — Formal `Agent` abstraction (`name`, `role`, `model`, `instructions`, `run()`), supporting Generator, Critic, Verifier, and Arbiter types.
- [ ] [P2-02] Multi-Model Simultaneous Execution — Query multiple LLMs for the same task and collect comparative response arrays.
- [ ] [P2-03] Consensus Engine — Implement Majority Vote, Weighted Score, Confidence Ranking, and Adversarial Debate strategies.
- [ ] [P2-05] Official Tool Framework (Registry) — Formal `Tool` object with `web_search`, `code_executor`, `filesystem`, `database`, `rag` integrations.

## Future Scope
- [ ] [P2-06] Layered Structured Memory — Short-term, Vector, Long-term, and Episodic memory layers.
- [ ] [P2-07] Execution Isolation (Sandboxing) — Git Worktrees, temp dirs, or Docker container isolation.
- [ ] [P2-08] Automated Retry & Self-Healing — Auto-loop on validation failure with strict failure log forwarding.
- [ ] [P2-12] Automated Benchmark Engine — HumanEval, SWE-bench, GAIA, MMLU evaluations.
- [ ] [P2-13] Multi-Backend LLM Adapters — OpenAI, Anthropic, Google Gemini, Mistral, Ollama support.
- [ ] [P2-14] Security & Governance — Granular tool permissions, prompt-injection defense, token-budget limits.
- [ ] [P2-15] Human-in-the-Loop (HITL) — Standardized API for external workflow pauses (e.g., HTTP webhooks).
- [ ] [P2-16] CI/CD Native Compatibility — GitHub Actions and GitLab CI adapters for automated Triad validation.
