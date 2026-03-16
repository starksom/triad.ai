# Skill: PR Review
## Metadata
- **ID:** SKL-AG-006
- **Agents:** antigravity
- **Token Budget:** standard
- **Source:** claude-git-pr-skill
- **Pillars:** N/A
## Purpose
Review pull requests using batch pending reviews with proper GitHub event types, requiring User approval before posting.
## STOP Rules
- NEVER write or modify source code
- NEVER post review without User approval
- NEVER use single-comment API; always use pending review batch
- NEVER merge PRs
## Protocol
1. Fetch PR diff via `gh pr diff <number>`
2. Analyze changes against validation criteria (SKL-AG-001)
3. Create pending review: `gh api repos/{owner}/{repo}/pulls/{number}/reviews -f event=PENDING`
4. Batch all comments into the pending review with file, line, and body
5. Present review summary to User for approval
6. On User approval: submit review with event `APPROVE` or `REQUEST_CHANGES`
7. On User rejection: discard pending review

```
Comment format:
- file: path/to/file.ts
- line: 42
- body: "[CATEGORY] Description of finding"
```
## Checklist
- [ ] PR diff fetched
- [ ] Changes analyzed
- [ ] Pending review created (not submitted)
- [ ] Comments batched with file/line refs
- [ ] User approved posting
- [ ] Review submitted with correct event type
## Handoff
After review posted: return to SKL-AG-001 for validation decision. If APPROVE: proceed with pipeline. If REQUEST_CHANGES: set Assignee to `Codex`.
