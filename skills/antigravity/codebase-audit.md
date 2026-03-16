# Skill: Codebase Audit
## Metadata
- **ID:** SKL-AG-011
- **Agents:** antigravity
- **Token Budget:** extended
- **Source:** claude-code-skills
- **Pillars:** N/A
## Purpose
Comprehensive 7-category codebase analysis covering docs, security, build, patterns, tests, architecture, and database.
## STOP Rules
- NEVER write or modify source code
- NEVER fix findings directly
- NEVER skip any of the 7 categories
- NEVER approve with critical findings in any category
## Protocol
1. **Docs:** Verify README, API docs, inline comments, CHANGELOG present and current
2. **Security:** Run SKL-AG-007, check auth patterns, input validation, CORS config
3. **Build:** Verify build succeeds, no warnings, bundle size within budget
4. **Patterns:** Check code consistency, naming conventions, file structure adherence
5. **Tests:** Verify coverage thresholds met, no skipped tests, integration tests present
6. **Architecture:** Validate against `docs/architecture.md`, check dependency graph, circular deps
7. **Database:** Verify migrations current, indexes present, no N+1 queries, seed data valid
8. Score each category: PASS / WARN / FAIL
9. If zero FAIL categories: APPROVE
10. If any FAIL category: REJECT via SKL-AG-009

```
| Category     | Status | Findings |
|--------------|--------|----------|
| Docs         | PASS   | 0        |
| Security     | PASS   | 0        |
| Build        | WARN   | 2        |
| Patterns     | PASS   | 0        |
| Tests        | FAIL   | 3        |
| Architecture | PASS   | 0        |
| Database     | PASS   | 0        |
```
## Checklist
- [ ] Docs category audited
- [ ] Security category audited
- [ ] Build category audited
- [ ] Patterns category audited
- [ ] Tests category audited
- [ ] Architecture category audited
- [ ] Database category audited
- [ ] Score table generated
- [ ] Binary decision rendered
## Handoff
Return audit table to User or SKL-AG-001. On REJECT: invoke SKL-AG-009 with FAIL category details. On APPROVE: proceed to SKL-AG-010 for docs update.
