import { afterEach, describe, expect, it, vi } from "vitest";

import { verifyTurnstileToken } from "../lib/security/turnstile";

describe("verifyTurnstileToken", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("accepts only successful tokens from the configured hostname", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "server-secret");
    vi.stubEnv("TURNSTILE_HOSTNAME", "www.example.com");
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        Response.json({ success: true, hostname: "www.example.com" }),
      );

    await expect(
      verifyTurnstileToken("valid-token", "192.0.2.25"),
    ).resolves.toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          secret: "server-secret",
          response: "valid-token",
          remoteip: "192.0.2.25",
        }),
      }),
    );
  });

  it("rejects a successful token issued for a different hostname", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "server-secret");
    vi.stubEnv("TURNSTILE_HOSTNAME", "www.example.com");
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      Response.json({ success: true, hostname: "attacker.example" }),
    );

    await expect(
      verifyTurnstileToken("valid-token", "192.0.2.25"),
    ).resolves.toBe(false);
  });
});
