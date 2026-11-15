import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import FloatingWhatsApp from "../components/FloatingWhatsApp";

describe("FloatingWhatsApp", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("keeps an accessible WhatsApp link fixed in the opposite corner", () => {
    vi.stubEnv("NEXT_PUBLIC_WHATSAPP_NUMBER", "+5491169975989");
    render(<FloatingWhatsApp />);

    const link = screen.getByRole("link", { name: "Abrir chat de WhatsApp" });
    expect(link).toHaveAttribute(
      "href",
      "https://wa.me/5491169975989?text=Hola%2C+quiero+hacer+una+consulta+sobre+sus+servicios.",
    );
    expect(link.parentElement).toHaveClass(
      "fixed",
      "left-4",
      "z-30",
      "sm:left-5",
    );
    expect(link).toHaveClass("size-11", "sm:size-12");
    expect(link).toHaveClass("bg-[#25D366]");
  });

  it("does not render a floating link when no destination is configured", () => {
    vi.stubEnv("NEXT_PUBLIC_WHATSAPP_NUMBER", "");
    const { container } = render(<FloatingWhatsApp />);

    expect(container).toBeEmptyDOMElement();
  });
});
