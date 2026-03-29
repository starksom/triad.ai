# Global Skills Index

This file is the entry point for the Triad Pipeline skill system. All agents MUST read this file during initialization.

## Skill Loading Protocol

1. Read `skills/SKILL_FORMAT.md` for the standard skill file structure
2. Load **P0** skills (compact, always loaded) for your agent role
3. Load **P1** skills (standard, loaded when task matches)
4. Load **P2** skills (extended, loaded on explicit demand only)

## Skill Directory

| Directory | Agents | Description |
|-----------|--------|-------------|
| `skills/shared/` | All agents | Cross-cutting concerns: planning, security, commits, tokens |
| `skills/claude_code/` | Claude Code only | Requirements, architecture, UX, InfoSec, release |
| `skills/codex/` | Codex only | Implementation, design-to-code, responsive, testing |
| `skills/antigravity/` | Antigravity only | Validation, rejection, PR review, audits |

## Priority Tiers

| Tier | Budget | Rule |
|------|--------|------|
| P0 (compact) | <500 tokens | Always loaded at initialization |
| P1 (standard) | 500-1500 tokens | Loaded when current task matches skill domain |
| P2 (extended) | 1500+ tokens | Loaded only on explicit demand or CLI trigger |

## Shared Skills (All Agents)

- `shared/planning-with-files.md` — File-based memory (P0)
- `shared/context-state-protocol.md` — CONTEXT_STATE.md management (P0)
- `shared/strategic-alignment.md` — Master Roadmap alignment (P0)
- `shared/token-optimization.md` — Token budget rules (P0)
- `shared/security-baseline.md` — OWASP/Snyk baseline (P0)
- `shared/provider-detection.md` — Auto-detect LLM providers at startup (P0) [P2-13]
- `shared/commit-conventions.md` — Git commit standards (P1)
- `shared/error-tracking.md` — Error logging protocol (P1)
- `shared/multi-provider-orchestration.md` — Multi-LLM task execution protocol (P1) [P2-02, P2-13]
- `shared/consensus-protocol.md` — Consensus strategy selection and execution (P1) [P2-03]
- `shared/cost-optimization.md` — Cost-tiered model selection rules (P1) [P2-13]

## Claude Code Skills

- `claude_code/requirement-declaration.md` — Scope user stories and acceptance criteria (P0)
- `claude_code/architecture-design.md` — System architecture and ADRs (P0)
- `claude_code/smart-routing.md` — Task classification and provider routing (P1) [P2-02, P2-13]
- `claude_code/dark-factory-planning.md` — Autonomous pipeline specification (P2) [P2-08]

## Antigravity Skills

- `antigravity/validation-protocol.md` — Binary APPROVE/REJECT decisions (P0)
- `antigravity/rejection-protocol.md` — Structured rejection formatting (P0)
- `antigravity/consensus-validation.md` — Multi-provider consensus during validation (P1) [P2-03]

## Format Reference

See [SKILL_FORMAT.md](SKILL_FORMAT.md) for the mandatory skill file template.
