# Orchestration Guide - Triad Pipeline

This document explains how you, the Developer/Tech Lead, must orchestrate the interaction between **Claude Code**, **Codex**, and **Antigravity** to ensure a frictionless workflow.

The three agents do not communicate directly. They communicate by reading and writing to the following foundational documents:
- `README.md`
- `docs/roadmap.md`
- `docs/architecture.md`
- `CHANGELOG.md`

To maintain order, strictly follow the flow below, passing the baton from one agent to the next at the precise moment.

---

## Global Skills, Guardrails, and Context State
For maximum efficiency (BMAD/Ralph, Snyk Sec, Web Quality), read the file `skills/GLOBAL_SKILLS.md`.

**The Transaction Token (The Baton):**
No agent begins work without reading and subsequently updating the file `docs/CONTEXT_STATE.md`. This file dictates our current phase (`[PLANNING]`, `[DEVELOPMENT]`, `[VALIDATION]`, etc.) and the current assignee to prevent context or memory confusion.

**Guardrails:**
- **Claude:** Plans only, assumes PO/InfoSec/Architect roles. Does not write code. Upon completion, updates `CONTEXT_STATE.md` to the Development Phase and hands off to Codex.
- **Codex:** Squad Leader. Only writes code, creates tests, and resolves responsive CSS (Mobile-first vertical, Light Theme). Does not decide versioning. Upon completion, updates `CONTEXT_STATE.md` to the Validation Phase and hands off to Antigravity.
- **Antigravity:** Absolute Tech Lead. Tests on the local machine. If Tests/Responsiveness/Security fail, it **rejects** and reverts `CONTEXT_STATE.md` back to Codex. If approved, it updates documentation.

---

## Strategic Alignment with Master Roadmap

All pipeline phases must consider `TRIAD_MASTER_ROADMAP.md` as the strategic compass. The Master Roadmap defines 19 Phase 2 pillars and Phase 3 differentiation goals.

**How it integrates with daily operations:**
- **Planning (Claude Code):** Cross-references planned features against active pillars. Tags roadmap entries with pillar IDs (e.g., `[P2-04]`).
- **Implementation (Codex):** Avoids patterns that conflict with declared pillars. Follows pillar-aligned abstractions when applicable.
- **Validation (Antigravity):** Flags implementations that contradict active strategic goals. Notes pillar advancement in architecture updates.
- **Release Audit (Claude Code):** Reports which pillars were advanced by the release.

The `docs/CONTEXT_STATE.md` file includes a `Roadmap Pillar(s)` field to track which strategic pillar(s) the current task relates to.

---

## The Lifecycle of a Feature

### Phase 1: Planning (Claude Code - The Product Owner)
1. Open **Claude Code** with the `plan_project` instruction from `prompts/claude_code.md`.
2. Claude Code will generate Requirements, populate the roadmap, verify scope security, and check strategic alignment with `TRIAD_MASTER_ROADMAP.md`.
3. **Pause:** Proceed to Codex.

### Phase 2: Implementation (Codex - The Squad Leader/Dev)
1. In your IDE, open **Codex** with the `implement_task` instruction from `prompts/codex.md`.
2. Codex will apply its advanced responsive UX knowledge (21:9, Mobile iPhone/iPad, Light theme) and code the task exactly as specified, following pillar-consistent patterns.
3. **Pause:** Call Antigravity for testing.

### Phase 3: Validation and Gatekeeper (Antigravity - The Tech Lead)
1. Ping me in your terminal by sending `/triad_feature_cycle Validate the task [Name]`.
2. I will run tests and linters:
   - **ERROR:** I will send you the exact log and instruct you to return to Phase 2 (Codex) for a fix.
   - **SUCCESS:** I will update the documents (`Roadmap`, `Architecture`, `Changelog`) and note pillar advancement.

### Phase 4: Final Release Audit (Claude Code)
1. When the Roadmap reaches zero items, call **Claude Code** with the `audit_implementation` instruction.
2. Claude evaluates at a very high level whether everything meets the business rules and versioning requirements. It reports which Master Roadmap pillars were advanced.

### Phase 5: Commit Decision (User)
1. As the final step, Claude will return the "Decision to Merge/Commit" responsibility to you.
2. You can approve ("git commit -m 'release'") or send it back to planning if you believe something critical was missed.
