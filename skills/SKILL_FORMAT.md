# Skill File Format Specification

Every skill in the Triad Pipeline MUST follow this structure. No exceptions.

## Template

```markdown
# Skill: [Name]

## Metadata
- **ID:** SKL-[AGENT]-[NNN] (e.g., SKL-SHARED-001, SKL-CODEX-003)
- **Agents:** [shared | claude_code | codex | antigravity]
- **Token Budget:** [compact | standard | extended]
- **Source:** [External repo or "original"]
- **Pillars:** [P2-XX references or "N/A"]

## Purpose
[1-2 sentences maximum. What this skill enables.]

## STOP Rules
- [Boundary 1: What this skill MUST NOT do]
- [Boundary 2: Guardrail constraint]

## Protocol
1. [Actionable step]
2. [Actionable step]

## Checklist
- [ ] [Verification item]
- [ ] [Verification item]

## Handoff
[What to do when this skill completes its work.]
```

## Token Budget Tiers

| Tier | Max Tokens | Loading Rule |
|------|-----------|--------------|
| `compact` | <500 | P0 skills: always loaded |
| `standard` | 500-1500 | P1 skills: loaded when task matches |
| `extended` | 1500+ | P2 skills: loaded on explicit demand |

## Authoring Rules

1. No narrative prose. Declarative steps only.
2. Checklists: abbreviated items, under 15 words each.
3. Maximum 1 example per skill, maximum 10 lines.
4. STOP Rules are mandatory. Every skill declares what it cannot do.
5. Metadata section must be parseable (structured fields, not paragraphs).
6. Handoff section must name the next agent or action explicitly.
