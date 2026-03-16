# Skill: Security Baseline

## Metadata
- **ID:** SKL-SHARED-007
- **Agents:** shared
- **Token Budget:** compact
- **Source:** snyk/studio-recipes + OWASP
- **Pillars:** N/A

## Purpose
Baseline security checks every agent applies regardless of role.

## STOP Rules
- Never approve code with hardcoded secrets.
- Never skip input sanitization at boundaries.

## Protocol
1. No hardcoded secrets, API keys, tokens, or passwords in source
2. No `eval()`, `innerHTML`, or dynamic SQL construction
3. All user input sanitized at system boundaries
4. Dependencies checked for known vulnerabilities before adding
5. CORS, CSP, and security headers configured for web apps
6. Authentication tokens stored securely (httpOnly cookies or secure storage)
7. Sensitive data never logged or exposed in error messages

## Checklist
- [ ] No secrets in source code
- [ ] No eval/innerHTML/dynamic SQL
- [ ] Input sanitization at boundaries
- [ ] Dependencies vulnerability-checked
- [ ] Security headers configured
- [ ] Auth tokens stored securely
- [ ] No sensitive data in logs

## Handoff
Security baseline verified. Proceed with role-specific work.
