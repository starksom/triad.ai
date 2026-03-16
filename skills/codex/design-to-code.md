# Skill: Design-to-Code

## Metadata
- **ID:** SKL-CODEX-002
- **Agents:** codex
- **Token Budget:** standard
- **Source:** stitch-skills
- **Pillars:** P2-UX

## Purpose
Transform design system artifacts and Figma tokens into production-ready UI components following established design token patterns.

## STOP Rules
- MUST NOT create or modify design tokens without architect approval.
- MUST NOT deviate from the approved design system.
- MUST NOT validate its own design fidelity.
- MUST NOT update docs/roadmap.md or CHANGELOG.md.

## Protocol
1. Read design spec from the story: Figma link, token file, or mockup reference.
2. Extract design tokens (colors, spacing, typography, elevation) from `tokens/` directory.
3. Map tokens to CSS custom properties or theme variables.
4. Generate component skeleton matching the design hierarchy.
5. Apply token-based styles; avoid hardcoded values.
6. Verify visual structure matches design spec at primary breakpoints.
7. Export component with typed props interface.

### Example (max 10 lines)
```tsx
// tokens/spacing.ts → component usage
import { spacing } from '@/tokens';

const Card = styled.div`
  padding: ${spacing.md};
  gap: ${spacing.sm};
  border-radius: ${radius.lg};
`;
```

## Checklist
- [ ] Design tokens extracted and mapped
- [ ] No hardcoded color/spacing values
- [ ] Component matches design hierarchy
- [ ] Props interface typed
- [ ] Token overrides use theme variables

## Handoff
Set Phase to `[VALIDATION]` and Assignee to `Antigravity` in CONTEXT_STATE.md.
