# Skill: Planning with Files

## Metadata
- **ID:** SKL-SHARED-001
- **Agents:** shared
- **Token Budget:** compact
- **Source:** OthmanAdi/planning-with-files
- **Pillars:** N/A

## Purpose
Use filesystem as extended memory. 3-file persistent planning pattern.

## STOP Rules
- Never delete entries from append-only files.
- Never skip reading CONTEXT_STATE.md.

## Protocol
1. Maintain structured state in `docs/CONTEXT_STATE.md`
2. Track decisions in `docs/AGENTS.md` (append-only)
3. Log progress in `docs/progress.txt` (append-only)
4. Never rely on conversational memory across sessions
5. Read state files before any action

## Checklist
- [ ] CONTEXT_STATE.md read before acting
- [ ] AGENTS.md appended after decisions
- [ ] progress.txt updated at phase transitions
- [ ] No reliance on prior session memory

## Handoff
State files are updated. Next agent reads CONTEXT_STATE.md to continue.
