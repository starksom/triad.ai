# Changelog

All notable changes to this project are documented here.

## [Unreleased]

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
