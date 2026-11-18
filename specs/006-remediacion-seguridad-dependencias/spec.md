# Spec 006 — Remediación de vulnerabilidades de dependencias

## Contexto y objetivo

La auditoría inicial identificó vulnerabilidades en dependencias de producción
y de desarrollo. Las de producción ya fueron corregidas, pero el audit completo
del 2026-11-18 todavía reporta 18 paquetes afectados en desarrollo: 11 altos y
7 moderados. El objetivo es resolver los hallazgos restantes y mantener los
flujos de Vector Austral sin aplicar actualizaciones mayores sin autorización
explícita.

## Inventario inicial de hallazgos

Inventario de `npm audit` del 2026-11-18:

- **Altos (11 paquetes):** `@next/eslint-plugin-next`,
  `@typescript-eslint/typescript-estree`, `eslint-config-next`,
  `eslint-import-resolver-typescript`, `fast-glob`, `fdir`, `micromatch`,
  `picomatch`, `tinyglobby`, `vite` y `vitest`.
- **Moderados (7 paquetes):** `@typescript-eslint/eslint-plugin`,
  `@typescript-eslint/parser`, `@typescript-eslint/type-utils`,
  `@typescript-eslint/utils`, `@vitest/mocker`, `minimatch` y
  `typescript-eslint`.
- **Críticos y bajos:** ninguno.

Avisos específicos informados:

- `@vitest/mocker`: GHSA-qxg6-89mg-rqv8 y GHSA-xp26-3454-mjgp.
- `minimatch`: GHSA-g3hv-75wg-m249.
- `picomatch`: GHSA-fc5q-39xc-vjpf.
- `vite`: GHSA-698v-4r3x-3vcv, GHSA-r825-w8mm-5pxw,
  GHSA-587h-7wmj-h5pm, GHSA-9jrq-w75r-8gcw y GHSA-rq7h-c2jc-7f22.

Los otros paquetes enumerados aparecen afectados por dependencias transitivas;
el resultado de auditoría vigente determinará el alcance final.

## Usuarios / actores

- Responsable del proyecto, que mantiene y publica la aplicación.
- Visitantes que usan la landing, el formulario de contacto y Vector Uno.
- Equipo de desarrollo, que ejecuta y mantiene las herramientas de calidad.

## Historias de usuario

- H1: Como responsable del proyecto, quiero resolver las vulnerabilidades
  conocidas de todas las dependencias para reducir riesgos al desarrollar y
  publicar la aplicación.
- H2: Como visitante, quiero que la remediación no altere los flujos actuales
  de contacto y navegación.
- H3: Como integrante del equipo, quiero conservar las herramientas de
  desarrollo y calidad operativas después de las actualizaciones.

## Requisitos funcionales (criterios de aceptación en EARS)

- RF-1: CUANDO se auditen todas las dependencias después de la remediación, EL
  SISTEMA no reportará vulnerabilidades conocidas abiertas de nivel bajo,
  moderado, alto o crítico.
- RF-2: SI no existe una actualización compatible que resuelva una
  vulnerabilidad, ENTONCES EL SISTEMA no informará la remediación como completa
  y el equipo registrará el hallazgo pendiente.
- RF-3: SI la corrección de una vulnerabilidad requiere una actualización
  mayor, ENTONCES el equipo pausará ese cambio hasta recibir aprobación
  explícita del responsable del proyecto.
- RF-4: MIENTRAS se actualicen dependencias de producción o desarrollo, EL
  SISTEMA conservará los flujos funcionales aprobados de la aplicación.
- RF-5: CUANDO se ejecuten las pruebas existentes después de la remediación, EL
  SISTEMA finalizará sin pruebas fallidas.
- RF-6: CUANDO se compile la aplicación después de la remediación, EL SISTEMA
  finalizará sin errores de compilación.
- RF-7: CUANDO se ejecute el análisis estático después de la remediación, EL
  SISTEMA no introducirá errores nuevos.
- RF-8: CUANDO se auditen las dependencias de producción después de la
  remediación, EL SISTEMA no reportará vulnerabilidades conocidas abiertas.

## Requisitos no funcionales

- Las credenciales y secretos permanecerán fuera del código, los registros y
  los artefactos públicos.
- Los cambios se limitarán a la remediación aprobada y no incorporarán
  dependencias sin justificación.
- Las herramientas de desarrollo existentes permanecerán disponibles para
  ejecutar pruebas, análisis estático y formato.

## Casos límite

- Una vulnerabilidad no tiene una actualización compatible disponible.
- Una actualización correctiva requiere cambios incompatibles con la versión
  actual.
- Una actualización corrige varios avisos, pero introduce una regresión en una
  herramienta de desarrollo.
- El resultado de auditoría cambia y ya no coincide con el inventario inicial.

## Fuera de alcance

- Cambiar funcionalidades, contenido, diseño o integraciones del producto.
- Aplicar actualizaciones mayores sin aprobación explícita.
- Añadir dependencias nuevas que no sean necesarias para resolver los
  hallazgos.
- Corregir problemas de formato o lint preexistentes y no relacionados con la
  remediación.

## Criterios de finalización

- RF-1 a RF-8 están verificados.
- La auditoría completa no reporta vulnerabilidades conocidas abiertas.
- Las pruebas y el build existentes finalizan correctamente.
- El lint no presenta errores nuevos.
- Las herramientas de desarrollo existentes continúan ejecutándose.
- No se modifican dependencias fuera del alcance aprobado.

## Dudas abiertas

- Ninguna.
