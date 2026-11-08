import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import Footer from "../components/Footer";

describe("Footer", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("links to the configured WhatsApp number with the initial message", () => {
    vi.stubEnv("NEXT_PUBLIC_WHATSAPP_NUMBER", "+5491169975989");
    render(<Footer />);

    expect(screen.getByRole("link", { name: "WhatsApp" })).toHaveAttribute(
      "href",
      "https://wa.me/5491169975989?text=Hola%2C+quiero+hacer+una+consulta+sobre+sus+servicios.",
    );
  });
});
