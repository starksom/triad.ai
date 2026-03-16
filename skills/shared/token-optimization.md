# Skill: Token Optimization

## Metadata
- **ID:** SKL-SHARED-005
- **Agents:** shared
- **Token Budget:** compact
- **Source:** Ralph + BMAD
- **Pillars:** N/A

## Purpose
Minimize token consumption across all agents.

## STOP Rules
- Never load extended-tier skills for simple tasks.
- Never use narrative prose in handoff messages.

## Protocol
1. Read CONTEXT_STATE.md first - stop if phase mismatches (zero wasted tokens)
2. Load P0 skills always, P1 when task matches, P2 on demand only
3. Handoff messages max 50 tokens: "[ACTION] complete. [N] issues. See [SECTION]. Assignee: [AGENT]."
4. No narrative prose in skill execution - declarative steps only
5. Lazy pattern consolidation: append to AGENTS.md, refactor into skills only during explicit consolidation
6. Scale depth by complexity: simple fix = compact skills only, standard feature = standard tier, complex feature = extended tier

### Token Budget Allocation per Cycle (200K total)
| Phase | Agent | Budget |
|-------|-------|--------|
| PLANNING | Claude Code | 40K |
| DEVELOPMENT | Codex | 100K |
| VALIDATION | Antigravity | 30K |
| CONSOLIDATION | Antigravity | 10K |
| RELEASE_AUDIT | Claude Code | 20K |

## Checklist
- [ ] Phase-match check performed first
- [ ] Only relevant skill tiers loaded
- [ ] Handoff message under 50 tokens
- [ ] No unnecessary file re-reads

## Handoff
Token-optimized execution. Proceed with phase work.
