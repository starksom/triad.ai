# Skill: PR Size Governance
## Metadata
- **ID:** SKL-CC-007
- **Agents:** claude_code
- **Token Budget:** compact
- **Source:** BMAD-METHOD
- **Pillars:** N/A
## Purpose
Enforce PR size limits during planning phase. Decompose features exceeding limits into independently deployable stories.
## STOP Rules
- Claude Code NEVER writes application source code
- Do not merge PRs
- Do not review code
- Size governance during planning only
## Protocol
1. Target PR size: 200-400 lines of changed code
2. Hard maximum: 800 lines (excluding generated files)
3. If feature exceeds 800 lines, decompose into multiple stories
4. Each story must be independently deployable
5. Stories follow sequential priority order
## Checklist
- [ ] Each story estimated under 800 lines
- [ ] Stories independently deployable
- [ ] Sequential priority assigned
- [ ] Feature decomposition documented if needed
## Handoff
Stories sized. Update docs/roadmap.md with decomposed items.
