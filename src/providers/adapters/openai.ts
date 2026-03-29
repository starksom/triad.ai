import { detectProviderConfig } from '../detector.js';
import type { LLMProvider } from '../types.js';

export const openAIProvider: LLMProvider = {
  config: {
    id: 'openai',
    displayName: 'OpenAI',
    envVars: ['OPENAI_API_KEY'],
    costTier: 'medium',
  },
  detect: () => detectProviderConfig(openAIProvider.config),
};
