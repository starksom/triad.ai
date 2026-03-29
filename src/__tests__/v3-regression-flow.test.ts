import { describe, it, expect } from '@jest/globals';
import {
  DEFAULT_CONFIG,
  getFeatureFlags,
  isV31ModuleEnabled,
  resolveModuleBehavior,
  type V31FeatureModule,
} from '../utils/config.js';

describe('v3.0 regression flow compatibility', () => {
  const modules: V31FeatureModule[] = ['multiProvider', 'multiModel', 'consensus', 'router', 'darkFactory'];

  it('keeps all v3.1 modules disabled by default (flags OFF)', () => {
    const flags = getFeatureFlags(DEFAULT_CONFIG);

    expect(flags).toEqual({
      multiProvider: false,
      multiModel: false,
      consensus: false,
      router: false,
      darkFactory: false,
    });
  });

  it('explicitly resolves to v3.0 behavior when flags are OFF', () => {
    for (const moduleName of modules) {
      expect(isV31ModuleEnabled(DEFAULT_CONFIG, moduleName)).toBe(false);
      expect(resolveModuleBehavior(DEFAULT_CONFIG, moduleName)).toBe('v3.0');
    }
  });

  it('switches only the selected module to v3.1 behavior when enabled', () => {
    const config = {
      ...DEFAULT_CONFIG,
      featureFlags: {
        ...DEFAULT_CONFIG.featureFlags,
        consensus: true,
      },
    };

    expect(resolveModuleBehavior(config, 'consensus')).toBe('v3.1');
    expect(resolveModuleBehavior(config, 'multiProvider')).toBe('v3.0');
    expect(resolveModuleBehavior(config, 'multiModel')).toBe('v3.0');
    expect(resolveModuleBehavior(config, 'router')).toBe('v3.0');
    expect(resolveModuleBehavior(config, 'darkFactory')).toBe('v3.0');
  });
});
