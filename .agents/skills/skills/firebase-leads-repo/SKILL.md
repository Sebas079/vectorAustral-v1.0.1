# Skill: firebase-leads-repo

## Cuándo usar

Persistencia de leads en Firestore: crear, deduplicar por email/teléfono, acumular historial, flag `isClient`.

## Reglas duras

- Colección `/leads` con tipos `LeadDocument` + `ConsultationEntry` (ISO 8601). Claves de búsqueda: email y teléfono (Spec RF-5, RF-6).
- Cero secretos hardcodeados; config desde `.env` tipado (Const #9).
- Sin `any`; TypeScript `strict: true` (Const #1).
- Archivos permitidos: `lib/firebase/config.ts`, `lib/firebase/leadService.ts`, `tests/leadService.test.ts`.

## Hecho cuando

- [ ] `npx vitest run tests/leadService.test.ts` verde (nuevo, repetido acumula, isClient)
- [ ] `git grep -i "api_key\|secret" -- lib/` sin resultados reales
