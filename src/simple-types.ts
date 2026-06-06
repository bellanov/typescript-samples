/**
 * @fileoverview Simple Types
 * Demonstrates primitive types, type aliases, interfaces, enums,
 * union/intersection types, optional properties, and utility types.
 */

// ── Primitive types ──────────────────────────────────────────────────────────

export const greeting: string = "Hello, TypeScript!";
export const version: number = 1;
export const isActive: boolean = true;

// ── Type aliases ─────────────────────────────────────────────────────────────

export type ID = string | number;
export type Nullable<T> = T | null;

// ── Interface with optional and readonly properties ───────────────────────────

export interface User {
  readonly id: ID;
  name: string;
  email?: string;
}

// ── Enum ─────────────────────────────────────────────────────────────────────

export enum Direction {
  North = "NORTH",
  South = "SOUTH",
  East = "EAST",
  West = "WEST",
}

// ── Union and intersection types ─────────────────────────────────────────────

export type StringOrNumber = string | number;

export interface HasName {
  name: string;
}

export interface HasAge {
  age: number;
}

export type Person = HasName & HasAge;

// ── Utility types ─────────────────────────────────────────────────────────────

export type PartialUser = Partial<User>;
export type RequiredUser = Required<User>;
export type UserName = Pick<User, "name">;
export type UserWithoutEmail = Omit<User, "email">;
export type DirectionMap = Record<string, Direction>;

// ── Type guard ───────────────────────────────────────────────────────────────

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value
  );
}

// ── Factory function using utility types ──────────────────────────────────────

export function createUser(id: ID, name: string, email?: string): User {
  return { id, name, ...(email !== undefined ? { email } : {}) };
}
