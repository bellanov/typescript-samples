import {
  greeting,
  version,
  isActive,
  Direction,
  isString,
  isUser,
  createUser,
} from "../simple-types";

describe("simple-types", () => {
  describe("primitive constants", () => {
    it("exports greeting string", () => {
      expect(typeof greeting).toBe("string");
      expect(greeting).toBe("Hello, TypeScript!");
    });

    it("exports version number", () => {
      expect(typeof version).toBe("number");
      expect(version).toBe(1);
    });

    it("exports isActive boolean", () => {
      expect(typeof isActive).toBe("boolean");
      expect(isActive).toBe(true);
    });
  });

  describe("Direction enum", () => {
    it("has expected values", () => {
      expect(Direction.North).toBe("NORTH");
      expect(Direction.South).toBe("SOUTH");
      expect(Direction.East).toBe("EAST");
      expect(Direction.West).toBe("WEST");
    });
  });

  describe("isString type guard", () => {
    it("returns true for strings", () => {
      expect(isString("hello")).toBe(true);
      expect(isString("")).toBe(true);
    });

    it("returns false for non-strings", () => {
      expect(isString(42)).toBe(false);
      expect(isString(null)).toBe(false);
      expect(isString(undefined)).toBe(false);
      expect(isString({})).toBe(false);
    });
  });

  describe("isUser type guard", () => {
    it("returns true for valid user objects", () => {
      expect(isUser({ id: 1, name: "Alice" })).toBe(true);
      expect(isUser({ id: "u1", name: "Bob", email: "bob@example.com" })).toBe(
        true,
      );
    });

    it("returns false for invalid objects", () => {
      expect(isUser(null)).toBe(false);
      expect(isUser(undefined)).toBe(false);
      expect(isUser({ name: "No ID" })).toBe(false);
      expect(isUser({ id: 1 })).toBe(false);
      expect(isUser("string")).toBe(false);
    });
  });

  describe("createUser", () => {
    it("creates a user without email", () => {
      const user = createUser(1, "Alice");
      expect(user.id).toBe(1);
      expect(user.name).toBe("Alice");
      expect(user.email).toBeUndefined();
    });

    it("creates a user with email", () => {
      const user = createUser("u1", "Bob", "bob@example.com");
      expect(user.id).toBe("u1");
      expect(user.name).toBe("Bob");
      expect(user.email).toBe("bob@example.com");
    });
  });
});
