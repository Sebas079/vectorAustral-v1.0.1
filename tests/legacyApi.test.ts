import { beforeEach, describe, expect, it, vi } from "vitest";

const { rateLimitMock, verifyTokenMock } = vi.hoisted(() => ({
  rateLimitMock: vi.fn(),
  verifyTokenMock: vi.fn(),
}));

vi.mock("../lib/security/leadRateLimit", () => ({
  getSubmissionRetryAfter: rateLimitMock,
}));
vi.mock("../lib/security/turnstile", () => ({
  verifyTurnstileToken: verifyTokenMock,
  TurnstileUnavailableError: class TurnstileUnavailableError extends Error {},
}));

import { POST as submitContact } from "../app/api/contact/route";
import { POST as sendVectorUnoMessage } from "../app/api/vectoruno/route";

const headers = {
  "content-type": "application/json",
  "x-real-ip": "192.0.2.25",
};

describe("legacy API routes", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.resetAllMocks();
    vi.stubEnv("CONTACT_WEBHOOK_URL", "https://hooks.example/contact");
    vi.stubEnv("VECTORUNO_WEBHOOK_URL", "https://hooks.example/vectoruno");
    vi.stubEnv("CONTACT_WEBHOOK_SECRET", "");
    vi.stubEnv("VECTORUNO_WEBHOOK_SECRET", "");
    vi.stubEnv("ALLOWED_ORIGINS", "");
    rateLimitMock.mockResolvedValue(0);
    verifyTokenMock.mockResolvedValue(true);
  });

  it("rejects legacy contact requests without a valid Turnstile token", async () => {
    verifyTokenMock.mockResolvedValueOnce(false);
    const fetchMock = vi.spyOn(globalThis, "fetch");
    const response = await submitContact(
      new Request("http://localhost/api/contact", {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: "Ana Gómez",
          email: "ana@example.com",
          message: "Necesito más información.",
          captchaToken: "invalid-token",
        }),
      }),
    );

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns an explicit error when the contact webhook fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(null, { status: 500 }),
    );
    const response = await submitContact(
      new Request("http://localhost/api/contact", {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: "Ana Gómez",
          email: "ana@example.com",
          message: "Necesito más información.",
          captchaToken: "valid-token",
        }),
      }),
    );

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({
      error: "Contact service unavailable",
    });
  });

  it("rate limits verified legacy contact submissions before forwarding", async () => {
    rateLimitMock.mockResolvedValueOnce(4);
    const fetchMock = vi.spyOn(globalThis, "fetch");
    const response = await submitContact(
      new Request("http://localhost/api/contact", {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: "Ana Gómez",
          email: "ana@example.com",
          message: "Necesito más información.",
          captchaToken: "valid-token",
        }),
      }),
    );

    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("4");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not report success when the contact webhook is absent", async () => {
    vi.stubEnv("CONTACT_WEBHOOK_URL", "");
    const fetchMock = vi.spyOn(globalThis, "fetch");
    const response = await submitContact(
      new Request("http://localhost/api/contact", {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: "Ana Gómez",
          email: "ana@example.com",
          message: "Necesito más información.",
          captchaToken: "valid-token",
        }),
      }),
    );

    expect(response.status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects unknown properties in Vector Uno requests", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    const response = await sendVectorUnoMessage(
      new Request("http://localhost/api/vectoruno", {
        method: "POST",
        headers,
        body: JSON.stringify({ message: "Hola", extra: "not allowed" }),
      }),
    );

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects legacy API requests from origins outside the configured allowlist", async () => {
    vi.stubEnv("ALLOWED_ORIGINS", "https://vector.example");
    const fetchMock = vi.spyOn(globalThis, "fetch");
    const response = await sendVectorUnoMessage(
      new Request("http://localhost/api/vectoruno", {
        method: "POST",
        headers: {
          ...headers,
          origin: "https://attacker.example",
        },
        body: JSON.stringify({ message: "Hola" }),
      }),
    );

    expect(response.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns an explicit error when the Vector Uno webhook fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(null, { status: 500 }),
    );
    const response = await sendVectorUnoMessage(
      new Request("http://localhost/api/vectoruno", {
        method: "POST",
        headers,
        body: JSON.stringify({ message: "Hola" }),
      }),
    );

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({
      error: "Vector Uno service unavailable",
    });
  });

  it("does not report success when the Vector Uno webhook is absent", async () => {
    vi.stubEnv("VECTORUNO_WEBHOOK_URL", "");
    const fetchMock = vi.spyOn(globalThis, "fetch");
    const response = await sendVectorUnoMessage(
      new Request("http://localhost/api/vectoruno", {
        method: "POST",
        headers,
        body: JSON.stringify({ message: "Hola" }),
      }),
    );

    expect(response.status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
