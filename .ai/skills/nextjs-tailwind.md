# SKILL: Next.js + Tailwind CSS + Firebase

## Reglas de Código Frontend
1. **Next.js App Router:**
   - Usa `app/` directory.
   - Declara `'use client'` ÚNICAMENTE cuando el componente requiera interactividad o hooks (`useState`, `useEffect`). Los componentes de presentación deben ser Server Components por defecto.

2. **Tailwind CSS & UI:**
   - Sigue estrictamente los estilos definidos en `guiaDiseño.md`.
   - Paleta de colores: Usar las clases configuradas para el tema "Austral" (azules profundos, cianes, dark mode limpio).
   - Diseña pensando en **Mobile-First**.

3. **Integración n8n / Backend:**
   - Todos los formularios deben enviar datos a endpoints API o Webhooks de n8n sanitizados.
   - Maneja estados de carga (`loading`), éxito (`success`) y error (`error`) en la UI.