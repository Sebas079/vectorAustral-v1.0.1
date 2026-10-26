import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import ContactForm from "../components/ContactForm";

vi.mock("../components/TurnstileWidget", () => ({
  default: ({
    onToken,
    onError,
  }: {
    onToken: (token: string) => void;
    onError: () => void;
  }) => (
    <div>
      <button type="button" onClick={() => onToken("turnstile-token")}>
        Verificar persona
      </button>
      <button type="button" onClick={onError}>
        Simular error de verificación
      </button>
    </div>
  ),
}));

describe("ContactForm", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubEnv("NEXT_PUBLIC_WHATSAPP_NUMBER", "5491100000000");
    vi.stubEnv("NEXT_PUBLIC_CONTACT_EMAIL", "contacto@vectoraustral.com");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  function enterValidContact() {
    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "Ana Gómez" },
    });
    fireEvent.change(screen.getByLabelText("Teléfono"), {
      target: { value: "+54 9 11 5555-1234" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "ana@example.com" },
    });
    fireEvent.change(screen.getByLabelText("¿Qué necesitás mejorar?"), {
      target: { value: "Automatizar consultas." },
    });
  }

  it("renders the four lead fields and requires a real verification token", () => {
    render(<ContactForm />);

    expect(screen.getByLabelText("Nombre")).toBeInTheDocument();
    expect(screen.getByLabelText("Teléfono")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(
      screen.getByLabelText("¿Qué necesitás mejorar?"),
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: /solicitar diagnóstico/i }),
    );
    expect(
      screen.getByText("Completá la verificación humana."),
    ).toBeInTheDocument();
  });

  it("looks up an existing lead only after verification and prefills its name", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        Response.json({ match: true, fullName: "Ana Gómez" }),
      );
    render(<ContactForm />);
    fireEvent.change(screen.getByLabelText("Teléfono"), {
      target: { value: "+54 9 11 5555-1234" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "ana@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Verificar persona" }));
    fireEvent.click(screen.getByRole("button", { name: /buscar mis datos/i }));

    await waitFor(() =>
      expect(screen.getByLabelText("Nombre")).toHaveValue("Ana Gómez"),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/leads/lookup",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          email: "ana@example.com",
          phone: "+54 9 11 5555-1234",
          captchaToken: "turnstile-token",
        }),
      }),
    );
  });

  it("submits a valid lead through the server API and shows confirmation", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(Response.json({ id: "lead-1" }));
    render(<ContactForm />);
    enterValidContact();
    fireEvent.click(screen.getByRole("button", { name: "Verificar persona" }));
    fireEvent.click(
      screen.getByRole("button", { name: /solicitar diagnóstico/i }),
    );

    await waitFor(() =>
      expect(
        screen.getByText(
          "Recibimos tu consulta. En breve nos pondremos en contacto.",
        ),
      ).toBeInTheDocument(),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/leads",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          fullName: "Ana Gómez",
          phone: "+54 9 11 5555-1234",
          email: "ana@example.com",
          reason: "Automatizar consultas.",
          captchaToken: "turnstile-token",
          honeypot: "",
        }),
      }),
    );
  });

  it("shows fallback actions when the server rejects the submission", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      Response.json({ error: "submission_failed" }, { status: 500 }),
    );
    render(<ContactForm />);
    enterValidContact();
    fireEvent.click(screen.getByRole("button", { name: "Verificar persona" }));
    fireEvent.click(
      screen.getByRole("button", { name: /solicitar diagnóstico/i }),
    );

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Tuvimos un problema, volvé a intentar más tarde.",
      ),
    );
    expect(
      screen.getByRole("link", { name: "Escribir por email" }),
    ).toHaveAttribute("href", "mailto:contacto@vectoraustral.com");
    expect(
      screen.getByRole("link", { name: "Contactar por WhatsApp" }),
    ).toHaveAttribute("href", "https://wa.me/5491100000000");
  });

  it("shows email and WhatsApp actions when Turnstile is unavailable", () => {
    render(<ContactForm />);
    fireEvent.click(
      screen.getByRole("button", { name: "Simular error de verificación" }),
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "No pudimos cargar o validar la verificación humana.",
    );
    expect(
      screen.getByRole("button", { name: "Volver a verificar" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Escribir por email" }),
    ).toHaveAttribute("href", "mailto:contacto@vectoraustral.com");
    expect(
      screen.getByRole("link", { name: "Contactar por WhatsApp" }),
    ).toHaveAttribute("href", "https://wa.me/5491100000000");

    fireEvent.click(screen.getByRole("button", { name: "Volver a verificar" }));

    expect(
      screen.queryByRole("link", { name: "Escribir por email" }),
    ).not.toBeInTheDocument();
  });

  it("keeps WhatsApp fallback visible but disabled when no number is configured", () => {
    vi.stubEnv("NEXT_PUBLIC_WHATSAPP_NUMBER", "");
    render(<ContactForm />);
    fireEvent.click(
      screen.getByRole("button", { name: "Simular error de verificación" }),
    );

    expect(
      screen.getByRole("button", { name: "WhatsApp no disponible" }),
    ).toBeDisabled();
  });
});
