# Desglose de Tareas de Implementación — Spec 001

Tareas atómicas ordenadas por dependencias técnicas (SDD). Sin estimaciones de tiempo.
Cada tarea usa checkboxes por paso y condición verificable "Hecho cuando".

---

## Mapa de dependencias

```text
[T1 scaffolding] -> [T2 calidad+env] -> [T3 fuentes y assets] -> [T4 git+CI]
      |
      +-> [T5 leadSchema] --+
      +-> [T6 leadService] -+-> [T8 ContactForm] -+
      +-> [T7 botEngine] ---> [T9 ChatWidget] ----+-> [T10 Hero+Servicios] -> [T11 DemoVideo institucional+page] -> [T12 fallbacks] -> [T13 validación final]
```

---

## Fase 0 — Base

- [x] **T1: Scaffolding Next.js + TS strict + Tailwind tokens**
  - Requisitos: Const #1, #5, #6 | RF-1
  - Archivos: `package.json`, `tsconfig.json`, `app/layout.tsx`, `app/globals.css`
  - Hecho cuando:
    - [x] Next.js App Router, TypeScript strict y Tailwind están configurados
    - [x] Los tokens Vector Austral están definidos
    - [x] `npm run build` compila sin errores

- [x] **T2: Calidad + `.env.example` tipado**
  - Requisitos: Const #8, #9
  - Archivos: `vitest.config.ts`, `tests/setup.ts`, `.env.example`, `package.json`, `.vscode/mcp.json`
  - Hecho cuando:
    - [x] Vitest + React Testing Library y scripts de calidad están configurados
    - [x] `.env.example` existe sin valores reales
    - [x] Context7 está configurado únicamente como MCP documental
    - [x] `npm run lint` está en verde
    - [x] `npm run format` está en verde
    - [x] `npm run test` está en verde

- [x] **T3: Fuentes editoriales, branding y demos**
  - Requisitos: Spec 001 — Arquitectura de fuentes y assets | RF-1
  - Archivos: `sources/content/`, `sources/brand/`, `sources/demos/vector-uno/`, `public/assets/`
  - Pasos:
    - [x] Crear la estructura `sources/content`, `sources/brand` y `sources/demos/vector-uno`
    - [x] Conservar el copy aprobado de la landing en `sources/content/landing-copy.md`
    - [x] Incorporar el logo SVG oficial en `sources/brand/vector-austral-logo.svg`
    - [x] Definir que las demos se cargarán bajo demanda al hacer clic en "Ver demo"
    - [x] Inventariar el video institucional de Vector Uno, su poster y sus metadatos
    - [x] Definir qué archivos multimedia son originales y cuáles son versiones optimizadas publicables
    - [x] Preparar `public/assets/brand`, `public/assets/demos` y `public/assets/images`
    - [x] Verificar que no haya credenciales ni URLs de producción en los recursos actuales
  - Hecho cuando:
    - [x] La estructura de `sources/` coincide con `plan.md`
    - [x] El copy aprobado está almacenado sin pérdida de contenido
    - [x] El logo tiene ubicación definida
    - [x] Las demos tienen ubicación y estrategia de carga definida
    - [x] Cada asset multimedia publicable puede rastrearse a su fuente original
    - [x] La spec, el plan y la tarea describen la misma organización

- [x] **T4: Git + CI GitHub Actions**
  - Requisitos: RF-8
  - Archivos: `.gitignore`, `.github/workflows/ci.yml`
  - Pasos:
    - [x] Inicializar git y `.gitignore` que bloquee `.env*.local`, `node_modules`, `.next`
    - [x] Crear workflow CI que en push/PR a `main` ejecute `npm ci`, `lint`, `prettier --check`, `test`, `build`
    - [x] Sincronizar `package-lock.json` para que `npm ci` sea reproducible
  - Hecho cuando:
    - [x] `.github/workflows/ci.yml` existe y contiene los 5 pasos
    - [x] El repositorio queda limpio salvo archivos intencionales

---

## Fase 1 — Dominio (TDD)

