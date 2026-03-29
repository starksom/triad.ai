import { detectProviderConfig } from '../detector.js';
import type { LLMProvider } from '../types.js';

export const openRouterProvider: LLMProvider = {
  config: {
    id: 'openrouter',
    displayName: 'OpenRouter',
    envVars: ['OPENROUTER_API_KEY'],
    costTier: 'low',
  },
  detect: () => detectProviderConfig(openRouterProvider.config),
};
