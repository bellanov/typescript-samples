import { retry, RetryableOperation } from "../../dsa/retry";

describe("retry", () => {
  it("resolves immediately on the first successful attempt", async () => {
    const fn = jest.fn().mockResolvedValue("ok");
    const result = await retry(fn, { maxAttempts: 3, delayMs: 0 });
    expect(result).toBe("ok");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("retries until success", async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new Error("fail"))
      .mockRejectedValueOnce(new Error("fail"))
      .mockResolvedValue("success");

    const result = await retry(fn, { maxAttempts: 3, delayMs: 0 });
    expect(result).toBe("success");
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("throws the last error when all attempts fail", async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new Error("attempt 1"))
      .mockRejectedValueOnce(new Error("attempt 2"))
      .mockRejectedValueOnce(new Error("attempt 3"));

    await expect(
      retry(fn, { maxAttempts: 3, delayMs: 0 }),
    ).rejects.toThrow("attempt 3");
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("stops retrying when shouldRetry returns false", async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new Error("no retry"))
      .mockResolvedValue("would succeed");

    const shouldRetry = jest.fn().mockReturnValue(false);

    await expect(
      retry(fn, { maxAttempts: 5, delayMs: 0, shouldRetry }),
    ).rejects.toThrow("no retry");
    expect(fn).toHaveBeenCalledTimes(1);
    expect(shouldRetry).toHaveBeenCalledTimes(1);
  });

  it("calls shouldRetry with the error and attempt number", async () => {
    const errors: unknown[] = [];
    const attempts: number[] = [];

    const fn = jest
      .fn()
      .mockRejectedValueOnce(new Error("first"))
      .mockResolvedValue("ok");

    await retry(fn, {
      maxAttempts: 3,
      delayMs: 0,
      shouldRetry: (err, attempt) => {
        errors.push(err);
        attempts.push(attempt);
        return true;
      },
    });

    expect(attempts).toEqual([1]);
    expect((errors[0] as Error).message).toBe("first");
  });

  it("throws RangeError for maxAttempts < 1", async () => {
    await expect(
      retry(() => Promise.resolve(), { maxAttempts: 0, delayMs: 0 }),
    ).rejects.toThrow(RangeError);
  });

  it("throws RangeError for negative delayMs", async () => {
    await expect(
      retry(() => Promise.resolve(), { maxAttempts: 1, delayMs: -1 }),
    ).rejects.toThrow(RangeError);
  });

  it("applies exponential back-off (verifies call count, not actual delay)", async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new Error("fail"))
      .mockRejectedValueOnce(new Error("fail"))
      .mockResolvedValue("done");

    // delayMs: 0 so we don't wait; backoffFactor is tested structurally
    const result = await retry(fn, {
      maxAttempts: 3,
      delayMs: 0,
      backoffFactor: 2,
    });
    expect(result).toBe("done");
    expect(fn).toHaveBeenCalledTimes(3);
  });
});

describe("RetryableOperation", () => {
  it("tracks the number of attempts", async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new Error("fail"))
      .mockResolvedValue("done");

    const op = new RetryableOperation(fn, { maxAttempts: 3, delayMs: 0 });
    const result = await op.execute();
    expect(result).toBe("done");
    expect(op.attempts).toBe(2);
  });

  it("exposes the last error when all attempts fail", async () => {
    const error = new Error("boom");
    const fn = jest
      .fn()
      .mockRejectedValueOnce(error)
      .mockRejectedValueOnce(error);

    const op = new RetryableOperation(fn, { maxAttempts: 2, delayMs: 0 });
    await expect(op.execute()).rejects.toThrow("boom");
    expect(op.lastError).toBe(error);
  });
});
