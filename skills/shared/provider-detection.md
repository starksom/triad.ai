# Skill: Provider Detection

## Metadata
- **ID:** SKL-SHARED-008
- **Agents:** shared
- **Token Budget:** compact
- **Maturity:** stable
- **Runtime Scope:** implemented in `src/providers/*` and `triad providers*` CLI
- **Pillars:** [P2-13]

## Purpose
Detect available providers using local signals (env vars + optional local binaries) and expose availability to orchestration flows.

## STOP Rules
- MUST NOT hardcode API keys or credentials
- MUST NOT perform remote API calls during detection
- MUST NOT fail pipeline execution when no providers are detected

## Runtime Protocol (Current)
1. Use `triad providers detect` for full scan, or `triad providers detect <id>` for targeted checks.
2. Detection validates configured env vars and optional `localBinary` presence.
3. Availability is exposed through `ProviderRegistry.listAvailable()`.
4. `triad providers` prints currently available providers.

## Checklist
- [ ] Env var checks are non-blocking
- [ ] Local binary checks fail gracefully
- [ ] CLI output never exposes credential values
- [ ] No-provider state is handled cleanly

## Handoff
Results feed provider selection for `triad multi-model`.
