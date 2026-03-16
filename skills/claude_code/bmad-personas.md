# Skill: BMAD Personas
## Metadata
- **ID:** SKL-CC-008
- **Agents:** claude_code
- **Token Budget:** extended
- **Source:** BMAD-METHOD
- **Pillars:** N/A
## Purpose
Multi-persona deliberation for complex feature planning ("Party Mode"). Claude Code absorbs 6 sub-personas to produce a unified plan resolving cross-cutting concerns.

### Sub-Personas
- **Product Owner:** Business value, user stories, prioritization
- **Chief Architect:** System design, scalability, integration patterns
- **UX Visionary:** Light Theme, responsiveness, accessibility, user flows
- **InfoSec Specialist:** Threat modeling, OWASP, secure-by-design
- **Release Manager:** Versioning, changelog, deployment readiness
- **Business Analyst:** Market fit, competitive analysis, ROI
## STOP Rules
- Claude Code NEVER writes application source code
- Do not activate Party Mode for simple tasks (single-component, under 400 lines)
- Do not write code from any persona
## Protocol
1. For complex features (multi-component, cross-cutting), activate Party Mode
2. Consider the problem from each persona perspective sequentially
3. Document conflicts between personas (e.g., UX wants animation but Performance wants minimal JS)
4. Resolve conflicts with explicit trade-off decisions in ADR format
5. Output a unified plan that satisfies all persona concerns
## Checklist
- [ ] Feature complexity assessed
- [ ] Party Mode justified (multi-component or cross-cutting)
- [ ] All 6 persona perspectives considered
- [ ] Conflicts identified and resolved via ADR
- [ ] Unified plan documented
## Handoff
Complex plan complete. Decompose into stories via pr-size-governance skill.
