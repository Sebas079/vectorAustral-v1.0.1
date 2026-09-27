# Skill: lead-validation-zod

## Cuándo usar

Validación del formulario de leads (nombre, teléfono, email, motivo + captcha) con Zod.

## Reglas duras

- Schema JSON cerrado con Zod; mensajes de error en español (Const #3, Spec RF-4).
- Campos obligatorios: nombre, teléfono, email, motivo. Captcha humano obligatorio + anti-spam.
- Código y tests en inglés; mensajes al usuario en español (Const #5).
- Archivos permitidos: `lib/validators/leadSchema.ts`, `tests/leadSchema.test.ts`.

## Hecho cuando

- [ ] `npx vitest run tests/leadSchema.test.ts` verde (válido OK; email/tel/vacíos/captcha fallan)
- [ ] `npx tsc --noEmit` limpio, sin `any`
