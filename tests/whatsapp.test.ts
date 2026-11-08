import { afterEach, describe, expect, it, vi } from "vitest";

import { getWhatsAppHref } from "../lib/contact/whatsapp";

describe("getWhatsAppHref", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("builds a WhatsApp link with the configured number and initial message", () => {
    vi.stubEnv("NEXT_PUBLIC_WHATSAPP_NUMBER", "+54 9 11 6997-5989");

    expect(getWhatsAppHref()).toBe(
      "https://wa.me/5491169975989?text=Hola%2C+quiero+hacer+una+consulta+sobre+sus+servicios.",
    );
  });

  it("does not create a link when the number is missing or invalid", () => {
    vi.stubEnv("NEXT_PUBLIC_WHATSAPP_NUMBER", "");
    expect(getWhatsAppHref()).toBeUndefined();

    vi.stubEnv("NEXT_PUBLIC_WHATSAPP_NUMBER", "+1234567");
    expect(getWhatsAppHref()).toBeUndefined();
  });
});
