# Skill: TypeScript Language Patterns

## Metadata
- **ID:** SKL-CODEX-013
- **Agents:** codex
- **Token Budget:** extended
- **Source:** everything-claude-code
- **Pillars:** N/A

## Purpose
Apply TypeScript strict mode, advanced type patterns, module resolution, and utility types for type-safe production code.

## STOP Rules
- MUST NOT use `any` type; use `unknown` with type guards instead.
- MUST NOT disable strict mode or suppress errors with `@ts-ignore`.
- MUST NOT validate its own TypeScript code as production-ready.
- MUST NOT update docs/roadmap.md or CHANGELOG.md.
- MUST NOT determine versioning.

## Protocol

### Strict Mode
1. Enable `strict: true` in `tsconfig.json`; never disable individual strict flags.
2. Enable `noUncheckedIndexedAccess` for safe array/object access.
3. Enable `exactOptionalProperties` to distinguish `undefined` from missing.
4. Run `tsc --noEmit` before committing to catch type errors.

### Type Patterns
1. Use discriminated unions for state modeling: `type State = { status: 'loading' } | { status: 'done'; data: T }`.
2. Use branded types for domain primitives: `type UserId = string & { __brand: 'UserId' }`.
3. Prefer `interface` for object shapes that may be extended; use `type` for unions and intersections.
4. Use `satisfies` operator for type-safe object literals with inferred types.
5. Use `as const` for literal type inference on constants.

### Utility Types
1. Use `Pick`, `Omit`, `Partial`, `Required` for type derivation.
2. Use `Record<K, V>` for typed dictionaries.
3. Use `Extract`, `Exclude` for union type manipulation.
4. Create custom mapped types for repetitive transformations.

### Module Resolution
1. Use path aliases in `tsconfig.json`: `"@/*": ["./src/*"]`.
2. Use barrel exports (`index.ts`) for public module APIs.
3. Keep internal types in co-located `.types.ts` files.
4. Prefer `import type` for type-only imports to avoid runtime overhead.

### Example (max 10 lines)
```ts
type Result<T, E = Error> =
  | { ok: true; data: T }
  | { ok: false; error: E };

function unwrap<T>(result: Result<T>): T {
  if (!result.ok) throw result.error;
  return result.data;
}
```

## Checklist
- [ ] `strict: true` enabled in tsconfig.json
- [ ] No `any` types; `unknown` with guards used
- [ ] Discriminated unions for state modeling
- [ ] `import type` for type-only imports
- [ ] Path aliases configured and consistent
- [ ] `tsc --noEmit` passes before commit

## Handoff
Set Phase to `[VALIDATION]` and Assignee to `Antigravity` in CONTEXT_STATE.md.
