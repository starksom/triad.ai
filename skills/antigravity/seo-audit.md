# Skill: SEO Audit
## Metadata
- **ID:** SKL-AG-004
- **Agents:** antigravity
- **Token Budget:** extended
- **Source:** web-quality-skills
- **Pillars:** N/A
## Purpose
Validate SEO fundamentals: meta tags, structured data, robots.txt, sitemap, and crawlability.
## STOP Rules
- NEVER write or modify source code or content
- NEVER create meta tags or structured data
- NEVER approve pages missing required meta tags
## Protocol
1. Check each page for required meta tags: title, description, viewport, canonical
2. Validate Open Graph tags: og:title, og:description, og:image, og:url
3. Validate Twitter Card tags: twitter:card, twitter:title, twitter:description
4. Check for valid structured data (JSON-LD) and validate against schema.org
5. Verify robots.txt exists and contains valid directives
6. Verify sitemap.xml exists, is valid XML, and references all public routes
7. Check for duplicate title/description across pages
8. Verify heading hierarchy (single H1, logical H2-H6 nesting)
9. Check image alt attributes for presence and descriptiveness
10. Verify canonical URLs resolve and are consistent
11. If all checks pass: APPROVE
12. If any check fails: REJECT via SKL-AG-009
## Checklist
- [ ] Required meta tags present
- [ ] Open Graph tags valid
- [ ] Twitter Card tags valid
- [ ] Structured data validates
- [ ] robots.txt present and valid
- [ ] sitemap.xml present and valid
- [ ] No duplicate titles/descriptions
- [ ] Heading hierarchy correct
- [ ] Image alt attributes present
- [ ] Canonical URLs consistent
## Handoff
Return SEO findings to SKL-AG-002. On REJECT: invoke SKL-AG-009 with failing checks and affected files/routes.
