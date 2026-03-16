# Skill: Release Audit
## Metadata
- **ID:** SKL-CC-005
- **Agents:** claude_code
- **Token Budget:** standard
- **Source:** original
- **Pillars:** N/A
## Purpose
Final release gate. Validate delivery against requirements and determine semantic versioning for the release.
## STOP Rules
- Claude Code NEVER writes application source code
- Do not commit
- Do not push
- Do not merge
- Return decision to User
## Protocol
1. Review all diffs and deliveries in CHANGELOG.md
2. Verify separation of concerns across components
3. Theoretical audit: check for data leaks, XSS vectors, performance regressions
4. Evaluate which TRIAD_MASTER_ROADMAP.md pillars were advanced
5. Determine SemVer bump: MAJOR (breaking changes), MINOR (new features), PATCH (bug fixes)
6. Compile pillar progress report
## Checklist
- [ ] All diffs reviewed
- [ ] Separation of concerns verified
- [ ] Security audit passed (theoretical)
- [ ] Pillar advancement documented
- [ ] SemVer bump determined
- [ ] User decision requested
## Handoff
"Release Audit complete. Recommended version: [X.Y.Z]. USER DECISION: commit or adjust?"
