# Skill: Security Validation
## Metadata
- **ID:** SKL-AG-007
- **Agents:** antigravity
- **Token Budget:** compact
- **Source:** snyk-recipes
- **Pillars:** P2-SEC
## Purpose
Scan dependencies for known vulnerabilities, validate pre-commit hooks, and flag remediation paths.
## STOP Rules
- NEVER write or modify source code
- NEVER patch vulnerabilities directly
- NEVER approve with critical/high severity findings
## Protocol
1. Run `npm audit` or `snyk test` against project
2. Capture vulnerabilities by severity: critical, high, medium, low
3. Verify pre-commit hooks installed (SKL-AG-008)
4. Check for `.env` or secrets in staged files
5. If zero critical/high findings and hooks installed: APPROVE
6. If any critical/high finding: REJECT via SKL-AG-009 with CVE references
## Checklist
- [ ] Dependency scan executed
- [ ] Zero critical vulnerabilities
- [ ] Zero high vulnerabilities
- [ ] Pre-commit hooks verified
- [ ] No secrets in staged files
## Handoff
Return scan results to SKL-AG-001. On REJECT: invoke SKL-AG-009 with CVE IDs, affected packages, and remediation commands.