- [x] **T5: `leadSchema` Zod + tests**
  - Requisitos: RF-4
  - Archivos: `lib/validators/leadSchema.ts`, `tests/leadSchema.test.ts`
  - Pasos:
    - [x] Escribir tests de datos válidos, inválidos, campos vacíos y captcha ausente
    - [x] Implementar esquema Zod estricto con mensajes en español
    - [x] Rechazar campos desconocidos y entradas no válidas
  - Hecho cuando:
    - [x] `npx vitest run tests/leadSchema.test.ts` está en verde (5 tests)
    - [x] `npm run lint` está en verde
    - [x] `npm run format` está en verde
    - [x] `npx tsc --noEmit` está limpio

- [x] **T6: `leadService` Firestore + tests con mock**
  - Requisitos: RF-5, RF-6
  - Archivos: `lib/firebase/config.ts`, `lib/firebase/leadService.ts`, `tests/leadService.test.ts`
  - Pasos:
    - [x] Escribir tests de creación, deduplicación e historial
    - [x] Implementar configuración segura y servicio Firestore
    - [x] Separar el adaptador Firestore del servicio mediante `LeadStore` inyectable
  - Hecho cuando:
    - [x] `npx vitest run tests/leadService.test.ts` está en verde (3 tests)
    - [x] `npx tsc --noEmit` está limpio
    - [x] `npm run lint` está en verde
    - [x] `npm run format` está en verde

- [x] **T7: `botEngine` Vector Uno + `knowledgeBase` + tests**
  - Requisitos: RF-2, RF-3, RF-7
  - Archivos: `lib/bot/knowledgeBase.ts`, `lib/bot/botEngine.ts`, `tests/botEngine.test.ts`
  - Pasos:
    - [x] Crear base de conocimiento de servicios y proceso
    - [x] Implementar bloqueo de presupuestos y fallback sin inventar
    - [x] Cubrir respuestas con tests
  - Hecho cuando:
    - [x] `npx vitest run tests/botEngine.test.ts` está en verde (4 tests)
    - [x] Ninguna respuesta contiene un precio numérico
    - [x] `npm run lint` está en verde
    - [x] `npm run format` está en verde
    - [x] `npx tsc --noEmit` está limpio

---

## Fase 2 — UI (TDD)

- [x] **T8: `ContactForm` + captcha + fallback**
  - Requisitos: RF-4, RF-6, RF-7
  - Archivos: `components/ContactForm.tsx`, `tests/ContactForm.test.tsx`
  - Pasos:
    - [x] Cubrir render, validación, loading, éxito y error con RTL
    - [x] Implementar formulario responsive dark/cian
    - [x] Conectar validación Zod y persistencia mediante `saveLead`
    - [x] Mostrar fallback con reintento, WhatsApp y email
  - Hecho cuando:
    - [x] `npx vitest run tests/ContactForm.test.tsx` está en verde (4 tests)
    - [x] `npm run lint` está en verde
    - [x] `npm run format` está en verde
    - [x] `npm run test` está en verde (18 tests)
    - [x] `npm run build` está en verde

- [x] **T9: `ChatWidget` flotante Vector Uno**
  - Requisitos: RF-2, RF-3, RF-7
  - Archivos: `components/ChatWidget.tsx`, `tests/ChatWidget.test.tsx`
  - Pasos:
    - [x] Cubrir apertura, cierre, mensajes y CTA al formulario
    - [x] Implementar widget responsive conectado a `botEngine`
    - [x] Mantener navegación accesible mediante etiquetas, foco visible y enlace `#contacto`
  - Hecho cuando:
    - [x] `npx vitest run tests/ChatWidget.test.tsx` está en verde (3 tests)
    - [x] Suite completa está en verde (21 tests)
    - [x] `npm run lint` está en verde
    - [x] `npm run format` está en verde
    - [x] `npm run build` está en verde

