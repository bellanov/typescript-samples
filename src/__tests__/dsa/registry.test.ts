import {
  Registry,
  PluginRegistry,
  FactoryRegistry,
  type Plugin,
} from "../../dsa/registry";

// ── Generic Registry ──────────────────────────────────────────────────────────

describe("Registry", () => {
  it("registers and retrieves a value", () => {
    const registry = new Registry<number>();
    registry.register("pi", 3.14);
    expect(registry.get("pi")).toBe(3.14);
  });

  it("throws when registering a duplicate key", () => {
    const registry = new Registry<string>();
    registry.register("key", "value");
    expect(() => registry.register("key", "other")).toThrow("already registered");
  });

  it("allows overriding an existing key", () => {
    const registry = new Registry<string>();
    registry.register("key", "old");
    registry.override("key", "new");
    expect(registry.get("key")).toBe("new");
  });

  it("throws when getting a missing key", () => {
    const registry = new Registry<string>();
    expect(() => registry.get("missing")).toThrow("not found");
  });

  it("has() returns correct boolean", () => {
    const registry = new Registry<number>();
    registry.register("x", 1);
    expect(registry.has("x")).toBe(true);
    expect(registry.has("y")).toBe(false);
  });

  it("unregister() removes a key and returns true", () => {
    const registry = new Registry<number>();
    registry.register("x", 1);
    expect(registry.unregister("x")).toBe(true);
    expect(registry.has("x")).toBe(false);
  });

  it("unregister() returns false for unknown key", () => {
    const registry = new Registry<number>();
    expect(registry.unregister("ghost")).toBe(false);
  });

  it("keys() returns all registered keys", () => {
    const registry = new Registry<number>();
    registry.register("a", 1);
    registry.register("b", 2);
    expect(registry.keys().sort()).toEqual(["a", "b"]);
  });

  it("size() reflects the number of entries", () => {
    const registry = new Registry<number>();
    expect(registry.size()).toBe(0);
    registry.register("a", 1);
    expect(registry.size()).toBe(1);
  });
});

// ── PluginRegistry ────────────────────────────────────────────────────────────

describe("PluginRegistry", () => {
  function makePlugin(name: string, version = "1.0.0"): Plugin & { initialized: boolean } {
    return {
      name,
      version,
      initialized: false,
      initialize(): void { this.initialized = true; },
    };
  }

  it("installs a plugin and calls initialize()", () => {
    const registry = new PluginRegistry();
    const plugin = makePlugin("logger");
    registry.install(plugin);
    expect(plugin.initialized).toBe(true);
    expect(registry.isInstalled("logger")).toBe(true);
  });

  it("retrieves an installed plugin", () => {
    const registry = new PluginRegistry();
    const plugin = makePlugin("analytics");
    registry.install(plugin);
    expect(registry.getPlugin("analytics")).toBe(plugin);
  });

  it("uninstalls a plugin", () => {
    const registry = new PluginRegistry();
    registry.install(makePlugin("temp"));
    registry.uninstall("temp");
    expect(registry.isInstalled("temp")).toBe(false);
  });

  it("lists all installed plugins", () => {
    const registry = new PluginRegistry();
    registry.install(makePlugin("a"));
    registry.install(makePlugin("b"));
    expect(registry.installedPlugins()).toHaveLength(2);
  });
});

// ── FactoryRegistry ───────────────────────────────────────────────────────────

describe("FactoryRegistry", () => {
  it("registers a factory and creates objects", () => {
    const factories = new FactoryRegistry<{ type: string }>();
    factories.register("circle", () => ({ type: "circle" }));
    expect(factories.create("circle")).toEqual({ type: "circle" });
  });

  it("throws for unknown tags", () => {
    const factories = new FactoryRegistry<object>();
    expect(() => factories.create("unknown")).toThrow("unknown tag");
  });

  it("throws when re-registering a tag", () => {
    const factories = new FactoryRegistry<object>();
    factories.register("tag", () => ({}));
    expect(() => factories.register("tag", () => ({}))).toThrow("already registered");
  });

  it("has() checks existence", () => {
    const factories = new FactoryRegistry<object>();
    factories.register("x", () => ({}));
    expect(factories.has("x")).toBe(true);
    expect(factories.has("y")).toBe(false);
  });

  it("tags() lists all registered tags", () => {
    const factories = new FactoryRegistry<object>();
    factories.register("a", () => ({}));
    factories.register("b", () => ({}));
    expect(factories.tags().sort()).toEqual(["a", "b"]);
  });
});
