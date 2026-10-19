# MEMORY.md - Vector Austral Web

Memoria del proyecto entre sesiones. Máximo ~50 líneas: resume o elimina lo que ya no aporte.

## Estado actual

- Validación en rama Spec 003 (`agents/hola-leer-archivo`, 2026-10-18): build correcto, tests 41/41, lint sin errores y 3 warnings, Prettier pasa en los documentos de Spec 003. `npm ci` reportó 8 vulnerabilidades (7 altas, 1 crítica); no ejecutar `npm audit fix` sin evaluar impacto.
- Spec 001 (landing): T1–T12 + T10.1 completadas. Vercel elegido; el deploy de GitHub Actions y guía se publicaron en `agents/project-status-review-dev-tools` (commit `8624d36`), condicionado a calidad y push a `main`. Proyecto Vercel, secrets/env y URL productiva siguen pendientes. `app/page.tsx` importa `components/Footer.tsx`; no quitarlo.
- Spec 003 (publicación y cierre de etapa 1): versión revisada y aprobada el 2026-10-12. Dominio/canónico `vectoraustral.com.ar`; Vercel para web; n8n autohospedado en VPS Hostinger; conversaciones no persistentes, solo sesión; mercado Argentina general, sin SEO local por ciudad; ocultar “Clientes” hasta que exista dashboard. Fallback de Vector Uno a formulario si n8n falla. Etapa se cierra solo tras verificar web pública, formulario y chat.
- SEO técnico de Spec 003 implementado y validado localmente: canonical/indexado en prod, noindex en dev, `robots.ts`, `sitemap.ts`, Open Graph/Twitter, cabecera `X-Robots-Tag` para API y `NEXT_PUBLIC_SITE_URL` documentado. Se verificó salida HTTP, imágenes sociales y sin overflow a 360/390/768/1440 px. Auditoría SEO técnica completada; falta validación final con dominio real y configuración de host externo.
- Spec 003 en `agents/hola-leer-archivo`: T4 completada con auditoría local de anchors, navegación por teclado, responsive a 360/390/768/1440 px y claims aprobados por el usuario. El dominio real queda pendiente en T6. T1 sigue bloqueada porque el VPS aún no existe; el usuario administrará Vercel/Hostinger/secrets y tiene acceso DNS. En la validación local Turnstile no estuvo disponible, así que T3 funcional sigue pendiente.
- Spec 002 (protección/reconocimiento de leads): T1–T11 + T13 parcial ✅. T12: usuario confirmó (2026-10-11) que verificación y envío funcionan en navegador; faltan confirmar precedencia/edición, expiración, rate limit y webhook vacío.
- **Turnstile operativo** (widget existente sitekey `0x4AAAAAAFTCvhP-qMhzIWZJ`): `.env.local` con `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` (sonda siteverify → secret válida) y `TURNSTILE_HOSTNAME=localhost`. Frontend `components/TurnstileWidget.tsx` en ContactForm; siteverify en `lib/security/turnstile.ts` usado por /api/contact, /api/leads, /api/leads/lookup.
- Contenido y marca en sources/ (copy tipado, logo SVG, demo VectorUnoDemo.mp4). Paleta estricta: navy/volt/abyss/graphite.

## Decisiones (y por qué)

- SDD estricto: nada de código sin spec aprobada → evita retrabajo y mantiene trazabilidad.
- Contenido separado de componentes (sources/content/*.ts) → cambios editoriales sin tocar UI.
- Turnstile server-side + rate limit 10s/IP (HMAC) + honeypot → anti-spam sin fricción alta.
- Firebase Admin solo en servidor (server-only) → secretos nunca en bundle del cliente.
- Paleta cerrada a 4 tokens; se eliminaron colores Tailwind por defecto por no ser decisiones de diseño.
- next/image con SVG es unoptimized automático en Next 16 → sin dangerouslyAllowSVG.
- Secret de Turnstile ya existía en `.env.local` (sintaxis TS rota); se anexó como env real sin reescribir el archivo ni exponer el valor.

## Aprendizaje y Errores a evitar

- `.env.local` contiene restos de un archivo TS pegado (`export const ...`) que Next ignora → usar siempre `CLAVE=valor`.
- Disco lento: compilar ruta en `next dev` supera 120s; pre-calentar con curl --max-time alto y no abortar.
- Vitest forks worker con timeout intermitente en Windows bajo carga → reintenta una vez; nunca dangerouslyIgnoreUnhandledErrors.
- eslint global se colgaba escaneando skills → script acotado a app components lib tests next.config.ts proxy.ts vitest.config.ts.
- No inventar copy ni métricas que no estén en fuentes aprobadas; no imprimir secretos en chat/log/diff.
- ContactForm ya limpia campos/honeypot/lookup/captcha tras envío exitoso (ContactForm.tsx:254-258, cubierto por test) → no reimplementar.
- El checkout `project-status-review-dev-tools` puede divergir del checkout `D:\VectorAustraWeb` donde el usuario tiene otros cambios; verificar worktree y archivos modificados antes de integrar o publicar.
- Renombrar specs/001-Landindg-mvp (typo) pendiente.

## Próximos pasos

1. Aprovisionar VPS Hostinger y completar T1; mantener accesos y secretos fuera del repositorio/chat.
2. Preparar n8n (T2), configurar URL/secreto del webhook en entorno seguro y completar pruebas operativas de Vector Uno (T3).
3. Crear/configurar Vercel y variables/secrets de producción; realizar preflight (T5).
4. Publicar y validar HTTPS, formulario/Firestore, Turnstile, chat, fallbacks y SEO en `vectoraustral.com.ar` (T6); cerrar Etapa 1 solo tras aprobación funcional.
5. Renombrar carpeta 001 y limpiar specs huérfanas.
