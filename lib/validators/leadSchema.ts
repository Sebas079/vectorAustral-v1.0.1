import { z } from "zod";

const phonePattern = /^\+?[0-9][0-9\s().-]{7,18}[0-9]$/;

export const leadSchema = z.strictObject({
  fullName: z.string().trim().min(1, "El nombre es obligatorio."),
  contact: z
    .string()
    .trim()
    .min(1, "El dato de contacto es obligatorio.")
    .max(254, "El dato de contacto es demasiado largo.")
    .refine(
      (value) =>
        value.length === 0 ||
        z.email().safeParse(value).success ||
        phonePattern.test(value),
      "Ingresá un email o un número de WhatsApp válido.",
    ),
  reason: z.string().trim().min(1, "Contanos qué necesitás resolver."),
});

export const leadSubmissionSchema = leadSchema.extend({
  captchaToken: z
    .string()
    .trim()
    .min(1, "Completá la verificación humana.")
    .max(2048),
  honeypot: z
    .string()
    .trim()
    .max(0, "No se pudo validar el envío. Volvé a intentar.")
    .optional(),
});

export const leadLookupSchema = z.strictObject({
  email: z.string().trim().pipe(z.email("Ingresá un email válido.")),
  phone: z
    .string()
    .trim()
    .min(1, "El teléfono es obligatorio.")
    .regex(phonePattern, "Ingresá un teléfono válido."),
  captchaToken: z
    .string()
    .trim()
    .min(1, "Completá la verificación humana.")
    .max(2048),
});

export type LeadFormInput = z.infer<typeof leadSchema>;

export interface LeadInput {
  fullName: string;
  email: string;
  phone: string;
  reason: string;
}

export function normalizeLeadInput(input: LeadFormInput): LeadInput {
  const contact = input.contact.trim();
  const isEmail = z.email().safeParse(contact).success;

  return {
    fullName: input.fullName.trim(),
    email: isEmail ? contact : "",
    phone: isEmail ? "" : contact,
    reason: input.reason.trim(),
  };
}
