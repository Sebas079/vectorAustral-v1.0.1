import { describe, expect, it } from "vitest";

import { getRetryAfterSeconds } from "../lib/security/leadRateLimit";

describe("getRetryAfterSeconds", () => {
  it("returns the remaining whole seconds before the next allowed submission", () => {
    expect(getRetryAfterSeconds(1_000, 1_001)).toBe(10);
    expect(getRetryAfterSeconds(1_000, 2_500)).toBe(9);
    expect(getRetryAfterSeconds(1_000, 10_999)).toBe(1);
    expect(getRetryAfterSeconds(1_000, 11_000)).toBe(0);
  });
});
