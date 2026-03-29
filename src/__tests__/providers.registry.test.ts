import { describe, expect, it } from '@jest/globals';

import { detect, get, register } from '../providers/registry.js';
import type { LLMProvider } from '../providers/types.js';

describe('providers/registry', () => {
  it('has default providers registered', () => {
    expect(get('openai')).toBeDefined();
    expect(get('anthropic')).toBeDefined();
    expect(get('ollama')).toBeDefined();
  });

  it('registers and retrieves a provider', () => {
    const customProvider: LLMProvider = {
      config: {
        id: 'custom',
        displayName: 'Custom Provider',
        envVars: [],
        costTier: 'free',
      },
      detect: () => ({
        id: 'custom',
        displayName: 'Custom Provider',
        available: true,
        envSatisfied: true,
        localAvailable: true,
        missingEnvVars: [],
        costTier: 'free',
      }),
    };

    register(customProvider);
    expect(get('custom')).toBe(customProvider);
  });

  it('detects a specific provider', () => {
    const result = detect('openai');

    expect(Array.isArray(result)).toBe(false);
    if (!Array.isArray(result)) {
      expect(result.id).toBe('openai');
      expect(result.displayName).toBe('OpenAI');
    }
  });

  it('detects all providers', () => {
    const result = detect();

    expect(Array.isArray(result)).toBe(true);
    if (Array.isArray(result)) {
      expect(result.length).toBeGreaterThanOrEqual(6);
    }
  });
});
