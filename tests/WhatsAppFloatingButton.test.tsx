import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import WhatsAppFloatingButton from "../components/WhatsAppFloatingButton";

describe("WhatsApp contact actions", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("links to the configured WhatsApp number in the floating action", () => {
    vi.stubEnv("NEXT_PUBLIC_WHATSAPP_NUMBER", "+54 9 11 5555-1234");
    render(<WhatsAppFloatingButton />);

    expect(
      screen.getByRole("link", { name: "Hablar por WhatsApp" }),
    ).toHaveAttribute("href", "https://wa.me/5491155551234");
    expect(
      screen
        .getByRole("link", { name: "Hablar por WhatsApp" })
        .querySelector("img"),
    ).toHaveAttribute("src", "/assets/brand/whatsapp-brands-solid-full.svg");
  });

  it("hides the floating action when WhatsApp is unavailable", () => {
    vi.stubEnv("NEXT_PUBLIC_WHATSAPP_NUMBER", "");
    render(<WhatsAppFloatingButton />);

    expect(
      screen.queryByRole("link", { name: "Hablar por WhatsApp" }),
    ).not.toBeInTheDocument();
  });
});
