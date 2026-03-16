# Skill: Accessibility Audit
## Metadata
- **ID:** SKL-AG-005
- **Agents:** antigravity
- **Token Budget:** standard
- **Source:** web-quality-skills
- **Pillars:** P2-UX
## Purpose
Verify WCAG 2.2 AA compliance through automated tooling and structured manual checks.
## STOP Rules
- NEVER write or modify source code
- NEVER downgrade WCAG level without User approval
- NEVER approve with any Level A or AA violations
## Protocol
1. Run axe-core or equivalent automated a11y scanner
2. Capture violations by impact: critical, serious, moderate, minor
3. Verify keyboard navigation: all interactive elements focusable and operable
4. Verify color contrast ratios meet AA minimums (4.5:1 normal, 3:1 large)
5. Verify ARIA attributes are valid and correctly applied
6. Verify form inputs have associated labels
7. Verify media has captions/transcripts where applicable
8. If zero critical/serious violations and AA criteria met: APPROVE
9. If any critical/serious violation: REJECT via SKL-AG-009
## Checklist
- [ ] Automated scan executed
- [ ] Zero critical violations
- [ ] Zero serious violations
- [ ] Keyboard navigation verified
- [ ] Color contrast ratios pass
- [ ] ARIA attributes valid
- [ ] Form labels associated
## Handoff
Return violation summary to SKL-AG-001 or SKL-AG-002. On REJECT: invoke SKL-AG-009 with violation details, affected elements, and WCAG criteria references.
