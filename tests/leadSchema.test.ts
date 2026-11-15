import { describe, expect, it } from "vitest";

import {
  leadSchema,
  leadLookupSchema,
  leadSubmissionSchema,
  normalizeLeadInput,
} from "../lib/validators/leadSchema";

const validLead = {
  fullName: "Ana Gómez",
  contact: "ana@example.com",
  reason: "Necesito automatizar la gestión de consultas.",
};

describe("leadSchema", () => {
  it("accepts a valid lead", () => {
    expect(leadSchema.safeParse(validLead).success).toBe(true);
  });

  it("requires valid contact details and a verified token for lookup", () => {
    expect(
      leadLookupSchema.safeParse({
        email: validLead.contact,
        phone: "+54 9 11 5555-1234",
        captchaToken: "turnstile-token",
      }).success,
    ).toBe(true);
    expect(
      leadLookupSchema.safeParse({
        email: validLead.contact,
        phone: "+54 9 11 5555-1234",
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
      contact: "ana-example.com",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "Ingresá un email o un número de WhatsApp válido.",
      );
    }
  });

  it("accepts a WhatsApp number as the single contact field", () => {
    expect(
      leadSchema.safeParse({
        ...validLead,
        contact: "+54 9 11 5555-1234",
      }).success,
    ).toBe(true);
  });

  it("normalizes the contact field into the matching lead channel", () => {
    expect(normalizeLeadInput(validLead)).toMatchObject({
      email: "ana@example.com",
      phone: "",
    });
    expect(
      normalizeLeadInput({
        ...validLead,
        contact: "+54 9 11 5555-1234",
      }),
    ).toMatchObject({
      email: "",
      phone: "+54 9 11 5555-1234",
    });
  });

  it("rejects a malformed phone number", () => {
    const result = leadSchema.safeParse({
      ...validLead,
      contact: "123",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "Ingresá un email o un número de WhatsApp válido.",
      );
    }
  });

  it("rejects empty required fields", () => {
    const result = leadSchema.safeParse({
      fullName: " ",
      contact: "",
      reason: " ",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.message)).toEqual([
        "El nombre es obligatorio.",
        "El dato de contacto es obligatorio.",
        "Contanos qué necesitás resolver.",
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
