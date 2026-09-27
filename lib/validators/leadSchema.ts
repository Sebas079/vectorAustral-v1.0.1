import { z } from "zod";

const phonePattern = /^\+?[0-9][0-9\s().-]{7,18}[0-9]$/;

export const leadSchema = z.strictObject({
  fullName: z.string().trim().min(1, "El nombre es obligatorio."),
  phone: z
    .string()
    .trim()
    .min(1, "El teléfono es obligatorio.")
    .refine(
      (value) => value === "" || phonePattern.test(value),
      "Ingresá un teléfono válido.",
    ),
  email: z
    .string()
    .trim()
    .min(1, "El email es obligatorio.")
    .refine(
      (value) => value === "" || z.email().safeParse(value).success,
      "Ingresá un email válido.",
    ),
  reason: z.string().trim().min(1, "El motivo es obligatorio."),
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

export type LeadInput = z.infer<typeof leadSchema>;
