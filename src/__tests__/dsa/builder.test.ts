import {
  HttpRequestBuilder,
  HttpRequestDirector,
} from "../../dsa/builder";

describe("HttpRequestBuilder", () => {
  it("builds a GET request with defaults", () => {
    const req = new HttpRequestBuilder().url("https://example.com").build();
    expect(req.method).toBe("GET");
    expect(req.url).toBe("https://example.com");
    expect(req.timeoutMs).toBe(5000);
    expect(req.body).toBeUndefined();
  });

  it("uppercases the HTTP method", () => {
    const req = new HttpRequestBuilder()
      .method("post")
      .url("https://example.com")
      .build();
    expect(req.method).toBe("POST");
  });

  it("chains multiple headers", () => {
    const req = new HttpRequestBuilder()
      .url("https://example.com")
      .header("Content-Type", "application/json")
      .header("Accept", "application/json")
      .build();
    expect(req.headers["Content-Type"]).toBe("application/json");
    expect(req.headers["Accept"]).toBe("application/json");
  });

  it("chains query parameters", () => {
    const req = new HttpRequestBuilder()
      .url("https://example.com")
      .queryParam("page", "1")
      .queryParam("limit", "20")
      .build();
    expect(req.queryParams["page"]).toBe("1");
    expect(req.queryParams["limit"]).toBe("20");
  });

  it("sets the request body", () => {
    const payload = { name: "Alice" };
    const req = new HttpRequestBuilder()
      .url("https://example.com")
      .body(payload)
      .build();
    expect(req.body).toEqual(payload);
  });

  it("sets a custom timeout", () => {
    const req = new HttpRequestBuilder()
      .url("https://example.com")
      .timeout(10_000)
      .build();
    expect(req.timeoutMs).toBe(10_000);
  });

  it("throws when URL is missing", () => {
    expect(() => new HttpRequestBuilder().build()).toThrow("URL is required");
  });

  it("throws when timeout is non-positive", () => {
    expect(() => new HttpRequestBuilder().timeout(0)).toThrow(RangeError);
    expect(() => new HttpRequestBuilder().timeout(-1)).toThrow(RangeError);
  });

  it("built headers are a frozen copy (mutating the original does not affect the product)", () => {
    const builder = new HttpRequestBuilder()
      .url("https://example.com")
      .header("X-Custom", "value");
    const req = builder.build();
    // Add another header after build — should not appear in req
    builder.header("X-Extra", "extra");
    const req2 = builder.build();
    expect(req.headers["X-Extra"]).toBeUndefined();
    expect(req2.headers["X-Extra"]).toBe("extra");
  });
});

describe("HttpRequestDirector", () => {
  it("creates a JSON POST request", () => {
    const payload = { key: "value" };
    const req = HttpRequestDirector.jsonPost("https://api.example.com", payload);
    expect(req.method).toBe("POST");
    expect(req.headers["Content-Type"]).toBe("application/json");
    expect(req.headers["Accept"]).toBe("application/json");
    expect(req.body).toEqual(payload);
  });

  it("creates an authenticated GET request", () => {
    const req = HttpRequestDirector.authenticatedGet(
      "https://api.example.com/me",
      "my-token",
    );
    expect(req.method).toBe("GET");
    const expectedAuth = "Bearer " + "my-token";
    expect(req.headers["Authorization"]).toBe(expectedAuth);
  });
});
