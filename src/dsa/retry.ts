/**
 * @fileoverview Retry Pattern
 * Demonstrates the Retry design pattern, which automatically re-attempts a
 * failing operation according to a configurable policy (fixed delay,
 * exponential back-off with optional jitter).
 */

// ── Options ───────────────────────────────────────────────────────────────────

export interface RetryOptions {
  /** Maximum number of attempts (including the first one). */
  maxAttempts: number;
  /** Base delay in milliseconds between attempts. */
  delayMs: number;
  /** Multiplier applied to the delay after each failure (default: 1 = fixed). */
  backoffFactor?: number;
  /** When true, adds random jitter to the delay to avoid thundering-herd. */
  jitter?: boolean;
  /** Optional predicate; if provided, only retries when it returns true. */
  shouldRetry?: (error: unknown, attempt: number) => boolean;
}

// ── Core retry function ───────────────────────────────────────────────────────

/**
 * Executes `fn` up to `options.maxAttempts` times, waiting between failures.
 * Resolves with the first successful return value; rejects with the last error
 * if all attempts are exhausted.
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions,
): Promise<T> {
  const { maxAttempts, delayMs, backoffFactor = 1, jitter = false } = options;

  if (maxAttempts < 1)
    throw new RangeError("maxAttempts must be at least 1");
  if (delayMs < 0) throw new RangeError("delayMs must be non-negative");

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      const isLastAttempt = attempt === maxAttempts;
      if (isLastAttempt) break;

      if (options.shouldRetry && !options.shouldRetry(error, attempt)) break;

      const baseDelay = delayMs * Math.pow(backoffFactor, attempt - 1);
      const actualDelay = jitter
        ? baseDelay * (0.5 + Math.random() * 0.5)
        : baseDelay;

      if (actualDelay > 0) {
        await sleep(actualDelay);
      }
    }
  }

  throw lastError;
}

// ── Retry decorator (class-method variant) ────────────────────────────────────

export class RetryableOperation<T> {
  private _attempts: number = 0;
  private _lastError: unknown = undefined;

  constructor(
    private readonly _fn: () => Promise<T>,
    private readonly _options: RetryOptions,
  ) {}

  async execute(): Promise<T> {
    const result = await retry(
      async () => {
        this._attempts++;
        try {
          return await this._fn();
        } catch (err) {
          this._lastError = err;
          throw err;
        }
      },
      this._options,
    );
    return result;
  }

  get attempts(): number {
    return this._attempts;
  }

  get lastError(): unknown {
    return this._lastError;
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
