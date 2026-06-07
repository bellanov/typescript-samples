/**
 * @fileoverview Registry Pattern
 * Demonstrates the Registry pattern, which provides a well-known object for
 * looking up other objects or services by name. Implemented as both a generic
 * type-safe registry and a typed service-locator variant.
 */

// ── Generic registry ──────────────────────────────────────────────────────────

export class Registry<T> {
  private _store: Map<string, T> = new Map();

  register(key: string, value: T): void {
    if (this._store.has(key)) {
      throw new Error("Registry: key already registered: " + key);
    }
    this._store.set(key, value);
  }

  override(key: string, value: T): void {
    this._store.set(key, value);
  }

  get(key: string): T {
    const value = this._store.get(key);
    if (value === undefined) {
      throw new Error("Registry: key not found: " + key);
    }
    return value;
  }

  has(key: string): boolean {
    return this._store.has(key);
  }

  unregister(key: string): boolean {
    return this._store.delete(key);
  }

  keys(): string[] {
    return Array.from(this._store.keys());
  }

  size(): number {
    return this._store.size;
  }
}

// ── Plugin registry ───────────────────────────────────────────────────────────

export interface Plugin {
  readonly name: string;
  readonly version: string;
  initialize(): void;
}

export class PluginRegistry {
  private _registry = new Registry<Plugin>();

  install(plugin: Plugin): void {
    plugin.initialize();
    this._registry.register(plugin.name, plugin);
  }

  uninstall(name: string): void {
    this._registry.unregister(name);
  }

  getPlugin(name: string): Plugin {
    return this._registry.get(name);
  }

  isInstalled(name: string): boolean {
    return this._registry.has(name);
  }

  installedPlugins(): Plugin[] {
    return this._registry.keys().map((k) => this._registry.get(k));
  }
}

// ── Factory registry ──────────────────────────────────────────────────────────

type Factory<T> = (...args: unknown[]) => T;

/** Maps string tags to factory functions, enabling late-bound object creation. */
export class FactoryRegistry<T> {
  private _factories: Map<string, Factory<T>> = new Map();

  register(tag: string, factory: Factory<T>): void {
    if (this._factories.has(tag)) {
      throw new Error("FactoryRegistry: tag already registered: " + tag);
    }
    this._factories.set(tag, factory);
  }

  create(tag: string, ...args: unknown[]): T {
    const factory = this._factories.get(tag);
    if (!factory) throw new Error("FactoryRegistry: unknown tag: " + tag);
    return factory(...args);
  }

  has(tag: string): boolean {
    return this._factories.has(tag);
  }

  tags(): string[] {
    return Array.from(this._factories.keys());
  }
}
