# Skill: Responsive UX

## Metadata
- **ID:** SKL-CODEX-004
- **Agents:** codex
- **Token Budget:** standard
- **Source:** web-quality-skills
- **Pillars:** P2-UX

## Purpose
Implement Light Theme and responsive layouts using CSS Grid/Flexbox across all target breakpoints: 21:9, 16:9, 4:3, and mobile vertical.

## STOP Rules
- MUST NOT implement Dark Theme unless explicitly specified in story.
- MUST NOT use inline styles for responsive logic.
- MUST NOT validate its own responsive output as passing QA.
- MUST NOT update docs/roadmap.md or CHANGELOG.md.

## Protocol
1. Read layout spec from story: grid structure, breakpoint behavior, theme tokens.
2. Define breakpoints in order: `2560px` (21:9), `1280px` (16:9), `768px` (4:3), `480px` (mobile).
3. Implement mobile-first: start at 480px, scale up with `min-width` media queries.
4. Use CSS Grid for page-level layout; Flexbox for component-level alignment.
5. Apply Light Theme tokens from design system for all color values.
6. Test layout logic at each breakpoint using dev tools before committing.
7. Use `clamp()` for fluid typography and spacing where appropriate.

### Example (max 10 lines)
```css
.layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-md);
}
@media (min-width: 768px) { .layout { grid-template-columns: 1fr 2fr; } }
@media (min-width: 1280px) { .layout { grid-template-columns: 1fr 3fr 1fr; } }
@media (min-width: 2560px) { .layout { grid-template-columns: 1fr 4fr 1fr; } }
```

## Checklist
- [ ] Mobile-first approach applied
- [ ] All four breakpoints addressed
- [ ] Light Theme tokens used for colors
- [ ] CSS Grid for layout, Flexbox for alignment
- [ ] No hardcoded color or spacing values
- [ ] Fluid typography with clamp() where needed

## Handoff
Set Phase to `[VALIDATION]` and Assignee to `Antigravity` in CONTEXT_STATE.md.
