# Skill: UX Requirements
## Metadata
- **ID:** SKL-CC-003
- **Agents:** claude_code
- **Token Budget:** standard
- **Source:** web-quality-skills
- **Pillars:** N/A
## Purpose
Define UX requirements as UX Visionary. Light Theme mandatory, responsive breakpoints for all form factors, accessibility compliance.
## STOP Rules
- Claude Code NEVER writes application source code
- Do not write CSS, HTML, or any frontend code
- Do not create design files
- Define requirements only
## Protocol
1. All interfaces MUST use Light Theme (no dark mode default)
2. Define responsive breakpoints: Ultrawide 2560px (21:9), Desktop 1920px (16:9), Tablet landscape 1024px (4:3), Tablet portrait 768px (iPad/Samsung), Mobile 480px (vertical)
3. Minimum touch targets: 44x44px on all interactive elements
4. Typography: minimum 16px body text, 1.5 line-height
5. Color contrast: WCAG AA minimum (4.5:1 for text, 3:1 for large text)
6. Motion: respect prefers-reduced-motion media query
## Checklist
- [ ] Light Theme specified as mandatory
- [ ] All 5 breakpoints defined
- [ ] 44x44px touch targets specified
- [ ] Typography minimums set
- [ ] Color contrast ratios defined
- [ ] Motion preferences considered
## Handoff
UX requirements documented. Codex implements using responsive-ux skill.
