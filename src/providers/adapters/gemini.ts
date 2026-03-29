import { detectProviderConfig } from '../detector.js';
import type { LLMProvider } from '../types.js';

export const geminiProvider: LLMProvider = {
  config: {
    id: 'gemini',
    displayName: 'Gemini',
    envVars: ['GEMINI_API_KEY'],
    costTier: 'medium',
  },
  detect: () => detectProviderConfig(geminiProvider.config),
};
