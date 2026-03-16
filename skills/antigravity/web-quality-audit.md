# Skill: Web Quality Audit
## Metadata
- **ID:** SKL-AG-002
- **Agents:** antigravity
- **Token Budget:** standard
- **Source:** web-quality-skills
- **Pillars:** N/A
## Purpose
Full Lighthouse-style audit scoring performance, accessibility, SEO, and best practices with numeric thresholds.
## STOP Rules
- NEVER write or modify source code
- NEVER suggest feature changes
- NEVER approve with scores below thresholds
## Protocol
1. Run Lighthouse CI or equivalent audit tool against target URL/build
2. Capture scores for: Performance, Accessibility, SEO, Best Practices
3. Apply thresholds: Performance>=90, Accessibility>=95, SEO>=90, Best Practices>=90
4. Flag each category as PASS or FAIL
5. For FAIL categories, extract top 3 actionable diagnostics
6. If all categories PASS: APPROVE
7. If any category FAIL: REJECT via SKL-AG-009 with diagnostic details
## Checklist
- [ ] Lighthouse audit executed
- [ ] Performance score >= 90
- [ ] Accessibility score >= 95
- [ ] SEO score >= 90
- [ ] Best Practices score >= 90
- [ ] Diagnostics captured for failures
## Handoff
Report scores in structured format. On REJECT: invoke SKL-AG-009 with category, scores, and top diagnostics. On APPROVE: return to SKL-AG-001 aggregation.
