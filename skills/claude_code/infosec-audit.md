# Skill: InfoSec Audit
## Metadata
- **ID:** SKL-CC-004
- **Agents:** claude_code
- **Token Budget:** standard
- **Source:** snyk/studio-recipes
- **Pillars:** N/A
## Purpose
Shift-left security planning and OWASP Top 10 heuristic audit. Classify risks and define security controls before implementation begins.
## STOP Rules
- Claude Code NEVER writes application source code
- Do not implement security controls
- Do not run security scanners
- Do not modify code
## Protocol
1. Review planned architecture for OWASP Top 10 risks: Injection, Broken Auth, Sensitive Data Exposure, XXE, Broken Access Control, Misconfiguration, XSS, Insecure Deserialization, Vulnerable Components, Insufficient Logging
2. For each risk, classify: Mitigated / Needs Mitigation / Not Applicable
3. Define security controls: input validation strategy, auth method, encryption at rest/transit, audit logging
4. Specify dependency governance: approved package sources, version pinning strategy
5. Flag any planned patterns that introduce attack surface
## Checklist
- [ ] All OWASP Top 10 risks classified
- [ ] Security controls defined per risk
- [ ] Auth method specified
- [ ] Encryption strategy documented
- [ ] Dependency governance rules set
- [ ] Attack surface flagged
## Handoff
Security plan documented. Codex implements with secure-coding skill.
