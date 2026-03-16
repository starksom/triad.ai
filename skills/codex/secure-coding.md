# Skill: Secure Coding

## Metadata
- **ID:** SKL-CODEX-007
- **Agents:** codex
- **Token Budget:** compact
- **Source:** snyk-recipes + OWASP
- **Pillars:** P2-SEC

## Purpose
Apply secure coding practices: input sanitization, parameterized queries, output encoding, dependency injection, and secret management.

## STOP Rules
- MUST NOT hardcode secrets, tokens, or credentials.
- MUST NOT use string concatenation for SQL/NoSQL queries.
- MUST NOT disable security headers or CSP.
- MUST NOT validate its own security posture.
- MUST NOT determine versioning.

## Protocol
1. Sanitize all user input at the boundary layer; use allowlists over denylists.
2. Use parameterized queries or ORM-prepared statements for all DB operations.
3. Encode output contextually: HTML, URL, JavaScript, CSS as appropriate.
4. Inject dependencies via constructor or module DI; avoid service locators.
5. Store secrets in environment variables or vault; reference via config.
6. Set security headers: `Content-Security-Policy`, `X-Content-Type-Options`, `Strict-Transport-Security`.
7. Validate and sanitize file uploads: type, size, content scanning.

## Checklist
- [ ] No hardcoded secrets in source
- [ ] All queries parameterized
- [ ] Input sanitized at boundaries
- [ ] Output encoding applied
- [ ] Dependencies injected, not located
- [ ] Security headers configured

## Handoff
Set Phase to `[VALIDATION]` and Assignee to `Antigravity` in CONTEXT_STATE.md.
