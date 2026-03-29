import { describe, expect, it } from '@jest/globals';

import { detectProviderConfig, validateEnvVars } from '../providers/detector.js';

describe('providers/detector', () => {
  it('validates missing env vars', () => {
    const result = validateEnvVars(['OPENAI_API_KEY'], {});
    expect(result.envSatisfied).toBe(false);
    expect(result.missingEnvVars).toEqual(['OPENAI_API_KEY']);
  });

  it('detects provider availability based on env vars', () => {
    const result = detectProviderConfig(
      {
        id: 'openai',
        displayName: 'OpenAI',
        envVars: ['OPENAI_API_KEY'],
        costTier: 'medium',
      },
      { OPENAI_API_KEY: 'test-key' }
    );

    expect(result.available).toBe(true);
    expect(result.reason).toBeUndefined();
  });

  it('marks provider unavailable when env vars are missing', () => {
    const result = detectProviderConfig(
      {
        id: 'anthropic',
        displayName: 'Anthropic',
        envVars: ['ANTHROPIC_API_KEY'],
        costTier: 'high',
      },
      {}
    );

    expect(result.available).toBe(false);
    expect(result.reason).toContain('ANTHROPIC_API_KEY');
  });
});
