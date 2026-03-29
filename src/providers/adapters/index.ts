import type { LLMProvider } from '../types.js';

import { anthropicProvider } from './anthropic.js';
import { openAIProvider } from './openai.js';
import { geminiProvider } from './gemini.js';
import { openRouterProvider } from './openrouter.js';
import { mistralProvider } from './mistral.js';
import { ollamaProvider } from './ollama.js';

export const defaultProviders: LLMProvider[] = [
  anthropicProvider,
  openAIProvider,
  geminiProvider,
  openRouterProvider,
  mistralProvider,
  ollamaProvider,
];
