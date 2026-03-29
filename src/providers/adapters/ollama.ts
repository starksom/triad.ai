import { detectProviderConfig } from '../detector.js';
import type { LLMProvider } from '../types.js';

export const ollamaProvider: LLMProvider = {
  config: {
    id: 'ollama',
    displayName: 'Ollama',
    envVars: [],
    localBinary: 'ollama',
    costTier: 'free',
  },
  detect: () => detectProviderConfig(ollamaProvider.config),
};
