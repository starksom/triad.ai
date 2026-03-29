import { detectProviderConfig } from '../detector.js';
import type { LLMProvider } from '../types.js';

export const mistralProvider: LLMProvider = {
  config: {
    id: 'mistral',
    displayName: 'Mistral',
    envVars: ['MISTRAL_API_KEY'],
    costTier: 'low',
  },
  detect: () => detectProviderConfig(mistralProvider.config),
};
