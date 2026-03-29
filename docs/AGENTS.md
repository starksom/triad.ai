# Agent Decision Log (Append-Only)

This file records all agent decisions across pipeline cycles. Never delete entries. New entries are appended at the bottom.

Format:
```
## [YYYY-MM-DD] [Agent] - [PHASE]
- Decided: [what]
- Pillar: [P2-XX or N/A]
- Files: [affected files]
```

---

## [2026-03-29] Claude Code - [PLANNING]
- Decided: Define v3.1.0 implementation stories based on claude-octopus competitive analysis. Created 8 stories covering Multi-Backend LLM Adapters (P2-13), Multi-Model Execution (P2-02), Consensus Engine (P2-03), Smart Router (new), Agent Engine with Personas (P2-01), Dark Factory Mode (P2-08), 7 new skills, and architecture documentation (ADRs 010-013). Handed off to Codex starting with Story 1.
- Pillar: [P2-01], [P2-02], [P2-03], [P2-08], [P2-13]
- Files: docs/roadmap.md, docs/architecture.md, TRIAD_MASTER_ROADMAP.md, ORCHESTRATION_GUIDE.md, CHANGELOG.md, skills/GLOBAL_SKILLS.md, skills/shared/provider-detection.md, skills/shared/multi-provider-orchestration.md, skills/shared/consensus-protocol.md, skills/shared/cost-optimization.md, skills/claude_code/smart-routing.md, skills/claude_code/dark-factory-planning.md, skills/antigravity/consensus-validation.md, docs/CONTEXT_STATE.md

## [2026-03-29] Codex - [DEVELOPMENT]
- Decided: Formalizar gates de release v3.1.0 com DoD por módulo, checklist de telemetria e segurança/governança, adicionar exigência operacional para bump semver apenas após aprovação integral dos gates e documentação sincronizada.
- Pillar: [P2-14], [P2-16], [P2-02], [P2-03], [P2-13], [P2-08], [P2-01]
- Files: docs/release_gates_v3_1.md, docs/v3_1_migration_plan.md, CHANGELOG.md

## [2026-03-29] Codex - [DEVELOPMENT]
- Decided: Reforçar gate de qualidade com suíte de regressão explícita do fallback v3.0 (flags OFF) e cobertura mandatória para módulos v3.1 já implementados via configuração Jest + script dedicado.
- Pillar: [P2-16], [P2-02], [P2-13]
- Files: src/__tests__/v3-regression-flow.test.ts, jest.config.js, package.json
