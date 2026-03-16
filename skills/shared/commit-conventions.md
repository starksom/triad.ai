# Skill: Commit Conventions

## Metadata
- **ID:** SKL-SHARED-004
- **Agents:** shared
- **Token Budget:** compact
- **Source:** BMAD-METHOD
- **Pillars:** N/A

## Purpose
Standardized commit message format and PR conventions.

## STOP Rules
- Never commit without a conventional prefix.
- Never exceed 800-line PR without splitting.

## Protocol
1. Use conventional commits: `feat:`/`fix:`/`docs:`/`refactor:`/`test:`/`chore:`/`security:`
2. Add scope tags: `feat(auth):`, `fix(api):`
3. Breaking changes: `feat!:` or `BREAKING CHANGE:` in footer
4. Commit messages max 72 characters first line
5. PR target: 200-400 lines, hard max 800 lines

## Checklist
- [ ] Commit uses conventional prefix
- [ ] First line under 72 characters
- [ ] PR under 800 lines
- [ ] Breaking changes flagged with ! or footer

## Handoff
Commit ready. Proceed with push or review.
