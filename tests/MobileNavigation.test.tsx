import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import MobileNavigation from "../components/MobileNavigation";

describe("MobileNavigation", () => {
  it("closes after selecting an anchor", () => {
    render(
      <MobileNavigation
        items={[
          { href: "#inicio", label: "Inicio" },
          { href: "#servicios", label: "Servicios" },
        ]}
      />,
    );

    const details = screen.getByText("Menú").closest("details");
    if (!details) {
      throw new Error("No se encontró el contenedor del menú móvil.");
    }

    details.open = true;
    fireEvent.click(
      within(
        screen.getByRole("navigation", {
          name: "Navegación principal móvil",
        }),
      ).getByRole("link", { name: "Servicios" }),
    );

    expect(details.open).toBe(false);
  });
});
