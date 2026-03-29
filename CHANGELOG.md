# Changelog

All notable changes to this project are documented here.

## [Unreleased]

### Added (v3.1.0 Planning — Octopus-Inspired Multi-Provider Engine)
- 8 concrete implementation stories for v3.1.0 in `docs/roadmap.md`, derived from claude-octopus competitive analysis
- ADR-010: Multi-Backend LLM Adapter Pattern (registry + auto-detection + graceful degradation)
- ADR-011: Consensus Engine with Configurable Strategies (75% default threshold)
- ADR-012: Smart Router for Task-to-Provider Mapping (research/design/implementation/review classification)
- ADR-013: Dark Factory Autonomous Execution Mode (3 autonomy levels)
- 7 new skills: `provider-detection` (P0), `multi-provider-orchestration` (P1), `consensus-protocol` (P1), `cost-optimization` (P1), `smart-routing` (P1), `dark-factory-planning` (P2), `consensus-validation` (P1)
- Multi-Provider Execution section in `ORCHESTRATION_GUIDE.md`
- Dark Factory Mode section in `ORCHESTRATION_GUIDE.md`
- Smart Router (P2-04) pillar added to `TRIAD_MASTER_ROADMAP.md`
- Updated P2-01, P2-02, P2-03, P2-08, P2-13 pillars with Octopus-inspired enhancements
- 6 new CLI commands planned: `triad providers`, `triad providers detect`, `triad multi-model`, `triad consensus`, `triad dark-factory`, `triad cost-report`
- Release gates document for v3.1.0 (`docs/release_gates_v3_1.md`) with DoD by module, mandatory testing/coverage, telemetry minimums, security/governance checklist, and SemVer gating policy
- v3.0 fallback regression suite (`src/__tests__/v3-regression-flow.test.ts`) covering explicit behavior resolution when v3.1 feature flags are OFF
- Coverage gate configuration in Jest + `npm run test:coverage` script to enforce module-level quality thresholds for new v3.1 areas already implemented

### Added (v3.0 Architecture)
- State Graph Engine (`src/state-graph/`) with executable JSON graph, guard validation, and checkpoint triggers (ADR-006)
- Checkpoint System (`src/checkpoints/`) with file-based and SQLite backends for time-travel restore (ADR-007)
- Tracing Module (`src/tracing/`) with Langfuse integration and local JSON fallback (ADR-008)
- Dashboard (`src/dashboard/`) with Express + WebSocket real-time state visualization
- Node.js Commander CLI (`src/cli.ts`) replacing Bash triad-cli with backward compatibility (ADR-009)
- Scaffolder (`src/create.ts`) enabling `npx create-triad` project initialization
- FR-05 through FR-09 registered in `docs/architecture.md`
- Consolidated 7 implemented pillars from Phase 2 to Phase 1 in `TRIAD_MASTER_ROADMAP.md`

### Added
- Published final ADR documents:
  - ADR-010 Multi-Backend LLM Adapter Pattern
  - ADR-011 Consensus Engine with Configurable Strategies (proposed)
  - ADR-012 Smart Router for Task-to-Provider Mapping (proposed)
  - ADR-013 Dark Factory Autonomous Execution Mode (proposed)
- Added capability maturity matrices to core docs for runtime clarity (`stable`, `beta`, `planned`).

### Changed
- Synchronized `README.md` CLI command list with the actual Commander CLI implementation.
- Updated `ORCHESTRATION_GUIDE.md` to reflect implemented vs planned commands.
- Updated `docs/architecture.md` to reflect real runtime maturity and ADR links.
- Updated `docs/roadmap.md` with real completion state for stories 1-8.
- Adjusted new skills in `skills/shared/`, `skills/claude_code/`, `skills/antigravity/` to match current runtime maturity.

## [3.0.0] - 2026-03-29

### Added
- State graph engine (`src/state-graph/`) with transition guards.
- Checkpoint system (`src/checkpoints/`) with file + sqlite backend support.
- Tracing module (`src/tracing/`) with Langfuse and local JSON fallback.
- Node.js CLI (`src/cli.ts`) and npm scaffold flow (`create-triad`).
- Dashboard (`src/dashboard/`) for pipeline visibility.
- Provider registry/detection (`src/providers/`) and multi-model engine (`src/multi-model/`).
- Cost tracking/reporting via `.triad-cost-report.json` and `triad cost-report`.
