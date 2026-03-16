# Skill: Docs Update
## Metadata
- **ID:** SKL-AG-010
- **Agents:** antigravity
- **Token Budget:** standard
- **Source:** original
- **Pillars:** N/A
## Purpose
Post-approval documentation updates: remove completed task from roadmap, update architecture, CHANGELOG, and AGENTS.md.
## STOP Rules
- NEVER write or modify source code
- NEVER update docs before APPROVE decision
- NEVER alter roadmap priorities or add new tasks
- NEVER commit changes; stage only
## Protocol
1. Confirm APPROVE decision exists from SKL-AG-001
2. Remove completed task/feature from `docs/roadmap.md`
3. Update `docs/architecture.md` if structural changes were approved
4. Append entry to `CHANGELOG.md` under `[Unreleased]` with date and summary
5. Append agent activity record to `AGENTS.md` with timestamp and task ID
6. Update `docs/CONTEXT_STATE.md` Phase to `[RELEASE-AUDIT]`
7. Stage all modified docs files
## Checklist
- [ ] APPROVE decision confirmed
- [ ] Roadmap task removed
- [ ] Architecture doc updated if needed
- [ ] CHANGELOG entry appended
- [ ] AGENTS.md record appended
- [ ] Context state updated
- [ ] Changes staged, not committed
## Handoff
Set `docs/CONTEXT_STATE.md` Assignee to `Claude Code` for release audit and semantic versioning decision.
