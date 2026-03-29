import { get, listAvailable } from '../providers/registry.js';
import type { LLMProvider } from '../providers/types.js';
import type {
  MultiModelProviderError,
  MultiModelProviderResult,
  MultiModelRequest,
  MultiModelResponse,
  ProviderExecutor,
} from './types.js';

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs?: number): Promise<T> {
  if (!timeoutMs || timeoutMs <= 0) {
    return promise;
  }

  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error: unknown) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

export class MultiModelEngine {
  constructor(private readonly executeProvider: ProviderExecutor) {}

  private resolveProviders(request: MultiModelRequest): LLMProvider[] {
    const available = listAvailable();
    if (available.length === 0) {
      throw new Error('No available providers detected. Run "triad providers detect" first.');
    }

    if (!request.providerIds || request.providerIds.length === 0) {
      return available;
    }

    const selected = request.providerIds
      .map((id) => get(id))
      .filter((provider): provider is LLMProvider => provider !== undefined)
      .filter((provider) => available.some((availableProvider) => availableProvider.config.id === provider.config.id));

    if (selected.length === 0) {
      throw new Error('None of the requested providers are currently available.');
    }

    return selected;
  }

  private async executeWithProvider(
    provider: LLMProvider,
    request: MultiModelRequest
  ): Promise<{ result?: MultiModelProviderResult; error?: MultiModelProviderError }> {
    const startedAt = Date.now();

    try {
      const output = await withTimeout(
        this.executeProvider({
          providerId: provider.config.id,
          prompt: request.prompt,
          timeoutMs: request.timeoutMs,
        }),
        request.timeoutMs
      );

      const latencyMs = Date.now() - startedAt;

      return {
        result: {
          providerId: provider.config.id,
          providerName: provider.config.displayName,
          model: output.model,
          tier: provider.config.costTier,
          content: output.content,
          latencyMs,
          inputTokens: output.inputTokens,
          outputTokens: output.outputTokens,
          costUsd: output.costUsd,
        },
      };
    } catch (error) {
      return {
        error: {
          providerId: provider.config.id,
          providerName: provider.config.displayName,
          tier: provider.config.costTier,
          error: toErrorMessage(error),
        },
      };
    }
  }

  async executeParallel(request: MultiModelRequest): Promise<MultiModelResponse> {
    const providers = this.resolveProviders(request);
    const startedAt = Date.now();

    const settled = await Promise.all(providers.map((provider) => this.executeWithProvider(provider, request)));

    const results = settled.flatMap((entry) => (entry.result ? [entry.result] : []));
    const errors = settled.flatMap((entry) => (entry.error ? [entry.error] : []));

    if (results.length === 0) {
      throw new Error(`All providers failed: ${errors.map((e) => `${e.providerId}=${e.error}`).join(', ')}`);
    }

    return {
      strategy: 'parallel',
      prompt: request.prompt,
      partial: errors.length > 0,
      durationMs: Date.now() - startedAt,
      winners: results,
      results,
      errors,
    };
  }

  async executeSequential(request: MultiModelRequest): Promise<MultiModelResponse> {
    const providers = this.resolveProviders(request);
    const startedAt = Date.now();

    const results: MultiModelProviderResult[] = [];
    const errors: MultiModelProviderError[] = [];

    for (const provider of providers) {
      const outcome = await this.executeWithProvider(provider, request);

      if (outcome.error) {
        errors.push(outcome.error);
        continue;
      }

      if (outcome.result) {
        results.push(outcome.result);
        if (!request.fallbackPartial) {
          break;
        }
      }
    }

    if (results.length === 0) {
      throw new Error(`All providers failed: ${errors.map((e) => `${e.providerId}=${e.error}`).join(', ')}`);
    }

    return {
      strategy: 'sequential',
      prompt: request.prompt,
      partial: errors.length > 0,
      durationMs: Date.now() - startedAt,
      winners: [results[0]],
      results,
      errors,
    };
  }

  async executeAdversarial(request: MultiModelRequest): Promise<MultiModelResponse> {
    const providers = this.resolveProviders(request).slice(0, 2);
    if (providers.length < 2) {
      throw new Error('Adversarial execution requires at least two available providers.');
    }

    const startedAt = Date.now();
    const settled = await Promise.all(providers.map((provider) => this.executeWithProvider(provider, request)));

    const results = settled.flatMap((entry) => (entry.result ? [entry.result] : []));
    const errors = settled.flatMap((entry) => (entry.error ? [entry.error] : []));

    if (results.length === 0) {
      throw new Error(`All providers failed: ${errors.map((e) => `${e.providerId}=${e.error}`).join(', ')}`);
    }

    const winner = results.reduce((best, current) => {
      const bestScore = best.content.length;
      const currentScore = current.content.length;
      return currentScore > bestScore ? current : best;
    }, results[0]);

    return {
      strategy: 'adversarial',
      prompt: request.prompt,
      partial: errors.length > 0,
      durationMs: Date.now() - startedAt,
      winners: [winner],
      results,
      errors,
    };
  }
}
