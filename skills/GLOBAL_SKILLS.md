# Global Skills Context

To maximize intelligence and knowledge sharing among Claude Code, Codex, and Antigravity, this project incorporates "Multi-Skills" principles based on the following reference repositories:

## 1. Planning with Files & BMAD / Ralph Methods
**Core Concept:** Agents must not rely on their own volatile context memory. Every decision, requirement, and step-by-step instruction must be read from, validated against, and written to Markdown files (`roadmap.md`, `architecture.md`, `CONTEXT_STATE.md`).
- **Mandatory Action:** Before making any modifications, the agent MUST read the architecture documentation and the active plan.
- **Structure:** Reasoning should be explicit ("step-by-step") and declarative.

## 2. Web Quality Skills (addyosmani)
**Core Concept:** Absolute focus on responsive UX and performance.
- **UX Rules (Codex and Antigravity):**
  - **Mandatory Theme:** Only Light Themes are permitted unless explicitly requested otherwise.
  - **Mandatory Responsiveness:** The interface must adapt perfectly to 21:9 (Ultrawide), 16:9 (Standard Desktop), and 4:3 (Traditional Tablets) aspect ratios.
  - **Mobile-First Vertical:** The layout must natively support usability on iPhones, iPads, and Android devices in vertical orientation.

## 3. Security & Snyk Studio Recipes
**Core Concept:** Shift-left security and OWASP Top 10 by default.
- **Confidentiality Rules:** No hardcoded secrets are permitted.
- **Validation:** Antigravity and Claude Code are responsible for checking for SQL/NoSQL injections, XSS, CSRF, and CORS vulnerabilities during formal audits.

## 4. Git PR & Lifecycle Skills
**Core Concept:** The feature flow concludes with an executive decision by the end-user.
- **Commit Decision:** Claude Code prepares the review but does not execute destructive actions like merge/commit to main without final human validation (unless automated within the workflow).
