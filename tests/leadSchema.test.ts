import { describe, expect, it } from "vitest";

import {
  leadSchema,
  leadLookupSchema,
  leadSubmissionSchema,
} from "../lib/validators/leadSchema";

const validLead = {
  fullName: "Ana Gómez",
  phone: "+54 9 11 5555-1234",
  email: "ana@example.com",
  reason: "Necesito automatizar la gestión de consultas.",
};

describe("leadSchema", () => {
  it("accepts a valid lead", () => {
    expect(leadSchema.safeParse(validLead).success).toBe(true);
  });

  it("requires valid contact details and a verified token for lookup", () => {
    expect(
      leadLookupSchema.safeParse({
        email: validLead.email,
        phone: validLead.phone,
        captchaToken: "turnstile-token",
      }).success,
    ).toBe(true);
    expect(
      leadLookupSchema.safeParse({
        email: validLead.email,
        phone: validLead.phone,
        captchaToken: "",
      }).success,
    ).toBe(false);
  });

  it("accepts a strict submission payload with Turnstile token", () => {
    expect(
      leadSubmissionSchema.safeParse({
        ...validLead,
        captchaToken: "turnstile-token",
        honeypot: "",
      }).success,
    ).toBe(true);
    expect(
      leadSubmissionSchema.safeParse({
        ...validLead,
        captchaToken: "turnstile-token",
        extra: "not allowed",
      }).success,
    ).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = leadSchema.safeParse({
      ...validLead,
      email: "ana-example.com",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Ingresá un email válido.");
    }
  });

  it("rejects an invalid phone number", () => {
    const result = leadSchema.safeParse({
      ...validLead,
      phone: "123",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "Ingresá un teléfono válido.",
      );
    }
  });

  it("rejects empty required fields", () => {
    const result = leadSchema.safeParse({
      fullName: " ",
      phone: "",
      email: "",
      reason: " ",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.message)).toEqual([
        "El nombre es obligatorio.",
        "El teléfono es obligatorio.",
        "El email es obligatorio.",
        "El motivo es obligatorio.",
      ]);
    }
  });

  it("rejects unknown fields", () => {
    const result = leadSchema.safeParse({
      ...validLead,
      unexpectedField: "not allowed",
    });

    expect(result.success).toBe(false);
  });
});
