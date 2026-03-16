# Skill: Threat Modeling
## Metadata
- **ID:** SKL-CC-006
- **Agents:** claude_code
- **Token Budget:** extended
- **Source:** snyk/studio-recipes
- **Pillars:** N/A
## Purpose
STRIDE-based threat modeling for complex features. Identify assets, trust boundaries, and threats rated by severity with defined mitigations.
## STOP Rules
- Claude Code NEVER writes application source code
- Do not implement mitigations
- Do not run vulnerability scanners
- Plan only
## Protocol
1. Identify assets and trust boundaries
2. Apply STRIDE per component: Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege
3. Rate each threat: Critical/High/Medium/Low
4. Define mitigations for Critical and High threats
5. Document in architecture.md under Security section
6. Cross-reference with dependency vulnerability databases
## Checklist
- [ ] Assets and trust boundaries identified
- [ ] STRIDE applied per component
- [ ] Threats rated by severity
- [ ] Mitigations defined for Critical/High
- [ ] Documented in architecture.md
- [ ] Dependencies cross-referenced
## Handoff
Threat model documented. Security controls flow to Codex via requirement plan.
