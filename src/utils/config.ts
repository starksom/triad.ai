/**
 * Configuration management for .triad/config.json.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';

export interface TriadConfig {
  version: number;
  stateGraph: string;
  checkpoints: {
    backend: 'file' | 'sqlite';
    directory: string;
    sqlitePath?: string;
  };
  tracing: {
    backend: 'auto' | 'langfuse' | 'local';
    langfuse: {
      publicKey: string;
      secretKey: string;
      host: string;
    };
    localDirectory: string;
  };
  retry: {
    maxRetries: number;
    autoRetry: boolean;
    escalateToPlanning: boolean;
  };
  git: {
    autoCommit: boolean;
    commitPrefix: string;
  };
  dashboard: {
    port: number;
    host: string;
  };
}

const DEFAULT_CONFIG: TriadConfig = {
  version: 1,
  stateGraph: 'src/state-graph/graph.json',
  checkpoints: {
    backend: 'file',
    directory: '.triad/checkpoints',
  },
  tracing: {
    backend: 'auto',
    langfuse: {
      publicKey: '',
      secretKey: '',
      host: 'https://cloud.langfuse.com',
    },
    localDirectory: '.triad/traces',
  },
  retry: {
    maxRetries: 3,
    autoRetry: true,
    escalateToPlanning: true,
  },
  git: {
    autoCommit: true,
    commitPrefix: 'triad:',
  },
  dashboard: {
    port: 3000,
    host: 'localhost',
  },
};

/**
 * Load config from .triad/config.json, creating defaults if missing.
 */
export function loadConfig(projectRoot: string): TriadConfig {
  const configPath = getConfigPath(projectRoot);

  if (!existsSync(configPath)) {
    return { ...DEFAULT_CONFIG };
  }

  const raw = JSON.parse(readFileSync(configPath, 'utf-8'));
  return { ...DEFAULT_CONFIG, ...raw };
}

/**
 * Save config to .triad/config.json.
 */
export function saveConfig(projectRoot: string, config: TriadConfig): void {
  const configPath = getConfigPath(projectRoot);
  const dir = dirname(configPath);

  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n', 'utf-8');
}

/**
 * Get a single config value by dot-separated key path.
 */
export function getConfigValue(config: TriadConfig, keyPath: string): unknown {
  const keys = keyPath.split('.');
  let current: unknown = config;

  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }

  return current;
}

/**
 * Set a single config value by dot-separated key path.
 */
export function setConfigValue(config: TriadConfig, keyPath: string, value: unknown): TriadConfig {
  const keys = keyPath.split('.');
  const result = structuredClone(config);
  let current: Record<string, unknown> = result as unknown as Record<string, unknown>;

  for (let i = 0; i < keys.length - 1; i++) {
    if (!(keys[i] in current) || typeof current[keys[i]] !== 'object') {
      current[keys[i]] = {};
    }
    current = current[keys[i]] as Record<string, unknown>;
  }

  current[keys[keys.length - 1]] = value;
  return result as unknown as TriadConfig;
}

/**
 * Return config with secrets redacted (for dashboard API).
 */
export function redactSecrets(config: TriadConfig): TriadConfig {
  const redacted = structuredClone(config);
  if (redacted.tracing.langfuse.secretKey) {
    redacted.tracing.langfuse.secretKey = '***REDACTED***';
  }
  if (redacted.tracing.langfuse.publicKey) {
    redacted.tracing.langfuse.publicKey = '***REDACTED***';
  }
  return redacted;
}

function getConfigPath(projectRoot: string): string {
  return join(projectRoot, '.triad', 'config.json');
}

export { DEFAULT_CONFIG };
