/**
 * @fileoverview Concurrency / Multiprocessing Patterns
 * Demonstrates asynchronous concurrency patterns in TypeScript using Promises
 * and async/await: parallel execution, sequential pipelines, bounded concurrency
 * pools, and timeout guards.
 */

// ── Parallel execution ────────────────────────────────────────────────────────

/** Runs all tasks in parallel and resolves when every task completes. */
export async function parallel<T>(
  tasks: Array<() => Promise<T>>,
): Promise<T[]> {
  return Promise.all(tasks.map((task) => task()));
}

// ── Sequential pipeline ───────────────────────────────────────────────────────

/** Runs tasks one after another and returns the collected results. */
export async function sequential<T>(
  tasks: Array<() => Promise<T>>,
): Promise<T[]> {
  const results: T[] = [];
  for (const task of tasks) {
    results.push(await task());
  }
  return results;
}

// ── Concurrency pool ──────────────────────────────────────────────────────────

/**
 * Runs at most `limit` tasks concurrently, starting new ones as slots free up.
 * Preserves the original order of results.
 */
export async function pool<T>(
  tasks: Array<() => Promise<T>>,
  limit: number,
): Promise<T[]> {
  if (limit <= 0) throw new RangeError("Pool limit must be greater than 0");
  const results: T[] = new Array(tasks.length);
  const executing = new Set<Promise<void>>();
  let index = 0;

  for (const task of tasks) {
    const i = index++;
    const p: Promise<void> = task().then((result) => {
      results[i] = result;
      executing.delete(p);
    });
    executing.add(p);
    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }
  await Promise.all(executing);
  return results;
}

// ── Timeout guard ─────────────────────────────────────────────────────────────

/**
 * Wraps a promise so that it rejects with a `TimeoutError` if it does not
 * settle within `ms` milliseconds.
 */
export class TimeoutError extends Error {
  constructor(ms: number) {
    super("Operation timed out after " + ms + "ms");
    this.name = "TimeoutError";
  }
}

export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  if (ms <= 0) throw new RangeError("Timeout must be a positive number");
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new TimeoutError(ms)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (reason: unknown) => {
        clearTimeout(timer);
        reject(reason);
      },
    );
  });
}

// ── Async queue ───────────────────────────────────────────────────────────────

type Task<T> = () => Promise<T>;

/**
 * A FIFO queue that processes enqueued async tasks with a configurable
 * concurrency limit.
 */
export class AsyncQueue {
  private _queue: Array<{
    task: Task<unknown>;
    resolve: (v: unknown) => void;
    reject: (e: unknown) => void;
  }> = [];
  private _active: number = 0;

  constructor(private readonly _concurrency: number = 1) {
    if (_concurrency <= 0)
      throw new RangeError("Concurrency must be greater than 0");
  }

  enqueue<T>(task: Task<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this._queue.push({
        task: task as Task<unknown>,
        resolve: resolve as (v: unknown) => void,
        reject,
      });
      this._drain();
    });
  }

  get pending(): number {
    return this._queue.length;
  }

  get active(): number {
    return this._active;
  }

  private _drain(): void {
    while (this._active < this._concurrency && this._queue.length > 0) {
      const item = this._queue.shift()!;
      this._active++;
      item
        .task()
        .then(item.resolve, item.reject)
        .finally(() => {
          this._active--;
          this._drain();
        });
    }
  }
}
