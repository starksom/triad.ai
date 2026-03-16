# Skill: Performance Patterns

## Metadata
- **ID:** SKL-CODEX-005
- **Agents:** codex
- **Token Budget:** extended
- **Source:** web-quality-skills
- **Pillars:** P2-PERF

## Purpose
Apply performance optimization patterns: lazy loading, code splitting, image optimization, bundle analysis, and memoization.

## STOP Rules
- MUST NOT skip performance profiling before optimizing.
- MUST NOT introduce premature optimization without measurable justification.
- MUST NOT validate its own performance improvements as sufficient.
- MUST NOT update docs/roadmap.md or CHANGELOG.md.
- MUST NOT determine versioning.

## Protocol

### Lazy Loading
1. Identify below-the-fold components and non-critical routes.
2. Apply `React.lazy()` with `Suspense` boundary and fallback.
3. Use `loading="lazy"` for images and iframes.
4. Implement Intersection Observer for custom lazy triggers.

### Code Splitting
1. Split routes using dynamic `import()`.
2. Extract vendor chunks via build config (webpack/vite `splitChunks`).
3. Separate locale/i18n bundles.
4. Verify chunk sizes remain under 250KB gzipped.

### Image Optimization
1. Use `next/image` or `<picture>` with `srcset` for responsive images.
2. Serve WebP/AVIF with fallback to PNG/JPEG.
3. Set explicit `width`/`height` to prevent layout shift.
4. Compress assets to target < 100KB per hero image.

### Bundle Analysis
1. Run `npx webpack-bundle-analyzer` or `npx vite-bundle-visualizer`.
2. Identify dependencies > 50KB; evaluate tree-shaking or replacement.
3. Eliminate unused exports with `sideEffects: false` in package.json.

### Memoization
1. Use `React.memo()` for pure presentational components.
2. Apply `useMemo` for expensive derived computations.
3. Apply `useCallback` for event handlers passed as props.
4. Avoid memoizing trivial operations.

### Example (max 10 lines)
```tsx
const Dashboard = React.lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <Suspense fallback={<Skeleton />}>
      <Dashboard />
    </Suspense>
  );
}
```

## Checklist
- [ ] Lazy loading applied to non-critical routes
- [ ] Code splitting configured per route
- [ ] Images optimized with responsive srcset
- [ ] Bundle size analyzed, no chunk > 250KB gz
- [ ] Memoization applied where profiling justifies
- [ ] No premature optimizations without data

## Handoff
Set Phase to `[VALIDATION]` and Assignee to `Antigravity` in CONTEXT_STATE.md.
