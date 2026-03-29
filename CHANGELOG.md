# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project adheres to [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

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
- CLAUDE.md for auto-injection of Triad instructions into Claude Code sessions
- TRIAD_MASTER_ROADMAP.md integration across all agent prompts, skills, and workflows
- Strategic Alignment section (Section 5) in GLOBAL_SKILLS.md with actionable checklists
- Roadmap Pillar(s) field in CONTEXT_STATE.md for strategic tracking
- `triad roadmap` and `triad status` CLI commands
- `triad --help` and `triad --version` CLI flags
- .gitignore for standard development artifacts
- templates/ directory with README.template.md for child projects
- Concrete validation checklists in GLOBAL_SKILLS.md (Sections 1-5)
- Phase validation check in `triad validate` (verifies CONTEXT_STATE.md is in VALIDATION)

### Changed
- README.md rewritten from placeholder template to full project documentation
- CLI output uses plain text markers instead of emojis (requirement compliance)
- architecture.md populated with real ADRs (ADR-001 through ADR-003) and security considerations
- ORCHESTRATION_GUIDE.md expanded with Strategic Alignment section
- FIRST_SETUP.md updated to reference CLAUDE.md auto-injection
- All agent prompts (claude_code.md, codex.md, antigravity.md) now include TRIAD_MASTER_ROADMAP.md in mandatory reading
- Workflow file (triad_feature_cycle.md) includes roadmap pillar tracking in all steps

### Fixed
- Removed stray debug comment from workflow file

## [0.1.0] - 2025-01-01
### Added
- Initial project structure based on the Triad Pipeline template.
- Strict role separation (Claude Code, Codex, Antigravity).
- CONTEXT_STATE.md as transactional token for pipeline phases.
- Minimal example project (examples/minimal-project).
- Core CLI scaffolding (triad init, run, validate).
- GLOBAL_SKILLS.md with BMAD, Web Quality, Security, and Git lifecycle rules.
- FIRST_SETUP.md and ORCHESTRATION_GUIDE.md documentation.
