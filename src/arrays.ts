/**
 * @fileoverview Arrays & Generics
 * Demonstrates generic functions, type-safe array operations, and common
 * functional programming patterns (map, filter, reduce).
 */

// ── Generic stack ─────────────────────────────────────────────────────────────

export class Stack<T> {
  private _items: T[] = [];

  push(item: T): void {
    this._items.push(item);
  }

  pop(): T | undefined {
    return this._items.pop();
  }

  peek(): T | undefined {
    return this._items[this._items.length - 1];
  }

  get size(): number {
    return this._items.length;
  }

  isEmpty(): boolean {
    return this._items.length === 0;
  }

  toArray(): T[] {
    return [...this._items];
  }
}

// ── Generic utility functions ─────────────────────────────────────────────────

export function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

export function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}

export function chunk<T>(arr: T[], size: number): T[][] {
  if (size <= 0) throw new RangeError("Chunk size must be greater than 0");
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

export function flatten<T>(arr: T[][]): T[] {
  return arr.reduce<T[]>((acc, curr) => acc.concat(curr), []);
}

// ── Typed array operations ─────────────────────────────────────────────────────

export function sum(numbers: number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0);
}

export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return sum(numbers) / numbers.length;
}

export function groupBy<T, K extends string | number | symbol>(
  arr: T[],
  keyFn: (item: T) => K,
): Record<K, T[]> {
  return arr.reduce(
    (groups, item) => {
      const key = keyFn(item);
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
      return groups;
    },
    {} as Record<K, T[]>,
  );
}
