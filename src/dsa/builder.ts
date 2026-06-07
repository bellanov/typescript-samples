/**
 * @fileoverview Builder Pattern
 * Demonstrates the Builder design pattern, which separates the construction
 * of a complex object from its representation, allowing the same construction
 * process to produce different results.
 */

// ── Product ───────────────────────────────────────────────────────────────────

export interface HttpRequest {
  readonly method: string;
  readonly url: string;
  readonly headers: Readonly<Record<string, string>>;
  readonly queryParams: Readonly<Record<string, string>>;
  readonly body: unknown;
  readonly timeoutMs: number;
}

// ── Builder ───────────────────────────────────────────────────────────────────

export class HttpRequestBuilder {
  private _method: string = "GET";
  private _url: string = "";
  private _headers: Record<string, string> = {};
  private _queryParams: Record<string, string> = {};
  private _body: unknown = undefined;
  private _timeoutMs: number = 5000;

  method(method: string): this {
    this._method = method.toUpperCase();
    return this;
  }

  url(url: string): this {
    this._url = url;
    return this;
  }

  header(name: string, value: string): this {
    this._headers[name] = value;
    return this;
  }

  queryParam(name: string, value: string): this {
    this._queryParams[name] = value;
    return this;
  }

  body(payload: unknown): this {
    this._body = payload;
    return this;
  }

  timeout(ms: number): this {
    if (ms <= 0) throw new RangeError("Timeout must be a positive number");
    this._timeoutMs = ms;
    return this;
  }

  build(): HttpRequest {
    if (!this._url) throw new Error("URL is required");
    return {
      method: this._method,
      url: this._url,
      headers: { ...this._headers },
      queryParams: { ...this._queryParams },
      body: this._body,
      timeoutMs: this._timeoutMs,
    };
  }
}

// ── Director (optional convenience wrapper) ───────────────────────────────────

export class HttpRequestDirector {
  static jsonPost(url: string, payload: unknown): HttpRequest {
    return new HttpRequestBuilder()
      .method("POST")
      .url(url)
      .header("Content-Type", "application/json")
      .header("Accept", "application/json")
      .body(payload)
      .build();
  }

  static authenticatedGet(url: string, bearerToken: string): HttpRequest {
    return new HttpRequestBuilder()
      .method("GET")
      .url(url)
      .header("Authorization", "Bearer " + bearerToken)
      .build();
  }
}
