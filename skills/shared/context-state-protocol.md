# Skill: Context State Protocol

## Metadata
- **ID:** SKL-SHARED-002
- **Agents:** shared
- **Token Budget:** compact
- **Source:** original
- **Pillars:** N/A

## Purpose
Standardized rules for reading and writing docs/CONTEXT_STATE.md.

## STOP Rules
- Never proceed if Phase does not match your role.
- Never modify fields outside your permission.

## Protocol
1. Read CONTEXT_STATE.md as absolute first action
2. Verify current Phase matches your role (PLANNING=Claude Code, DEVELOPMENT=Codex, VALIDATION=Antigravity, RELEASE_AUDIT=Claude Code)
3. If phase does not match, STOP immediately (zero tokens wasted)
4. After completing work, update Phase, Assignee, Handoff Message, and Completion Signal
5. Increment Retry Count only on rejection

## Checklist
- [ ] Phase verified before proceeding
- [ ] Assignee matches current agent
- [ ] Handoff Message is under 50 tokens
- [ ] Completion Signal updated

## Handoff
CONTEXT_STATE.md updated. Next assignee reads it.
