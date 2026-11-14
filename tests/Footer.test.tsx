import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import Footer from "../components/Footer";

describe("Footer", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("renders an accessible, icon-only WhatsApp link with the initial message", () => {
    vi.stubEnv("NEXT_PUBLIC_WHATSAPP_NUMBER", "+5491169975989");
    render(<Footer />);

    const whatsappLink = screen.getByRole("link", {
      name: "Abrir chat de WhatsApp",
    });
    expect(whatsappLink).toHaveAttribute(
      "href",
      "https://wa.me/5491169975989?text=Hola%2C+quiero+hacer+una+consulta+sobre+sus+servicios.",
    );
    expect(whatsappLink).toHaveClass("size-11", "sm:size-12");
    expect(whatsappLink).not.toHaveTextContent("WhatsApp");
  });
});
