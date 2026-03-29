import { detectProviderConfig } from '../detector.js';
import type { LLMProvider } from '../types.js';

export const anthropicProvider: LLMProvider = {
  config: {
    id: 'anthropic',
    displayName: 'Anthropic',
    envVars: ['ANTHROPIC_API_KEY'],
    costTier: 'high',
  },
  detect: () => detectProviderConfig(anthropicProvider.config),
};
