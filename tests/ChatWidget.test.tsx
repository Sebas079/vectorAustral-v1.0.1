import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

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

  it("sends messages to the server and shows the latest knowledge response", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        Response.json({ message: "Respuesta vigente desde Sheets." }),
      );
    render(<ChatWidget />);
    fireEvent.click(
      screen.getByRole("button", { name: /hablar con vector uno/i }),
    );
    fireEvent.change(screen.getByLabelText("Escribí tu consulta"), {
      target: { value: "¿Qué hacen con n8n?" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Enviar" }));

    expect(screen.getByText("¿Qué hacen con n8n?")).toBeInTheDocument();
    await waitFor(() =>
      expect(
        screen.getByText("Respuesta vigente desde Sheets."),
      ).toBeInTheDocument(),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/vectoruno/chat",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ message: "¿Qué hacen con n8n?" }),
      }),
    );
  });

  it("uses a safe fallback when the chat service is unavailable", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(
      new Error("service unavailable"),
    );
    render(<ChatWidget />);
    fireEvent.click(
      screen.getByRole("button", { name: /hablar con vector uno/i }),
    );
    fireEvent.change(screen.getByLabelText("Escribí tu consulta"), {
      target: { value: "¿Qué ofrecen?" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Enviar" }));

    await waitFor(() =>
      expect(
        screen.getByText(/no puedo consultar mi base de respuestas/i),
      ).toBeInTheDocument(),
    );
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
