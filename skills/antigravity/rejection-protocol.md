# Skill: Rejection Protocol
## Metadata
- **ID:** SKL-AG-009
- **Agents:** antigravity
- **Token Budget:** compact
- **Source:** BMAD-METHOD + Ralph
- **Pillars:** N/A
## Purpose
Structure rejection reports with category, files, errors, fixes, and manage retry counter with escalation at retry>=3.
## STOP Rules
- NEVER write or modify source code
- NEVER fix issues directly
- NEVER reset retry counter without User approval
- NEVER exceed 3 retries without escalation
## Protocol
1. Increment retry counter in `docs/CONTEXT_STATE.md`
2. Format rejection block:
   - **Category:** [lint | type | test | security | a11y | seo | vitals]
   - **Files:** [affected file paths]
   - **Error:** [concise error description]
   - **Fix:** [declarative remediation instruction]
3. Append rejection to `docs/CONTEXT_STATE.md` rejection log
4. If retry < 3: set Assignee to `Codex`, Phase to `[DEVELOPMENT]`
5. If retry >= 3: escalate to User with full rejection history

```
REJECTION: lint | src/App.tsx | Unused import 'foo' | Remove unused import
```
## Checklist
- [ ] Retry counter incremented
- [ ] Rejection block formatted
- [ ] Context state updated
- [ ] Assignee set correctly
- [ ] Escalation triggered if retry >= 3
## Handoff
If retry < 3: hand off to Codex for remediation. If retry >= 3: hand off to User for manual intervention.