- [x] **T10: `Hero` + `ServicesShowroom`**
  - Requisitos: RF-1 | Fuentes T3
  - Archivos: `components/Hero.tsx`, `components/ServicesShowroom.tsx`, `sources/content/landing.ts`, `sources/content/services.ts`
  - Pasos:
    - [x] Consumir el copy aprobado desde `sources/content/`
    - [x] Crear Hero, servicios y diferenciadores técnicos
    - [x] Evitar textos largos duplicados directamente en JSX
    - [x] Mantener comentarios breves sobre la separación entre contenido y presentación
  - Hecho cuando:
    - [x] `npx tsc --noEmit` está limpio
    - [x] El texto visible coincide con el copy aprobado
    - [x] `npm run lint` está en verde
    - [x] `npm run format` está en verde
    - [x] `npm run test` está en verde (21 tests)
    - [x] `npm run build` está en verde

- [ ] **T10.1: Adaptación visual de referencia v1.0.1**
  - Requisitos: RF-1 | Fuentes T3
  - Archivos: `components/Hero.tsx`, `components/ServicesShowroom.tsx`, `components/CompanyIntro.tsx`, `components/ProcessSection.tsx`, `sources/content/`
  - Pasos:
    - [ ] Adoptar composición visual oscura con superficies, bordes y gradientes suaves
    - [ ] Separar las secciones de identidad, servicios y proceso en componentes
    - [ ] Mantener copy y claims dentro de fuentes editoriales aprobadas
    - [ ] Conservar Firebase, Vector Uno, formulario y contratos existentes
  - Hecho cuando:
    - [ ] `npm run lint` está en verde
    - [ ] `npm run test` está en verde
    - [ ] `npm run build` está en verde

- [x] **T11: `DemoVideo` + ensamble `page.tsx`**
  - Requisitos: RF-1 | Fuentes T3
  - Archivos: `components/DemoVideo.tsx`, `app/page.tsx`, `sources/content/demos.ts`, `sources/demos/vector-uno/`, `public/assets/demos/`
  - Pasos:
    - [x] Generar la pieza institucional con Nano Banana o Veo 3 a partir del guion y storyboard aprobados
    - [x] Consumir metadatos de la demo institucional aprobada
    - [x] Cargar la demo de forma diferida mediante `preload="none"`
    - [x] Usar poster optimizado de marca como preview
    - [x] Ensamblar Hero, Servicios, ContactForm y ChatWidget
    - [x] Integrar footer institucional con navegación y contacto configurado
    - [x] Integrar navbar responsive con logo oficial publicado para fondo oscuro
  - Hecho cuando:
    - [x] `npm run build` está en verde
    - [x] La demo institucional tiene video, poster, metadatos y trazabilidad a su fuente
  - Fuera de alcance:
    - Área privada de clientes
    - Biblioteca avanzada y campañas audiovisuales de Vector Uno
    - Estos puntos se documentarán en Specs 2 y 3

---

## Fase 3 — Cierre

- [x] **T12: Fallbacks globales + anti-spam**
  - Requisitos: RF-7, RF-4
  - Archivos: `components/ContactForm.tsx`, `components/ChatWidget.tsx`, `lib/validators/leadSchema.ts`
  - Pasos:
    - [x] Verificar mensajes de error para visitante y cliente
    - [x] Verificar reintento, mail, WhatsApp y captcha obligatorio
    - [x] Incorporar honeypot invisible y bloqueo temporal de envíos repetidos
  - Hecho cuando:
    - [x] Tests T5, T8 y T9 siguen en verde

- [ ] **T13: Validación final Spec 001**
  - Requisitos: RF-1 a RF-8
  - Archivos: todo el repo
  - Pasos:
    - [x] Recorrer RF-1 a RF-8 y asociar cobertura
    - [x] Ejecutar pipeline completo local
    - [ ] Configurar despliegue automático de producción en Vercel o Firebase Hosting
  - Hecho cuando:
    - [x] `npm run lint` está en verde
    - [x] `npm run format` está en verde
    - [x] `npm run test` está en verde
    - [x] `npm run build` está en verde
    - [x] No hay secretos hardcodeados en código, fuentes ni assets
    - [ ] GitHub Actions despliega automáticamente después del push a `main`
  - Bloqueo restante:
    - La elección del proveedor de producción y sus secretos de GitHub todavía no
      están configurados; no se agregan credenciales ni se inventa un despliegue.
