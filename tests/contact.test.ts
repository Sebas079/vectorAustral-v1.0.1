import { describe, expect, it } from "vitest";

import { getWhatsAppHref } from "../lib/contact";

describe("getWhatsAppHref", () => {
  it("creates a wa.me link from the configured phone number", () => {
    expect(getWhatsAppHref("+54 9 11 5555-1234")).toBe(
      "https://wa.me/5491155551234",
    );
  });

  it("does not create a link when the value has no digits", () => {
    expect(getWhatsAppHref("not configured")).toBeUndefined();
  });
});
