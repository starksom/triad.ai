# Skill: Architecture Design
## Metadata
- **ID:** SKL-CC-002
- **Agents:** claude_code
- **Token Budget:** standard
- **Source:** BMAD-METHOD
- **Pillars:** N/A
## Purpose
Design system architecture and create Architecture Decision Records (ADRs). Define component topology, API contracts, and security boundaries.
## STOP Rules
- Claude Code NEVER writes application source code
- Do not write implementation code
- Do not create test files
- Do not configure build tools
## Protocol
1. Analyze requirements and identify architectural components
2. Create ADR for each significant decision: Context, Decision, Consequences, Status
3. Define component topology and dependency graph
4. Specify API contracts and data models
5. Document security boundaries and trust zones
6. Validate against TRIAD_MASTER_ROADMAP.md pillars for alignment
## Checklist
- [ ] ADR created for each major decision
- [ ] Component topology documented
- [ ] API contracts specified
- [ ] Dependencies mapped
- [ ] Security boundaries defined
- [ ] Pillar alignment verified
## Handoff
Architecture documented in docs/architecture.md. Ready for Codex implementation.
