import {
  UserService,
  InMemoryUserRepository,
  ReadOnlyUserRepository,
  type User,
} from "../../dsa/ports-and-adapters";

const alice: User = { id: "1", name: "Alice", email: "alice@example.com" };
const bob: User = { id: "2", name: "Bob", email: "bob@example.com" };

describe("InMemoryUserRepository", () => {
  let repo: InMemoryUserRepository;

  beforeEach(() => {
    repo = new InMemoryUserRepository();
  });

  it("starts empty", async () => {
    expect(repo.size()).toBe(0);
    await expect(repo.findAll()).resolves.toEqual([]);
  });

  it("saves and retrieves a user by id", async () => {
    await repo.save(alice);
    await expect(repo.findById("1")).resolves.toEqual(alice);
  });

  it("returns undefined for unknown id", async () => {
    await expect(repo.findById("unknown")).resolves.toBeUndefined();
  });

  it("lists all saved users", async () => {
    await repo.save(alice);
    await repo.save(bob);
    const all = await repo.findAll();
    expect(all).toHaveLength(2);
  });

  it("deletes a user", async () => {
    await repo.save(alice);
    await repo.delete("1");
    await expect(repo.findById("1")).resolves.toBeUndefined();
    expect(repo.size()).toBe(0);
  });
});

describe("UserService (application core)", () => {
  let repo: InMemoryUserRepository;
  let service: UserService;

  beforeEach(() => {
    repo = new InMemoryUserRepository();
    service = new UserService(repo);
  });

  it("creates and retrieves a user", async () => {
    await service.createUser(alice);
    const found = await service.getUser("1");
    expect(found).toEqual(alice);
  });

  it("throws when creating a duplicate user", async () => {
    await service.createUser(alice);
    await expect(service.createUser(alice)).rejects.toThrow("already exists");
  });

  it("throws when getting a non-existent user", async () => {
    await expect(service.getUser("ghost")).rejects.toThrow("not found");
  });

  it("lists all users", async () => {
    await service.createUser(alice);
    await service.createUser(bob);
    const list = await service.listUsers();
    expect(list).toHaveLength(2);
  });

  it("deletes a user", async () => {
    await service.createUser(alice);
    await service.deleteUser("1");
    await expect(service.getUser("1")).rejects.toThrow("not found");
  });
});

describe("ReadOnlyUserRepository", () => {
  it("allows reads", async () => {
    const source = new InMemoryUserRepository();
    await source.save(alice);
    const ro = new ReadOnlyUserRepository(source);
    await expect(ro.findById("1")).resolves.toEqual(alice);
    await expect(ro.findAll()).resolves.toHaveLength(1);
  });

  it("rejects save", async () => {
    const ro = new ReadOnlyUserRepository(new InMemoryUserRepository());
    await expect(ro.save(alice)).rejects.toThrow("save not allowed");
  });

  it("rejects delete", async () => {
    const ro = new ReadOnlyUserRepository(new InMemoryUserRepository());
    await expect(ro.delete("1")).rejects.toThrow("delete not allowed");
  });
});
