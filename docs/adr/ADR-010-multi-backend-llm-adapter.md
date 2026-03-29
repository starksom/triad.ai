# ADR-010: Multi-Backend LLM Adapter Pattern

- **Status:** Accepted
- **Date:** 2026-03-29
- **Owners:** Triad Core
- **Related Pillar:** [P2-13]

## Context
Triad needed a runtime-safe way to detect and use multiple LLM providers without hard dependencies on every external SDK.
The framework also needed to run with degraded capability when no provider credentials are present.

## Decision
Adopt a registry-based adapter model where each provider implements `LLMProvider` with a `config` payload and `detect()` capability.

Implemented shape:
- Registry API: `register()`, `get()`, `detect()`, `listAvailable()`.
- Detection strategy: environment-variable checks + optional local binary availability checks.
- Supported default adapters: Anthropic, OpenAI, Gemini, Mistral, Ollama, OpenRouter.
- Cost classification is normalized as: `free | low | medium | high | premium`.

## Consequences
### Positive
- Zero-config bootstrap is preserved: system runs even when providers are unavailable.
- Provider onboarding is extensible with `register()`.
- CLI visibility (`triad providers`, `triad providers detect`) gives operational transparency.

### Negative / Trade-offs
- Detection currently validates presence, not live API call health.
- Cost tiers differ from earlier docs (`premium/standard/economy`) and now use 5-level tiers.

## Rollback
If this pattern becomes too restrictive:
1. Keep CLI contracts stable (`triad providers*`).
2. Replace registry internals with direct provider invocation behind same exported API.
3. Deprecate custom adapters over 1 minor release and migrate consumers gradually.
