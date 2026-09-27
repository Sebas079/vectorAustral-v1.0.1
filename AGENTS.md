# AGENTS.md — Vector Austral

## Proyecto

Vector Austral es una plataforma web y agencia tecnológica especializada en desarrollo web moderno, automatizaciones avanzadas con n8n, soluciones móviles en Android y actualización de sitios preexistentes.
El sistema consta de:

1. Landing Page institucional y de conversión (Showroom activo).
2. Dashboard de Clientes con autenticación y panel de métricas/servicios.
3. Asistente Virtual conversacional integrado (IA + n8n).

Stack principal: Next.js / React, Tailwind CSS, TypeScript, Firebase / Supabase (Auth/DB), workflows en n8n y Kotlin para clientes móviles complementarios.

## Comandos

- Instalar dependencias: `npm install`
- Ejecutar entorno local: `npm run dev`
- Compilación / Build: `npm run build`
- Tests: `npm run test`
- Lint / Formato: `npm run lint` && `npx prettier --check .`

## Estilo y convenciones

- TypeScript en modo estricto (`strict: true`).
- Nomenclatura:
  - Componentes React: `PascalCase.tsx`
  - Utilidades y hooks: `camelCase.ts` (hooks: `usePrefix.ts`)
  - Rutas y assets: `kebab-case`
- Estilos: Tailwind CSS con paleta Vector Austral (azules profundos, cian eléctrico, grises neutros y modo oscuro preferencial).
- Idioma: Código, variables y commits en inglés; comentarios funcionales, documentación de specs (SDD) e interfaz de usuario en español (Argentina / LatAm neutro).
- Comentarios: Cada módulo o bloque relevante deberá incluir comentarios breves en español que expliquen su responsabilidad, reglas de negocio, integraciones o decisiones no obvias. No comentar líneas evidentes ni duplicar el código en lenguaje natural.

## Reglas de Arquitectura y SDD

- **Prohibido modificar código sin Spec:** Ningún agente toca código ni nodos sin una especificación técnica previa aprobada en `docs/specs/`.
- **Límites de diseño (Pixel):** Respetar estrictamente el diseño mobile-first y los tokens de Tailwind acordados; no importar librerías UI pesadas sin previa validación.
- **Límites de backend/automatización :** Todos los webhooks de n8n deben manejar esquemas JSON cerrados, validación de payloads y captura de errores con fallback.
- **Límites de frontend :** Prohibido hardcodear credenciales, API keys o URLs de producción; usar siempre `.env.local` tipado.

## Al terminar cualquier tarea

1. Ejecutar lint y tests locales (`npm run lint && npm run test`).
2. Verificar que no se introduzcan dependencias no autorizadas en `package.json`.
3. Validar el entregable contra los criterios de aceptación del archivo de spec activo.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
