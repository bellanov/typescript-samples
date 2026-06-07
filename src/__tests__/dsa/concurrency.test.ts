import {
  parallel,
  sequential,
  pool,
  withTimeout,
  TimeoutError,
  AsyncQueue,
} from "../../dsa/concurrency";

// ── parallel ──────────────────────────────────────────────────────────────────

describe("parallel", () => {
  it("resolves all tasks and returns results", async () => {
    const results = await parallel([
      (): Promise<number> => Promise.resolve(1),
      (): Promise<number> => Promise.resolve(2),
      (): Promise<number> => Promise.resolve(3),
    ]);
    expect(results).toEqual([1, 2, 3]);
  });

  it("rejects if any task rejects", async () => {
    await expect(
      parallel([
        (): Promise<number> => Promise.resolve(1),
        (): Promise<never> => Promise.reject(new Error("fail")),
      ]),
    ).rejects.toThrow("fail");
  });

  it("handles an empty task list", async () => {
    await expect(parallel([])).resolves.toEqual([]);
  });
});

// ── sequential ────────────────────────────────────────────────────────────────

describe("sequential", () => {
  it("runs tasks in order and collects results", async () => {
    const order: number[] = [];
    const results = await sequential([
      async (): Promise<number> => { order.push(1); return 1; },
      async (): Promise<number> => { order.push(2); return 2; },
      async (): Promise<number> => { order.push(3); return 3; },
    ]);
    expect(order).toEqual([1, 2, 3]);
    expect(results).toEqual([1, 2, 3]);
  });

  it("handles an empty list", async () => {
    await expect(sequential([])).resolves.toEqual([]);
  });
});

// ── pool ──────────────────────────────────────────────────────────────────────

describe("pool", () => {
  it("returns results in the original order", async () => {
    const results = await pool(
      [1, 2, 3, 4, 5].map((n) => (): Promise<number> => Promise.resolve(n)),
      2,
    );
    expect(results).toEqual([1, 2, 3, 4, 5]);
  });

  it("throws when limit is zero or negative", async () => {
    await expect(pool([], 0)).rejects.toThrow(RangeError);
    await expect(pool([], -1)).rejects.toThrow(RangeError);
  });

  it("handles an empty task list", async () => {
    await expect(pool([], 2)).resolves.toEqual([]);
  });

  it("limits concurrency", async () => {
    let active = 0;
    let maxActive = 0;
    const delay = (ms: number): Promise<void> =>
      new Promise<void>((res) => setTimeout(res, ms));

    const tasks = Array.from({ length: 6 }, () => async (): Promise<number> => {
      active++;
      maxActive = Math.max(maxActive, active);
      await delay(10);
      active--;
      return 0;
    });

    await pool(tasks, 2);
    expect(maxActive).toBeLessThanOrEqual(2);
  });
});

// ── withTimeout ───────────────────────────────────────────────────────────────

describe("withTimeout", () => {
  it("resolves when the promise completes in time", async () => {
    const result = await withTimeout(Promise.resolve(42), 1000);
    expect(result).toBe(42);
  });

  it("rejects with TimeoutError when the promise is too slow", async () => {
    const slow = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("too late")), 200),
    );
    await expect(withTimeout(slow, 50)).rejects.toBeInstanceOf(TimeoutError);
  });

  it("propagates the underlying rejection", async () => {
    const failing = Promise.reject(new Error("oops"));
    await expect(withTimeout(failing, 1000)).rejects.toThrow("oops");
  });

  it("throws when timeout is non-positive", () => {
    expect(() => withTimeout(Promise.resolve(), 0)).toThrow(RangeError);
  });
});

// ── AsyncQueue ────────────────────────────────────────────────────────────────

describe("AsyncQueue", () => {
  it("processes tasks in FIFO order", async () => {
    const order: number[] = [];
    const queue = new AsyncQueue(1);
    await Promise.all([
      queue.enqueue(async (): Promise<void> => { order.push(1); }),
      queue.enqueue(async (): Promise<void> => { order.push(2); }),
      queue.enqueue(async (): Promise<void> => { order.push(3); }),
    ]);
    expect(order).toEqual([1, 2, 3]);
  });

  it("respects the concurrency limit", async () => {
    let active = 0;
    let maxActive = 0;
    const delay = (ms: number): Promise<void> =>
      new Promise<void>((res) => setTimeout(res, ms));
    const queue = new AsyncQueue(2);

    await Promise.all(
      Array.from({ length: 4 }, () =>
        queue.enqueue(async (): Promise<void> => {
          active++;
          maxActive = Math.max(maxActive, active);
          await delay(20);
          active--;
        }),
      ),
    );
    expect(maxActive).toBeLessThanOrEqual(2);
  });

  it("resolves the return value of enqueued tasks", async () => {
    const queue = new AsyncQueue(1);
    const result = await queue.enqueue((): Promise<number> => Promise.resolve(99));
    expect(result).toBe(99);
  });

  it("propagates task rejections", async () => {
    const queue = new AsyncQueue(1);
    await expect(
      queue.enqueue((): Promise<never> => Promise.reject(new Error("task error"))),
    ).rejects.toThrow("task error");
  });

  it("throws when concurrency is zero or negative", () => {
    expect(() => new AsyncQueue(0)).toThrow(RangeError);
    expect(() => new AsyncQueue(-1)).toThrow(RangeError);
  });
});
