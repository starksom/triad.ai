# Skill: React Component Generation

## Metadata
- **ID:** SKL-CODEX-003
- **Agents:** codex
- **Token Budget:** standard
- **Source:** stitch-skills
- **Pillars:** P2-UX

## Purpose
Generate React components following established hierarchy patterns, typed props interfaces, and composition conventions.

## STOP Rules
- MUST NOT create components outside the approved architecture.
- MUST NOT skip TypeScript typing for props.
- MUST NOT validate its own component output as production-ready.
- MUST NOT determine versioning.

## Protocol
1. Read component spec from story: name, purpose, parent/child relationships.
2. Create component file in the designated directory structure.
3. Define props interface with TypeScript; use `React.FC<Props>` or function declaration.
4. Implement component hierarchy: container → presenter → primitive.
5. Apply composition patterns: children, render props, or slots as specified.
6. Add default exports and re-export from barrel index.
7. Write co-located unit test stub.

### Example (max 10 lines)
```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ variant, size = 'md', children, onClick }) => (
  <button className={cn(styles[variant], styles[size])} onClick={onClick}>{children}</button>
);
```

## Checklist
- [ ] Props interface fully typed
- [ ] Component follows hierarchy pattern
- [ ] Barrel index updated
- [ ] Co-located test stub created
- [ ] No `any` types used

## Handoff
Set Phase to `[VALIDATION]` and Assignee to `Antigravity` in CONTEXT_STATE.md.
