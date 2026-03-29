import { spawnSync } from 'node:child_process';

import type { LLMProvider, ProviderConfig, ProviderResponse } from './types.js';

export function validateEnvVars(envVars: string[], env: NodeJS.ProcessEnv = process.env): {
  envSatisfied: boolean;
  missingEnvVars: string[];
} {
  const missingEnvVars = envVars.filter((envVar) => !env[envVar] || env[envVar]?.trim() === '');

  return {
    envSatisfied: missingEnvVars.length === 0,
    missingEnvVars,
  };
}

export function checkLocalAvailability(localBinary?: string): boolean {
  if (!localBinary) {
    return true;
  }

  const result = spawnSync(localBinary, ['--version'], { stdio: 'ignore' });
  if (!result.error && result.status === 0) {
    return true;
  }

  const fallback = spawnSync('which', [localBinary], { stdio: 'ignore' });
  return !fallback.error && fallback.status === 0;
}

export function detectProviderConfig(
  config: ProviderConfig,
  env: NodeJS.ProcessEnv = process.env
): ProviderResponse {
  const envCheck = validateEnvVars(config.envVars, env);
  const localAvailable = checkLocalAvailability(config.localBinary);
  const available = envCheck.envSatisfied && localAvailable;

  let reason: string | undefined;
  if (!envCheck.envSatisfied) {
    reason = `Missing env vars: ${envCheck.missingEnvVars.join(', ')}`;
  } else if (!localAvailable && config.localBinary) {
    reason = `${config.localBinary} is not available locally`;
  }

  return {
    id: config.id,
    displayName: config.displayName,
    available,
    envSatisfied: envCheck.envSatisfied,
    localAvailable,
    missingEnvVars: envCheck.missingEnvVars,
    costTier: config.costTier,
    reason,
  };
}

export function detectProvider(provider: LLMProvider, env: NodeJS.ProcessEnv = process.env): ProviderResponse {
  return detectProviderConfig(provider.config, env);
}
