import { describe, expect, it } from "vitest";

import { answerBot } from "../lib/bot/botEngine";

describe("answerBot", () => {
  it("answers questions about services from the knowledge base", () => {
    const result = answerBot("¿Qué automatizaciones con n8n realizan?");

    expect(result.intent).toBe("knowledge");
    expect(result.shouldRedirectToContact).toBe(false);
    expect(result.message).toContain("n8n");
  });

  it("redirects pricing questions to a human specialist", () => {
    const result = answerBot("¿Cuánto cuesta una plataforma web?");

    expect(result.intent).toBe("pricing");
    expect(result.shouldRedirectToContact).toBe(true);
    expect(result.message).toContain("No realizo presupuestos automáticos");
    expect(result.message).toContain("especialista");
    expect(result.message).not.toMatch(/\d/);
  });

  it("uses an explicit fallback for unknown topics", () => {
    const result = answerBot("¿Cuál es el clima de mañana?");

    expect(result.intent).toBe("fallback");
    expect(result.shouldRedirectToContact).toBe(true);
    expect(result.message).toContain("sin inventar datos");
  });

  it("falls back when the message is empty", () => {
    const result = answerBot("   ");

    expect(result.intent).toBe("fallback");
    expect(result.shouldRedirectToContact).toBe(true);
  });
});
