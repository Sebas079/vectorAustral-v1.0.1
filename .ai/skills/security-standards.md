# SKILL: Estándares de Ciberseguridad & Sanitize

## Reglas Inquebrantables de Seguridad
1. **Gestión de Secretos:**
   - NUNCA escribir API Keys, tokens o passwords en código duro (`hardcoded`).
   - Usar estrictamente variables de entorno (`process.env.VARIABLE`) cargadas desde `.env.local`.
   - Verificar que `.env*` esté incluido en `.gitignore`.

2. **Validación y Sanitización de Inputs (Webhooks / Formularios):**
   - Todos los inputs del usuario (formularios de Diagnóstico Inicial) deben validarse en el cliente y servidor con librerías de esquema (ej. `Zod`).
   - Sanitizar entradas para prevenir vulnerabilidades de XSS (Cross-Site Scripting) e inyecciones.

3. **Seguridad en Webhooks de n8n:**
   - Cada endpoint que se comunique con n8n debe implementar verificación de firma (Header Bearer Token o secret key) para evitar que terceros envíen tráfico falso a nuestras automatizaciones.

4. **Cabeceras de Seguridad HTTP (Headers):**
   - Configurar cabeceras de seguridad en Next.js (`next.config.js`): Content Security Policy (CSP), Strict-Transport-Security (HSTS), X-Frame-Options (para prevenir Clickjacking). 