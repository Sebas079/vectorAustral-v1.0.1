# Skill: tdd-quality-gate

## Cuándo usar

Puerta de calidad para cada tarea: tests primero (TDD), lint, formato y build.

## Reglas duras

- Flujo TDD: test rojo -> código mínimo -> verde -> refactor (Const #7).
- Stack test: Vitest + React Testing Library. Tests en `tests/`.
- Cero warnings; tarea hecha solo con pipeline verde (Const #8).
- Prohibidas dependencias sin justificación en spec (Const #10).

## Hecho cuando

- [ ] `npm run lint` verde
- [ ] `npx prettier --check .` verde
- [ ] `npm run test` verde
- [ ] `npm run build` verde
