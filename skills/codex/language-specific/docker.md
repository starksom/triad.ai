# Skill: Docker Patterns

## Metadata
- **ID:** SKL-CODEX-015
- **Agents:** codex
- **Token Budget:** extended
- **Source:** everything-claude-code
- **Pillars:** P2-SEC, P2-PERF

## Purpose
Apply Docker best practices: multi-stage builds, security scanning, compose patterns, and slim image optimization for production containers.

## STOP Rules
- MUST NOT run containers as root in production images.
- MUST NOT include build tools or dev dependencies in final stage.
- MUST NOT hardcode secrets in Dockerfiles or compose files.
- MUST NOT validate its own Docker configurations as production-ready.
- MUST NOT update docs/roadmap.md or CHANGELOG.md.

## Protocol

### Multi-Stage Builds
1. Use separate stages: `builder` for compilation, `runtime` for final image.
2. Copy only built artifacts from builder to runtime stage.
3. Use specific base image tags; never use `latest`.
4. Order layers by change frequency: system deps -> app deps -> source code.

### Slim Images
1. Use Alpine, Distroless, or `-slim` base images for runtime.
2. Combine `RUN` commands with `&&` to reduce layers.
3. Clean package manager caches in the same `RUN` layer.
4. Use `.dockerignore` to exclude `node_modules`, `.git`, `dist/`, test files.
5. Target final image size < 200MB for application containers.

### Security
1. Create and use a non-root user: `RUN adduser --disabled-password appuser`.
2. Set `USER appuser` before `CMD`/`ENTRYPOINT`.
3. Scan images with `docker scout cves` or `trivy` before pushing.
4. Pin base image digests for reproducible builds in CI.
5. Never `COPY` `.env` files; use runtime environment injection.
6. Set `HEALTHCHECK` instruction for container orchestration.

### Compose Patterns
1. Use `docker-compose.yml` for local dev; separate `compose.prod.yml` for production.
2. Define named volumes for persistent data.
3. Use `depends_on` with `condition: service_healthy` for startup ordering.
4. Set resource limits: `mem_limit`, `cpus` for each service.
5. Use `profiles` to group optional services (monitoring, debug tools).

### Example (max 10 lines)
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

FROM node:20-alpine
RUN adduser --disabled-password appuser
USER appuser
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/index.js"]
```

## Checklist
- [ ] Multi-stage build separates build/runtime
- [ ] Final image uses slim/distroless base
- [ ] Non-root user configured
- [ ] No secrets in Dockerfile or compose
- [ ] `.dockerignore` excludes dev artifacts
- [ ] Image scanned for vulnerabilities
- [ ] Health check defined

## Handoff
Set Phase to `[VALIDATION]` and Assignee to `Antigravity` in CONTEXT_STATE.md.
