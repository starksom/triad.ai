# Skill: React & Next.js Patterns

## Metadata
- **ID:** SKL-CODEX-014
- **Agents:** codex
- **Token Budget:** extended
- **Source:** everything-claude-code
- **Pillars:** P2-UX, P2-PERF

## Purpose
Apply Next.js App Router patterns: SSR/SSG, Server Components, client boundaries, and rendering optimization for production React applications.

## STOP Rules
- MUST NOT use `'use client'` on components that can remain Server Components.
- MUST NOT fetch data in client components when server-side fetching is viable.
- MUST NOT validate its own Next.js code as production-ready.
- MUST NOT update docs/roadmap.md or CHANGELOG.md.
- MUST NOT determine versioning.

## Protocol

### App Router Structure
1. Use `app/` directory with file-based routing: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`.
2. Define `layout.tsx` at each route segment for shared UI.
3. Use `route.ts` for API endpoints within `app/api/`.
4. Co-locate components in route folders; shared components in `@/components/`.

### Server Components
1. Default all components to Server Components; add `'use client'` only when needed.
2. Fetch data directly in Server Components using `async` functions.
3. Use `cache()` and `revalidateTag()` for fine-grained cache control.
4. Pass serializable props from Server to Client Components.

### Client Components
1. Add `'use client'` only for: event handlers, hooks, browser APIs, third-party client libs.
2. Keep client components small; push logic to Server Components or hooks.
3. Use `useOptimistic` and `useFormStatus` for form interactions.

### SSR/SSG/ISR
1. Use `generateStaticParams()` for static generation of dynamic routes.
2. Use `revalidate` export or `fetch({ next: { revalidate: N } })` for ISR.
3. Use `dynamic = 'force-dynamic'` only when real-time data is required.
4. Prefer static generation; fall back to SSR only when necessary.

### Optimization
1. Use `next/image` for all images with width/height or fill.
2. Use `next/font` for font optimization with `display: 'swap'`.
3. Use `next/link` for client-side navigation with prefetching.
4. Implement `loading.tsx` for Suspense-based streaming.
5. Use `next/dynamic` for heavy client components with `ssr: false` when appropriate.

### Example (max 10 lines)
```tsx
// app/users/[id]/page.tsx
export default async function UserPage({ params }: { params: { id: string } }) {
  const user = await getUser(params.id);
  return (
    <main>
      <h1>{user.name}</h1>
      <UserActivity userId={user.id} />
    </main>
  );
}
```

## Checklist
- [ ] Server Components used by default
- [ ] `'use client'` only where required
- [ ] Data fetched server-side when possible
- [ ] `next/image`, `next/font`, `next/link` used
- [ ] Static generation preferred over SSR
- [ ] `loading.tsx` and `error.tsx` defined per route

## Handoff
Set Phase to `[VALIDATION]` and Assignee to `Antigravity` in CONTEXT_STATE.md.
