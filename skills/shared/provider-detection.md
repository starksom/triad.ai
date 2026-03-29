# Skill: Provider Detection

## Metadata
- **ID:** SKL-SHARED-008
- **Agents:** shared
- **Token Budget:** compact
- **Source:** claude-octopus (adapted)
- **Pillars:** [P2-13]

## Purpose
Auto-detect available LLM providers at initialization by scanning environment variables and CLI availability. Enable zero-config bootstrap where Claude works alone and additional providers enhance capabilities progressively.

## STOP Rules
- MUST NOT hardcode API keys or credentials
- MUST NOT fail if no external providers are detected (Claude is always available)
- MUST NOT attempt API calls during detection (check env vars and CLI only)

## Protocol
1. Check environment variables: `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GOOGLE_API_KEY`, `MISTRAL_API_KEY`, `OPENROUTER_API_KEY`
2. Check CLI availability: `ollama list` for local models
3. Classify detected providers by cost tier: premium, standard, economy
4. Register available providers in `ProviderRegistry`
5. Report detection results via `triad providers` CLI output

## Checklist
- [ ] All env var checks are non-blocking
- [ ] Ollama detection handles missing CLI gracefully
- [ ] Provider count and tier summary reported
- [ ] No credentials logged or exposed

## Handoff
Detection results available to all agents via `ProviderRegistry.listAvailable()`.
