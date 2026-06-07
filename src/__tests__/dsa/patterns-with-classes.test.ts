import {
  EventEmitter,
  ConsoleLogger,
  TimestampLogger,
  PrefixLogger,
  TextEditor,
  AppendCommand,
} from "../../dsa/patterns-with-classes";

// ── Observer (EventEmitter) ───────────────────────────────────────────────────

describe("EventEmitter (Observer pattern)", () => {
  it("notifies subscribers when an event is emitted", () => {
    const emitter = new EventEmitter<string>();
    const received: string[] = [];
    const observer = { update: (_: string, data: string): void => { received.push(data); } };

    emitter.subscribe("msg", observer);
    emitter.emit("msg", "hello");

    expect(received).toEqual(["hello"]);
  });

  it("does not notify observers for unrelated events", () => {
    const emitter = new EventEmitter<string>();
    const received: string[] = [];
    emitter.subscribe("a", { update: (_: string, d: string): void => { received.push(d); } });
    emitter.emit("b", "ignored");
    expect(received).toHaveLength(0);
  });

  it("supports multiple subscribers for the same event", () => {
    const emitter = new EventEmitter<number>();
    const results: number[] = [];
    emitter.subscribe("num", { update: (_: string, d: number): void => { results.push(d); } });
    emitter.subscribe("num", { update: (_: string, d: number): void => { results.push(d * 2); } });
    emitter.emit("num", 5);
    expect(results).toEqual([5, 10]);
  });

  it("unsubscribes correctly", () => {
    const emitter = new EventEmitter<string>();
    const received: string[] = [];
    const observer = { update: (_: string, d: string): void => { received.push(d); } };

    emitter.subscribe("ev", observer);
    emitter.unsubscribe("ev", observer);
    emitter.emit("ev", "should not arrive");

    expect(received).toHaveLength(0);
  });

  it("tracks listener count", () => {
    const emitter = new EventEmitter<void>();
    const obs1 = { update: (): void => {} };
    const obs2 = { update: (): void => {} };
    emitter.subscribe("click", obs1);
    emitter.subscribe("click", obs2);
    expect(emitter.listenerCount("click")).toBe(2);
    emitter.unsubscribe("click", obs1);
    expect(emitter.listenerCount("click")).toBe(1);
  });
});

// ── Decorator (Logger) ────────────────────────────────────────────────────────

describe("Logger (Decorator pattern)", () => {
  it("ConsoleLogger logs a message", () => {
    const spy = jest.spyOn(console, "log").mockImplementation(() => {});
    const logger = new ConsoleLogger();
    logger.log("hello");
    expect(spy).toHaveBeenCalledWith("hello");
    spy.mockRestore();
  });

  it("PrefixLogger prepends the prefix", () => {
    const spy = jest.spyOn(console, "log").mockImplementation(() => {});
    const logger = new PrefixLogger(new ConsoleLogger(), "[INFO]");
    logger.log("test");
    expect(spy).toHaveBeenCalledWith("[INFO] test");
    spy.mockRestore();
  });

  it("TimestampLogger adds an ISO timestamp", () => {
    const spy = jest.spyOn(console, "log").mockImplementation(() => {});
    const logger = new TimestampLogger(new ConsoleLogger());
    logger.log("event");
    const logged = spy.mock.calls[0][0] as string;
    expect(logged).toMatch(/^\[\d{4}-\d{2}-\d{2}T/);
    expect(logged).toContain("event");
    spy.mockRestore();
  });

  it("decorators can be stacked", () => {
    const spy = jest.spyOn(console, "log").mockImplementation(() => {});
    const logger = new PrefixLogger(new ConsoleLogger(), "[APP]");
    const stamped = new TimestampLogger(logger);
    stamped.log("stacked");
    const logged = spy.mock.calls[0][0] as string;
    expect(logged).toContain("[APP]");
    expect(logged).toContain("stacked");
    spy.mockRestore();
  });
});

// ── Command pattern ───────────────────────────────────────────────────────────

describe("TextEditor (Command pattern)", () => {
  it("appends text with a command", () => {
    const editor = new TextEditor();
    editor.executeCommand(new AppendCommand(editor, "Hello"));
    expect(editor.text).toBe("Hello");
  });

  it("undoes the last append command", () => {
    const editor = new TextEditor();
    editor.executeCommand(new AppendCommand(editor, "Hello"));
    editor.executeCommand(new AppendCommand(editor, " World"));
    editor.undoLast();
    expect(editor.text).toBe("Hello");
  });

  it("undo on empty history is a no-op", () => {
    const editor = new TextEditor();
    expect(() => editor.undoLast()).not.toThrow();
    expect(editor.text).toBe("");
  });

  it("supports multiple undo steps", () => {
    const editor = new TextEditor();
    editor.executeCommand(new AppendCommand(editor, "A"));
    editor.executeCommand(new AppendCommand(editor, "B"));
    editor.executeCommand(new AppendCommand(editor, "C"));
    editor.undoLast();
    editor.undoLast();
    expect(editor.text).toBe("A");
  });
});
