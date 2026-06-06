import {
  Stack,
  first,
  last,
  chunk,
  unique,
  flatten,
  sum,
  average,
  groupBy,
} from "../arrays";

describe("Stack", () => {
  it("starts empty", () => {
    const stack = new Stack<number>();
    expect(stack.isEmpty()).toBe(true);
    expect(stack.size).toBe(0);
  });

  it("pushes and peeks items", () => {
    const stack = new Stack<string>();
    stack.push("a");
    stack.push("b");
    expect(stack.peek()).toBe("b");
    expect(stack.size).toBe(2);
  });

  it("pops items in LIFO order", () => {
    const stack = new Stack<number>();
    stack.push(1);
    stack.push(2);
    stack.push(3);
    expect(stack.pop()).toBe(3);
    expect(stack.pop()).toBe(2);
    expect(stack.size).toBe(1);
  });

  it("returns undefined when popping an empty stack", () => {
    const stack = new Stack<number>();
    expect(stack.pop()).toBeUndefined();
  });

  it("toArray returns a copy", () => {
    const stack = new Stack<number>();
    stack.push(1);
    stack.push(2);
    const arr = stack.toArray();
    arr.push(99);
    expect(stack.size).toBe(2);
  });
});

describe("first", () => {
  it("returns the first element", () => {
    expect(first([10, 20, 30])).toBe(10);
  });

  it("returns undefined for empty array", () => {
    expect(first([])).toBeUndefined();
  });
});

describe("last", () => {
  it("returns the last element", () => {
    expect(last([10, 20, 30])).toBe(30);
  });

  it("returns undefined for empty array", () => {
    expect(last([])).toBeUndefined();
  });
});

describe("chunk", () => {
  it("splits array into chunks of the given size", () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it("handles array length divisible by chunk size", () => {
    expect(chunk([1, 2, 3, 4], 2)).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  it("throws RangeError for size <= 0", () => {
    expect(() => chunk([1, 2], 0)).toThrow(RangeError);
    expect(() => chunk([1, 2], -1)).toThrow(RangeError);
  });

  it("returns empty array for empty input", () => {
    expect(chunk([], 3)).toEqual([]);
  });
});

describe("unique", () => {
  it("removes duplicate values", () => {
    expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
  });

  it("works with strings", () => {
    expect(unique(["a", "b", "a"])).toEqual(["a", "b"]);
  });
});

describe("flatten", () => {
  it("flattens a 2D array", () => {
    expect(flatten([[1, 2], [3, 4], [5]])).toEqual([1, 2, 3, 4, 5]);
  });

  it("handles empty inner arrays", () => {
    expect(flatten([[], [1], []])).toEqual([1]);
  });
});

describe("sum", () => {
  it("sums an array of numbers", () => {
    expect(sum([1, 2, 3, 4])).toBe(10);
  });

  it("returns 0 for an empty array", () => {
    expect(sum([])).toBe(0);
  });
});

describe("average", () => {
  it("calculates the average", () => {
    expect(average([1, 2, 3, 4])).toBe(2.5);
  });

  it("returns 0 for an empty array", () => {
    expect(average([])).toBe(0);
  });
});

describe("groupBy", () => {
  it("groups items by a key function", () => {
    const words = ["one", "two", "three", "four", "five"];
    const grouped = groupBy(words, (w) => w.length);
    expect(grouped[3]).toEqual(["one", "two"]);
    expect(grouped[4]).toEqual(["four", "five"]);
    expect(grouped[5]).toEqual(["three"]);
  });
});
