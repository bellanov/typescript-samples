/**
 * @fileoverview Ports and Adapters (Hexagonal Architecture)
 * Demonstrates the Ports and Adapters pattern, which isolates the application
 * core from external infrastructure by defining ports (interfaces) and wiring
 * in adapters (concrete implementations) at runtime.
 */

// ── Domain model ──────────────────────────────────────────────────────────────

export interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}

// ── Port (driven / secondary port) ───────────────────────────────────────────

export interface UserRepository {
  findById(id: string): Promise<User | undefined>;
  findAll(): Promise<User[]>;
  save(user: User): Promise<void>;
  delete(id: string): Promise<void>;
}

// ── Application service (core — depends only on the port) ─────────────────────

export class UserService {
  constructor(private readonly _repo: UserRepository) {}

  async getUser(id: string): Promise<User> {
    const user = await this._repo.findById(id);
    if (!user) throw new Error("User not found: " + id);
    return user;
  }

  async listUsers(): Promise<User[]> {
    return this._repo.findAll();
  }

  async createUser(user: User): Promise<void> {
    const existing = await this._repo.findById(user.id);
    if (existing) throw new Error("User already exists: " + user.id);
    await this._repo.save(user);
  }

  async deleteUser(id: string): Promise<void> {
    await this._repo.delete(id);
  }
}

// ── Adapter: in-memory (suitable for tests and local dev) ─────────────────────

export class InMemoryUserRepository implements UserRepository {
  private _store: Map<string, User> = new Map();

  async findById(id: string): Promise<User | undefined> {
    return this._store.get(id);
  }

  async findAll(): Promise<User[]> {
    return Array.from(this._store.values());
  }

  async save(user: User): Promise<void> {
    this._store.set(user.id, user);
  }

  async delete(id: string): Promise<void> {
    this._store.delete(id);
  }

  /** Convenience helper — returns current store size. */
  size(): number {
    return this._store.size;
  }
}

// ── Adapter: read-only (demonstrates additional adapter variety) ───────────────

export class ReadOnlyUserRepository implements UserRepository {
  constructor(private readonly _source: UserRepository) {}

  findById(id: string): Promise<User | undefined> {
    return this._source.findById(id);
  }

  findAll(): Promise<User[]> {
    return this._source.findAll();
  }

  save(_user: User): Promise<void> {
    return Promise.reject(new Error("Read-only repository: save not allowed"));
  }

  delete(_id: string): Promise<void> {
    return Promise.reject(
      new Error("Read-only repository: delete not allowed"),
    );
  }
}
