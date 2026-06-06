/**
 * @fileoverview Strategy Pattern
 * Demonstrates the Strategy design pattern, which defines a family of
 * algorithms, encapsulates each one, and makes them interchangeable at runtime.
 */

// ── Sort strategy ─────────────────────────────────────────────────────────────

export interface SortStrategy<T> {
  sort(items: T[], compareFn: (a: T, b: T) => number): T[];
}

export class BubbleSortStrategy<T> implements SortStrategy<T> {
  sort(items: T[], compareFn: (a: T, b: T) => number): T[] {
    const arr = [...items];
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - 1 - i; j++) {
        if (compareFn(arr[j], arr[j + 1]) > 0) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
    return arr;
  }
}

export class MergeSortStrategy<T> implements SortStrategy<T> {
  sort(items: T[], compareFn: (a: T, b: T) => number): T[] {
    if (items.length <= 1) return [...items];
    return this._mergeSort([...items], compareFn);
  }

  private _mergeSort(arr: T[], compareFn: (a: T, b: T) => number): T[] {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = this._mergeSort(arr.slice(0, mid), compareFn);
    const right = this._mergeSort(arr.slice(mid), compareFn);
    return this._merge(left, right, compareFn);
  }

  private _merge(
    left: T[],
    right: T[],
    compareFn: (a: T, b: T) => number,
  ): T[] {
    const result: T[] = [];
    let i = 0;
    let j = 0;
    while (i < left.length && j < right.length) {
      if (compareFn(left[i], right[j]) <= 0) {
        result.push(left[i++]);
      } else {
        result.push(right[j++]);
      }
    }
    return result.concat(left.slice(i)).concat(right.slice(j));
  }
}

/** Delegates to the native Array.prototype.sort (a reference baseline). */
export class NativeSortStrategy<T> implements SortStrategy<T> {
  sort(items: T[], compareFn: (a: T, b: T) => number): T[] {
    return [...items].sort(compareFn);
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

export class Sorter<T> {
  constructor(private _strategy: SortStrategy<T>) {}

  setStrategy(strategy: SortStrategy<T>): void {
    this._strategy = strategy;
  }

  sort(items: T[], compareFn: (a: T, b: T) => number): T[] {
    return this._strategy.sort(items, compareFn);
  }
}

// ── Compression strategy ──────────────────────────────────────────────────────

export interface CompressionStrategy {
  compress(data: string): string;
  decompress(data: string): string;
}

/** Run-length encoding — a simple lossless compression technique. */
export class RleCompressionStrategy implements CompressionStrategy {
  compress(data: string): string {
    if (!data) return "";
    let result = "";
    let count = 1;
    for (let i = 1; i <= data.length; i++) {
      if (i < data.length && data[i] === data[i - 1]) {
        count++;
      } else {
        result += count > 1 ? count + data[i - 1] : data[i - 1];
        count = 1;
      }
    }
    return result;
  }

  decompress(data: string): string {
    return data.replace(/(\d+)(.)/g, (_, n, ch: string) =>
      ch.repeat(Number(n)),
    );
  }
}

/** No-op passthrough — useful as a default or for testing. */
export class NoOpCompressionStrategy implements CompressionStrategy {
  compress(data: string): string {
    return data;
  }

  decompress(data: string): string {
    return data;
  }
}

export class DataProcessor {
  constructor(private _compression: CompressionStrategy) {}

  setStrategy(strategy: CompressionStrategy): void {
    this._compression = strategy;
  }

  process(data: string): string {
    return this._compression.compress(data);
  }

  restore(data: string): string {
    return this._compression.decompress(data);
  }
}
