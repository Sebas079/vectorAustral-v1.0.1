import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ChatWidget from "../components/ChatWidget";

describe("ChatWidget", () => {
  it("opens and closes the chat", () => {
    render(<ChatWidget />);

    fireEvent.click(
      screen.getByRole("button", { name: /hablar con vector uno/i }),
    );
    expect(
      screen.getByRole("region", { name: "Chat de Vector Uno" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cerrar chat" }));
    expect(
      screen.queryByRole("region", { name: "Chat de Vector Uno" }),
    ).not.toBeInTheDocument();
  });

  it("sends messages and shows the bot response", () => {
    render(<ChatWidget />);
    fireEvent.click(
      screen.getByRole("button", { name: /hablar con vector uno/i }),
    );
    fireEvent.change(screen.getByLabelText("Escribí tu consulta"), {
      target: { value: "¿Qué hacen con n8n?" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Enviar" }));

    expect(screen.getByText("¿Qué hacen con n8n?")).toBeInTheDocument();
    expect(screen.getByText(/Conectamos CRM, ERP/)).toBeInTheDocument();
  });

  it("offers a direct link to the contact form", () => {
    render(<ChatWidget />);
    fireEvent.click(
      screen.getByRole("button", { name: /hablar con vector uno/i }),
    );

    expect(
      screen.getByRole("link", { name: "Hablar con un especialista" }),
    ).toHaveAttribute("href", "#contacto");
  });
});
