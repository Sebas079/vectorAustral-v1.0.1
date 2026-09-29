# Constitución — Vector Austral v1.0 (2026-09-06)

1. Stack: Next.js App Router + TypeScript `strict:true` + Tailwind; prohibido `any` sin justificación.
2. Auth: solo Google OAuth (Firebase/Supabase), roles verificados en middleware servidor.
3. n8n: todo webhook valida payload con schema JSON cerrado (Zod) + error/fallback/retry.
4. Spec-First: prohibido código o flujo sin spec aprobada en `specs`.
5. Nomenclatura: código/commits en inglés (`PascalCase.tsx`, `camelCase.ts`, `kebab-case` rutas); UI/specs en español.
6. Diseño: mobile-first, tokens Tailwind propios (azul profundo/cian/graphite, dark); sin UI pesada sin validación.
7. Tests: auth, bot y dashboard exigen test unitario/integración antes de cerrar spec.
8. Pipeline: tarea hecha = `npm run lint` + `prettier --check .` + `npm run test` en verde, cero warnings.
9. Secretos: cero hardcode; todo en `.env.local` tipado y validado al arranque.
10. Simplicidad: nada de deps/abstracciones sin justificación en spec (YAGNI/KISS).
