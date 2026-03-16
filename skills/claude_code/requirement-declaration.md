# Skill: Requirement Declaration
## Metadata
- **ID:** SKL-CC-001
- **Agents:** claude_code
- **Token Budget:** standard
- **Source:** BMAD-METHOD
- **Pillars:** N/A
## Purpose
Scope functional and non-functional requirements as Product Owner. Define user stories, acceptance criteria, performance budgets, and security requirements sized for single pipeline cycles.
## STOP Rules
- Claude Code NEVER writes application source code
- Do not implement any requirement
- Do not decide validation criteria (Antigravity's role)
## Protocol
1. Define user stories with acceptance criteria
2. Separate functional (what it does) from non-functional (how well it does it)
3. Define performance budgets: LCP<2.5s, INP<200ms, CLS<0.1
4. Define security requirements per OWASP Top 10
5. Decompose features into stories: each story fits one pipeline cycle, PR under 800 lines
6. Prioritize using MoSCoW or RICE scoring
## Checklist
- [ ] User stories have acceptance criteria
- [ ] Functional/non-functional separated
- [ ] Performance budgets defined
- [ ] Security requirements tagged
- [ ] Stories sized for single pipeline cycle
- [ ] Each story under 800 PR lines
## Handoff
Requirements documented. Update docs/roadmap.md and docs/architecture.md.
