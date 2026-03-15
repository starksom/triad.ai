# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project adheres to [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
