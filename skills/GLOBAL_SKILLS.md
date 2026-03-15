# Global Skills Context

To maximize intelligence and knowledge sharing among Claude Code, Codex, and Antigravity, this project incorporates "Multi-Skills" principles based on the following reference repositories:

## 1. Planning with Files & BMAD / Ralph Methods
**Core Concept:** Agents must not rely on their own volatile context memory. Every decision, requirement, and step-by-step instruction must be read from, validated against, and written to Markdown files (`roadmap.md`, `architecture.md`, `CONTEXT_STATE.md`).
- **Mandatory Action:** Before making any modifications, the agent MUST read the architecture documentation and the active plan.
- **Structure:** Reasoning should be explicit ("step-by-step") and declarative.

### Checklist
- [ ] Agent has read `docs/CONTEXT_STATE.md` before acting
- [ ] Agent has read `docs/architecture.md` before modifying code
- [ ] Agent has read `docs/roadmap.md` to identify the active task
- [ ] All decisions are documented in markdown (no volatile context reliance)

## 2. Web Quality Skills (addyosmani)
**Core Concept:** Absolute focus on responsive UX and performance.
- **UX Rules (Codex and Antigravity):**
  - **Mandatory Theme:** Only Light Themes are permitted unless explicitly requested otherwise.
  - **Mandatory Responsiveness:** The interface must adapt perfectly to 21:9 (Ultrawide), 16:9 (Standard Desktop), and 4:3 (Traditional Tablets) aspect ratios.
  - **Mobile-First Vertical:** The layout must natively support usability on iPhones, iPads, and Android devices in vertical orientation.

### Checklist
- [ ] Light Theme applied as default (no dark-only designs)
- [ ] Responsive layout tested at 21:9 (Ultrawide, min-width: 2560px)
- [ ] Responsive layout tested at 16:9 (Desktop, min-width: 1280px)
- [ ] Responsive layout tested at 4:3 (Tablet, min-width: 768px)
- [ ] Mobile vertical layout functional (max-width: 480px)
- [ ] No horizontal scroll at any breakpoint
- [ ] Touch targets minimum 44x44px on mobile

## 3. Security & Snyk Studio Recipes
**Core Concept:** Shift-left security and OWASP Top 10 by default.
- **Confidentiality Rules:** No hardcoded secrets are permitted.
- **Validation:** Antigravity and Claude Code are responsible for checking for SQL/NoSQL injections, XSS, CSRF, and CORS vulnerabilities during formal audits.

### Checklist
- [ ] No hardcoded secrets, API keys, or credentials in source code
- [ ] No hardcoded secrets in configuration files (use environment variables)
- [ ] Input sanitization applied to all user-facing endpoints
- [ ] SQL/NoSQL injection prevention verified (parameterized queries)
- [ ] XSS prevention verified (output encoding, CSP headers)
- [ ] CSRF protection enabled on state-changing endpoints
- [ ] CORS configuration restricted to known origins
- [ ] Dependencies scanned for known vulnerabilities
- [ ] No sensitive data in logs or error messages

## 4. Git PR & Lifecycle Skills
**Core Concept:** The feature flow concludes with an executive decision by the end-user.
- **Commit Decision:** Claude Code prepares the review but does not execute destructive actions like merge/commit to main without final human validation (unless automated within the workflow).

### Checklist
- [ ] Feature branch created (not working directly on main)
- [ ] Commit messages follow conventional format
- [ ] No force pushes to shared branches
- [ ] Final merge/commit decision deferred to human user

## 5. Strategic Alignment (TRIAD_MASTER_ROADMAP.md)
**Core Concept:** All implementation work must respect and advance the strategic direction defined in `TRIAD_MASTER_ROADMAP.md`.
- **Pillar Awareness:** Agents must read the Master Roadmap to understand which Phase 2/3 pillars are active.
- **Conflict Prevention:** Never implement patterns that directly contradict a declared pillar goal (e.g., hardcoding a single LLM provider when Multi-Backend [P2-13] is a pillar).
- **Pillar Advancement:** When a feature naturally advances a pillar, tag it in the roadmap entry and note it in architecture updates.
- **Multi-Pillar Priority:** Prefer implementations that serve multiple pillars simultaneously over single-purpose solutions.

### Checklist
- [ ] Agent has read `TRIAD_MASTER_ROADMAP.md` before acting
- [ ] Implementation does not conflict with active Phase 2/3 pillars
- [ ] Pillar advancement tagged in roadmap entry (e.g., `[P2-04]`)
- [ ] Architecture updates note which pillars were advanced
- [ ] No single-vendor lock-in patterns introduced without justification
