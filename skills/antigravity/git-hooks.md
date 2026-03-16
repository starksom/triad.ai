# Skill: Git Hooks
## Metadata
- **ID:** SKL-AG-008
- **Agents:** antigravity
- **Token Budget:** compact
- **Source:** snyk-recipes
- **Pillars:** P2-SEC
## Purpose
Verify pre-commit security hooks and lint-staged integration are installed and configured correctly.
## STOP Rules
- NEVER write or modify hook scripts
- NEVER install hooks directly
- NEVER bypass or disable existing hooks
## Protocol
1. Verify `.husky/` directory or equivalent hook manager exists
2. Verify pre-commit hook includes lint-staged invocation
3. Verify `lint-staged` config exists in `package.json` or `.lintstagedrc`
4. Verify lint-staged runs: linter, type-check, secret scan
5. Test hook execution with dry-run if available
6. If hooks installed and configured: APPROVE
7. If hooks missing or misconfigured: REJECT via SKL-AG-009
## Checklist
- [ ] Hook manager directory exists
- [ ] Pre-commit hook configured
- [ ] lint-staged config present
- [ ] Linter included in staged checks
- [ ] Secret scan included in staged checks
## Handoff
Return hook status to SKL-AG-007. On REJECT: invoke SKL-AG-009 with missing components and expected configuration.
