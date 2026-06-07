# TypeScript Samples

A template demonstrating modern TypeScript design patterns for Node.js applications.

## Features

- **Simple Types** — primitives, type aliases, interfaces, enums, union/intersection types, utility types, and type guards
- **Classes** — access modifiers, abstract classes, inheritance, getters/setters, and the Singleton design pattern
- **Arrays & Generics** — generic `Stack<T>`, generic utility functions (`chunk`, `groupBy`, `flatten`, etc.), and typed array operations
- **DSA** — design patterns and algorithms: Builder, Observer/Decorator/Command, Concurrency, Ports & Adapters, Registry, Retry, and Strategy

## Getting Started

```bash
npm install
```

## Scripts

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run build`   | Compile TypeScript to `dist/`            |
| `npm run lint`    | Lint source files with ESLint            |
| `npm test`        | Run unit tests and display code coverage |
| `npm run format`  | Format code with Prettier                |
| `npm run typecheck` | Type-check without emitting output     |

## Project Structure

```
src/
├── __tests__/           # Jest unit tests
│   ├── dsa/
│   │   ├── builder.test.ts
│   │   ├── concurrency.test.ts
│   │   ├── patterns-with-classes.test.ts
│   │   ├── ports-and-adapters.test.ts
│   │   ├── registry.test.ts
│   │   ├── retry.test.ts
│   │   └── strategy.test.ts
│   ├── arrays.test.ts
│   ├── classes.test.ts
│   └── simple-types.test.ts
├── dsa/                 # Design patterns & algorithms
│   ├── builder.ts           # Builder pattern — fluent HttpRequestBuilder + Director
│   ├── concurrency.ts       # Concurrency patterns — parallel, sequential, pool, withTimeout, AsyncQueue
│   ├── index.ts             # Barrel re-export
│   ├── patterns-with-classes.ts  # Observer, Decorator (Logger), Command patterns
│   ├── ports-and-adapters.ts     # Hexagonal architecture — UserRepository port + adapters
│   ├── registry.ts          # Registry, PluginRegistry, FactoryRegistry
│   ├── retry.ts             # Retry with fixed delay, exponential back-off, and jitter
│   └── strategy.ts          # Strategy pattern — sort strategies + compression strategies
├── arrays.ts            # Generic Stack, utility functions, typed array ops
├── classes.ts           # OOP patterns: abstract classes, inheritance, Singleton
├── index.ts             # Barrel re-export
└── simple-types.ts      # Types, interfaces, enums, type guards, utility types
```

## DSA Samples

### Builder Pattern (`dsa/builder.ts`)
The Builder pattern separates object construction from its representation. `HttpRequestBuilder` chains setter calls to assemble an immutable `HttpRequest`. `HttpRequestDirector` provides convenient presets for common request shapes.

### Patterns with Classes (`dsa/patterns-with-classes.ts`)
Three classical OOP patterns implemented with TypeScript classes:
- **Observer** — `EventEmitter<T>` lets observers subscribe/unsubscribe to named events.
- **Decorator** — `TimestampLogger` and `PrefixLogger` wrap a `Logger` to add behaviour without subclassing.
- **Command** — `TextEditor` records `AppendCommand` objects and supports `undoLast()`.

### Concurrency Patterns (`dsa/concurrency.ts`)
Async/await utilities for controlling Promise-based concurrency:
- `parallel` — run all tasks at once and collect results.
- `sequential` — run tasks one by one in order.
- `pool` — limit the number of tasks running concurrently.
- `withTimeout` — reject a promise if it does not settle within a deadline.
- `AsyncQueue` — FIFO queue with a configurable concurrency cap.

### Ports and Adapters (`dsa/ports-and-adapters.ts`)
Hexagonal Architecture: the application core (`UserService`) depends only on the `UserRepository` port (interface). Adapters (`InMemoryUserRepository`, `ReadOnlyUserRepository`) satisfy the port and can be swapped without touching business logic.

### Registry Pattern (`dsa/registry.ts`)
Three flavours of the Registry pattern:
- `Registry<T>` — generic key/value store with duplicate-key protection.
- `PluginRegistry` — installs and tracks `Plugin` objects, calling `initialize()` on each.
- `FactoryRegistry<T>` — maps string tags to factory functions for deferred object creation.

### Retry Pattern (`dsa/retry.ts`)
`retry(fn, options)` re-attempts a failing async operation with configurable:
- `maxAttempts` — total attempt limit.
- `delayMs` + `backoffFactor` — fixed or exponential delay between attempts.
- `jitter` — randomises delay to avoid thundering-herd.
- `shouldRetry` — optional predicate to short-circuit retries on specific errors.

`RetryableOperation` wraps the same logic as an object and exposes `attempts` and `lastError`.

### Strategy Pattern (`dsa/strategy.ts`)
Two context/strategy pairs:
- **Sorting** — `Sorter<T>` delegates to `BubbleSortStrategy`, `MergeSortStrategy`, or `NativeSortStrategy`, all swappable at runtime.
- **Compression** — `DataProcessor` delegates to `RleCompressionStrategy` (run-length encoding) or `NoOpCompressionStrategy`.

## CI/CD

The repository includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that automatically runs on every push and pull request to `main`:

1. **Lint** — ESLint with TypeScript rules
2. **Build** — TypeScript compilation
3. **Test** — Jest unit tests with code coverage report
