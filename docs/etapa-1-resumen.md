# Resumen de la Etapa 1 — MVP Landing Vector Austral

## Propósito

La Etapa 1 construyó y dejó validado el MVP de la landing institucional de
Vector Austral. El objetivo fue presentar la agencia, explicar sus servicios,
capturar leads calificados y mostrar a Vector Uno como asistente y protagonista
de una demo institucional.

La etapa queda preparada para revisión final, primer commit y push a GitHub.
El push se realizará en la siguiente sesión.

## Producto entregado

La landing incluye:

- Hero institucional con CTA de Diagnóstico Inicial.
- CTA visible para acceder directamente a la demo institucional.
- Navegación responsive.
- Sección de identidad y propuesta de valor.
- Servicios de desarrollo web, plataformas digitales, automatizaciones con n8n
  y soluciones móviles complementarias.
- Proceso de trabajo.
- Demo institucional de Vector Uno.
- Formulario de contacto con validación.
- Persistencia de leads en Firebase/Firestore.
- Fallbacks de contacto por email y WhatsApp.
- Widget conversacional flotante de Vector Uno.
- Footer institucional con branding consistente.
- Animaciones sutiles y respeto de `prefers-reduced-motion`.

## Arquitectura implementada

### Aplicación

- Next.js 16 con App Router.
- React 19.
- TypeScript en modo estricto.
- Tailwind CSS 4.
- Vitest y Testing Library.
- Zod para validación.
- Firebase/Firestore para persistencia.

### Separación de responsabilidades

- `app/`: composición de páginas y estilos globales.
- `components/`: presentación e interacción de la landing.
- `lib/`: lógica de dominio, bot, validación y Firebase.
- `sources/content/`: copy y metadatos editoriales.
- `sources/brand/`: archivos originales de identidad.
- `sources/demos/`: material de trabajo audiovisual.
- `public/assets/`: recursos optimizados para el navegador.
- `specs/`: requisitos, arquitectura y tracker operativo.
- `docs/`: documentación técnica y de despliegue.

## Funcionalidades principales

### Vector Uno

- Respuestas deterministas desde una base de conocimiento local.
- Explica servicios, alcances y proceso.
- No entrega presupuestos automáticos.
- Deriva los casos reales al formulario.
- Presentación como burbuja flotante accesible.

### Formulario de leads

- Campos obligatorios: nombre, teléfono, email y motivo.
- Validación estricta con Zod.
- Verificación humana.
- Honeypot invisible contra bots simples.
- Bloqueo temporal de envíos repetidos durante 10 segundos.
- Persistencia y deduplicación por email o teléfono.
- Historial de consultas.
- Confirmación de envío.
- Fallback con reintento, email y WhatsApp.

### Demo institucional

Fuente original:

- `sources/demos/vector-uno/final/VectorUnoDemo.mp4`

Asset publicado:

- `public/assets/demos/vector-uno/VectorUnoDemo.mp4`

Metadatos:

- `sources/content/demos.ts`

Componente:

- `components/DemoVideo.tsx`

La demo usa poster, controles accesibles y `preload="none"`. La CTA visible
del Hero apunta a la sección mediante `#demo`.

## Documentación generada

- `specs/001-landing-mvp-spec.md`
  - Requisitos funcionales.
  - Arquitectura de fuentes y assets.
  - Alcance audiovisual del MVP.
  - Límites para Specs 2 y 3.

- `specs/plan.md`
  - Plan técnico.
  - Módulos.
  - Modelo de datos.
  - Decisiones de arquitectura.

- `specs/task.md`
  - Seguimiento de T1 a T13.
  - T3, T11 y T12 completadas.
  - T13 validada localmente, con despliegue automático pendiente.

- `docs/despliegue.md`
  - Estrategia GitHub + Hostinger VPS.
  - Node.js, PM2, Nginx y SSL.
  - Secrets de GitHub.
  - Flujo de despliegue y rollback.

## Validaciones realizadas

Todas las validaciones locales relevantes quedaron en verde:

- `npm run lint`
- `npm run format`
- `npm run test`
- `npm run build`
- `npx tsc --noEmit`
- `git diff --check`

Resultado de tests:

- 6 archivos de test.
- 21 tests aprobados.

## CI y despliegue

El workflow actual está en:

- `.github/workflows/ci.yml`

Actualmente ejecuta:

1. `npm ci`
2. `npm run lint`
3. `npm run format`
4. `npm run test`
5. `npm run build`

La estrategia aprobada para producción es:

- GitHub como repositorio.
- Hostinger VPS como runtime.
- SSH para despliegue.
- `git pull --ff-only`.
- `npm ci`.
- `npm run build`.
- `pm2 restart vector-austral`.

El despliegue automático todavía no se activa porque faltan el VPS, dominio,
SSL, usuario de despliegue y secrets reales de GitHub.

## Fuera de alcance

Queda reservado para las siguientes etapas:

- Área privada de clientes.
- Autenticación.
- Dashboard.
- Material avanzado de Vector Uno.
- Biblioteca de demos por servicio.
- Campañas audiovisuales adicionales.
- Analítica y personalización.
- Releases versionadas y despliegues sin interrupción.

Estas decisiones evitan ampliar el MVP antes de publicarlo.

## Estado al cierre de la Etapa 1

### Completado

- MVP funcional.
- Landing ensamblada.
- Video institucional integrado.
- CTA inicial hacia la demo.
- Formulario y bot validados.
- Anti-spam MVP.
- Documentación de arquitectura.
- Documentación de despliegue.
- Pipeline local validado.

### Pendiente para la próxima sesión

1. Revisar el estado final del repositorio.
2. Confirmar archivos que entrarán al primer commit.
3. Crear el commit inicial.
4. Configurar el remoto de GitHub si todavía no existe.
5. Ejecutar el primer push.
6. Verificar el repositorio remoto.
7. Comenzar la planificación de la Etapa 2.

No se realizará ningún push ni despliegue hasta la próxima sesión.
