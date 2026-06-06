import {
  BubbleSortStrategy,
  MergeSortStrategy,
  NativeSortStrategy,
  Sorter,
  RleCompressionStrategy,
  NoOpCompressionStrategy,
  DataProcessor,
} from "../../dsa/strategy";

const numAsc = (a: number, b: number): number => a - b;
const numDesc = (a: number, b: number): number => b - a;

// ── Sort strategies ───────────────────────────────────────────────────────────

describe.each([
  ["BubbleSortStrategy", new BubbleSortStrategy<number>()],
  ["MergeSortStrategy", new MergeSortStrategy<number>()],
  ["NativeSortStrategy", new NativeSortStrategy<number>()],
])("%s", (_, strategy) => {
  it("sorts ascending", () => {
    expect(strategy.sort([3, 1, 4, 1, 5, 9, 2, 6], numAsc)).toEqual([
      1, 1, 2, 3, 4, 5, 6, 9,
    ]);
  });

  it("sorts descending", () => {
    expect(strategy.sort([3, 1, 4], numDesc)).toEqual([4, 3, 1]);
  });

  it("handles an empty array", () => {
    expect(strategy.sort([], numAsc)).toEqual([]);
  });

  it("handles a single-element array", () => {
    expect(strategy.sort([42], numAsc)).toEqual([42]);
  });

  it("does not mutate the original array", () => {
    const original = [3, 1, 2];
    strategy.sort(original, numAsc);
    expect(original).toEqual([3, 1, 2]);
  });
});

// ── Sorter context ────────────────────────────────────────────────────────────

describe("Sorter (context)", () => {
  it("uses the injected strategy", () => {
    const sorter = new Sorter<number>(new BubbleSortStrategy());
    expect(sorter.sort([3, 1, 2], numAsc)).toEqual([1, 2, 3]);
  });

  it("can switch strategy at runtime", () => {
    const sorter = new Sorter<number>(new BubbleSortStrategy());
    sorter.setStrategy(new MergeSortStrategy());
    expect(sorter.sort([5, 3, 1], numAsc)).toEqual([1, 3, 5]);
  });
});

// ── Compression strategies ────────────────────────────────────────────────────

describe("RleCompressionStrategy", () => {
  const strategy = new RleCompressionStrategy();

  it("compresses repeated characters", () => {
    expect(strategy.compress("AAABBC")).toBe("3A2BC");
  });

  it("handles a string with no repetition", () => {
    expect(strategy.compress("ABC")).toBe("ABC");
  });

  it("handles an empty string", () => {
    expect(strategy.compress("")).toBe("");
  });

  it("decompresses back to the original", () => {
    const original = "AAABBC";
    const compressed = strategy.compress(original);
    expect(strategy.decompress(compressed)).toBe(original);
  });
});

describe("NoOpCompressionStrategy", () => {
  const strategy = new NoOpCompressionStrategy();

  it("compress is a passthrough", () => {
    expect(strategy.compress("hello")).toBe("hello");
  });

  it("decompress is a passthrough", () => {
    expect(strategy.decompress("hello")).toBe("hello");
  });
});

describe("DataProcessor (context)", () => {
  it("processes data with RLE strategy", () => {
    const processor = new DataProcessor(new RleCompressionStrategy());
    expect(processor.process("AAABB")).toBe("3A2B");
  });

  it("restores data correctly", () => {
    const processor = new DataProcessor(new RleCompressionStrategy());
    const compressed = processor.process("AAABB");
    expect(processor.restore(compressed)).toBe("AAABB");
  });

  it("can switch to no-op strategy", () => {
    const processor = new DataProcessor(new RleCompressionStrategy());
    processor.setStrategy(new NoOpCompressionStrategy());
    expect(processor.process("AAABB")).toBe("AAABB");
  });
});
