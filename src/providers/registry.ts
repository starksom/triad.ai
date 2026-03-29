import { defaultProviders } from './adapters/index.js';
import { detectProvider } from './detector.js';
import type { LLMProvider, ProviderResponse } from './types.js';

const providers = new Map<string, LLMProvider>();

for (const provider of defaultProviders) {
  providers.set(provider.config.id, provider);
}

export function register(provider: LLMProvider): void {
  providers.set(provider.config.id, provider);
}

export function get(id: string): LLMProvider | undefined {
  return providers.get(id);
}

export function detect(id?: string): ProviderResponse[] | ProviderResponse {
  if (id) {
    const provider = providers.get(id);
    if (!provider) {
      throw new Error(`Unknown provider: ${id}`);
    }
    return detectProvider(provider);
  }

  return Array.from(providers.values()).map((provider) => detectProvider(provider));
}

export function listAvailable(): LLMProvider[] {
  return Array.from(providers.values()).filter((provider) => detectProvider(provider).available);
}
