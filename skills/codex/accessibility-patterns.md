# Skill: Accessibility Patterns

## Metadata
- **ID:** SKL-CODEX-006
- **Agents:** codex
- **Token Budget:** standard
- **Source:** web-quality-skills
- **Pillars:** P2-A11Y

## Purpose
Implement WCAG 2.2 AA compliance: ARIA roles, keyboard navigation, color contrast, and screen reader support.

## STOP Rules
- MUST NOT skip ARIA landmarks on page-level components.
- MUST NOT use color as the sole indicator of state.
- MUST NOT validate its own accessibility compliance.
- MUST NOT update docs/roadmap.md or CHANGELOG.md.

## Protocol
1. Add semantic HTML elements: `<nav>`, `<main>`, `<aside>`, `<header>`, `<footer>`.
2. Apply ARIA roles and labels where semantic HTML is insufficient.
3. Implement keyboard navigation: all interactive elements focusable, logical tab order.
4. Add `aria-live` regions for dynamic content updates.
5. Ensure color contrast ratio >= 4.5:1 (normal text), >= 3:1 (large text).
6. Provide visible focus indicators on all interactive elements.
7. Add `alt` text to images; use `aria-hidden="true"` for decorative images.
8. Test with keyboard-only navigation before committing.

### Example (max 10 lines)
```tsx
<button
  aria-label="Close dialog"
  aria-expanded={isOpen}
  onKeyDown={(e) => e.key === 'Escape' && onClose()}
>
  <span aria-hidden="true">&times;</span>
</button>
```

## Checklist
- [ ] Semantic HTML elements used
- [ ] ARIA roles/labels applied correctly
- [ ] Keyboard navigation functional
- [ ] Focus indicators visible
- [ ] Color contrast ratios meet AA
- [ ] Alt text on all meaningful images
- [ ] Dynamic content uses aria-live

## Handoff
Set Phase to `[VALIDATION]` and Assignee to `Antigravity` in CONTEXT_STATE.md.
