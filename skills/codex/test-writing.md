# Skill: Test Writing

## Metadata
- **ID:** SKL-CODEX-008
- **Agents:** codex
- **Token Budget:** standard
- **Source:** claude-code-skills
- **Pillars:** N/A

## Purpose
Write unit, integration, and e2e tests following TDD patterns with defined coverage requirements.

## STOP Rules
- MUST NOT skip test writing for any new feature code.
- MUST NOT mark tests as `.skip` or `xit` without a linked issue.
- MUST NOT validate its own test coverage as sufficient.
- MUST NOT update docs/roadmap.md or CHANGELOG.md.

## Protocol
1. Write failing test first (Red phase): define expected behavior from acceptance criteria.
2. Implement minimum code to pass (Green phase).
3. Refactor while keeping tests green (Refactor phase).
4. Unit tests: isolate with mocks/stubs; one assertion focus per test.
5. Integration tests: test module boundaries; use test containers or in-memory DB.
6. E2E tests: cover critical user flows; use Playwright or Cypress.
7. Target coverage: >= 80% line, >= 70% branch.
8. Name tests descriptively: `should [expected] when [condition]`.

### Example (max 10 lines)
```ts
describe('calculateTotal', () => {
  it('should return sum of item prices when cart has items', () => {
    const cart = [{ price: 10 }, { price: 20 }];
    expect(calculateTotal(cart)).toBe(30);
  });

  it('should return 0 when cart is empty', () => {
    expect(calculateTotal([])).toBe(0);
  });
});
```

## Checklist
- [ ] Tests written before or alongside code
- [ ] Unit tests isolate dependencies
- [ ] Integration tests cover module boundaries
- [ ] E2E tests cover critical flows
- [ ] Coverage >= 80% line, >= 70% branch
- [ ] No skipped tests without linked issue

## Handoff
Set Phase to `[VALIDATION]` and Assignee to `Antigravity` in CONTEXT_STATE.md.
