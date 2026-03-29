export type CostTier = 'free' | 'low' | 'medium' | 'high' | 'premium';

export interface ProviderConfig {
  id: string;
  displayName: string;
  envVars: string[];
  costTier: CostTier;
  localBinary?: string;
}

export interface ProviderResponse {
  id: string;
  displayName: string;
  available: boolean;
  envSatisfied: boolean;
  localAvailable: boolean;
  missingEnvVars: string[];
  costTier: CostTier;
  reason?: string;
}

export interface LLMProvider {
  config: ProviderConfig;
  detect: () => ProviderResponse;
}
