/**
 * @fileoverview Patterns with Classes
 * Demonstrates classical OOP design patterns implemented with TypeScript
 * classes: the Observer pattern and the Decorator pattern.
 */

// ── Observer pattern ──────────────────────────────────────────────────────────

export interface Observer<T> {
  update(event: string, data: T): void;
}

export class EventEmitter<T> {
  private _listeners: Map<string, Observer<T>[]> = new Map();

  subscribe(event: string, observer: Observer<T>): void {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, []);
    }
    this._listeners.get(event)!.push(observer);
  }

  unsubscribe(event: string, observer: Observer<T>): void {
    const listeners = this._listeners.get(event);
    if (!listeners) return;
    this._listeners.set(
      event,
      listeners.filter((l) => l !== observer),
    );
  }

  emit(event: string, data: T): void {
    const listeners = this._listeners.get(event) ?? [];
    for (const listener of listeners) {
      listener.update(event, data);
    }
  }

  listenerCount(event: string): number {
    return this._listeners.get(event)?.length ?? 0;
  }
}

// ── Decorator pattern ─────────────────────────────────────────────────────────

export interface Logger {
  log(message: string): void;
}

export class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(message);
  }
}

export class TimestampLogger implements Logger {
  constructor(private readonly _inner: Logger) {}

  log(message: string): void {
    const ts = new Date().toISOString();
    this._inner.log("[" + ts + "] " + message);
  }
}

export class PrefixLogger implements Logger {
  constructor(
    private readonly _inner: Logger,
    private readonly _prefix: string,
  ) {}

  log(message: string): void {
    this._inner.log(this._prefix + " " + message);
  }
}

// ── Command pattern ───────────────────────────────────────────────────────────

export interface Command {
  execute(): void;
  undo(): void;
}

export class TextEditor {
  private _text: string = "";
  private _history: Command[] = [];

  get text(): string {
    return this._text;
  }

  executeCommand(command: Command): void {
    command.execute();
    this._history.push(command);
  }

  undoLast(): void {
    const command = this._history.pop();
    command?.undo();
  }

  /** Internal mutator used by commands. */
  _append(value: string): void {
    this._text += value;
  }

  /** Internal mutator used by commands. */
  _truncate(length: number): void {
    this._text = this._text.slice(0, length);
  }
}

export class AppendCommand implements Command {
  private _previousLength: number = 0;

  constructor(
    private readonly _editor: TextEditor,
    private readonly _value: string,
  ) {}

  execute(): void {
    this._previousLength = this._editor.text.length;
    this._editor._append(this._value);
  }

  undo(): void {
    this._editor._truncate(this._previousLength);
  }
}
