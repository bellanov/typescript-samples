# TypeScript Samples

A template demonstrating modern TypeScript design patterns for Node.js applications.

## Features

- **Simple Types** — primitives, type aliases, interfaces, enums, union/intersection types, utility types, and type guards
- **Classes** — access modifiers, abstract classes, inheritance, getters/setters, and the Singleton design pattern
- **Arrays & Generics** — generic `Stack<T>`, generic utility functions (`chunk`, `groupBy`, `flatten`, etc.), and typed array operations

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
│   ├── arrays.test.ts
│   ├── classes.test.ts
│   └── simple-types.test.ts
├── arrays.ts            # Generic Stack, utility functions, typed array ops
├── classes.ts           # OOP patterns: abstract classes, inheritance, Singleton
├── index.ts             # Barrel re-export
└── simple-types.ts      # Types, interfaces, enums, type guards, utility types
```

## CI/CD

The repository includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that automatically runs on every push and pull request to `main`:

1. **Lint** — ESLint with TypeScript rules
2. **Build** — TypeScript compilation
3. **Test** — Jest unit tests with code coverage report
