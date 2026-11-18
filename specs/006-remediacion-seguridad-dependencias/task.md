# Desglose de tareas de implementación — Spec 006

## Inventario de referencia

`npm audit` del 2026-11-18 encontró 18 paquetes de desarrollo afectados: 11
altos y 7 moderados. El inventario de paquetes y avisos está registrado en
`spec.md`.

La corrección de vulnerabilidades de producción está completa: `npm audit
--omit=dev` no reporta hallazgos. No se debe ejecutar `npm audit fix --force`
ni aplicar actualizaciones mayores sin aprobación explícita.

## Mapa de dependencias

```text
[T1 Producción completada] -> [T2 Dependencias de desarrollo]
                                        |
                                        v
                              [T3 Resolver bloqueos]
                                        |
                                        v
                              [T4 Validación final]
```

## Fase 1 — Dependencias de producción

- [x] **T1: Remediar vulnerabilidades de producción**
  - Requisitos: RF-2, RF-4, RF-5, RF-6, RF-8
  - Hecho cuando:
    - [x] `npm audit --omit=dev` reporta cero vulnerabilidades.
    - [x] La suite completa finaliza sin pruebas fallidas.
    - [x] El build finaliza sin errores.
  - Resultado: Next.js, Zod y el árbol compatible de Firebase/Firestore se
    actualizaron sin cambios mayores.

## Fase 2 — Dependencias de desarrollo

- [ ] **T2: Actualizar dependencias de desarrollo dentro de sus versiones mayores**
  - Requisitos: RF-1, RF-4, RF-5, RF-6, RF-7
  - Hallazgos iniciales: `@next/eslint-plugin-next`,
    `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`,
    `@typescript-eslint/type-utils`, `@typescript-eslint/typescript-estree`,
    `@typescript-eslint/utils`, `@vitest/mocker`, `eslint-config-next`,
    `eslint-import-resolver-typescript`, `fast-glob`, `fdir`, `micromatch`,
    `minimatch`, `picomatch`, `tinyglobby`, `typescript-eslint`, `vite` y
    `vitest`.
  - Pasos:
    - [ ] Revisar versiones compatibles y avisos vigentes antes de actualizar.
    - [ ] Aplicar correcciones que no requieran cambios mayores.
    - [ ] Mantener alineadas las herramientas que deban compartir versión.
    - [ ] Actualizar `package-lock.json` de forma reproducible.
  - Hecho cuando:
    - [ ] `npm audit` no reporta vulnerabilidades conocidas abiertas.
    - [ ] No se introducen dependencias directas no aprobadas.
    - [ ] No se aplican cambios mayores sin autorización.

- [ ] **T3: Resolver bloqueos que requieran cambios incompatibles**
  - Requisitos: RF-2, RF-3
  - Estado conocido:
    - La vista previa del audit indica que corregir `picomatch` mediante
      `--force` degradaría `eslint-config-next` de 16.x a 14.2.35.
  - Pasos:
    - [ ] Buscar una actualización compatible que resuelva el aviso sin
          degradar la versión mayor de las herramientas.
    - [ ] Si no hay una solución compatible, pausar el cambio y solicitar
          autorización explícita antes de aplicar una actualización mayor.
  - Hecho cuando:
    - [ ] El hallazgo queda resuelto de forma compatible; o
    - [ ] El trabajo queda bloqueado y el responsable recibe la decisión
          concreta que debe aprobar.

## Fase 3 — Validación

- [ ] **T4: Validar el conjunto completo de dependencias**
  - Requisitos: RF-1, RF-4, RF-5, RF-6, RF-7, RF-8
  - Dependencias: T2 y T3
  - Pasos:
    - [ ] Ejecutar el audit completo y el audit de producción.
    - [ ] Ejecutar la suite completa de pruebas.
    - [ ] Ejecutar lint y build.
    - [ ] Comprobar formato de todos los archivos modificados.
  - Hecho cuando:
    - [ ] No quedan vulnerabilidades conocidas abiertas.
    - [ ] Las pruebas y el build finalizan sin errores.
    - [ ] Lint no presenta errores nuevos.
    - [ ] El formato de los archivos modificados está verificado.
