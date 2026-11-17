# Spec 004 — SEO orgánico de la landing

## Estado

**Aprobada.**

## Contexto

La versión pública de la landing en `https://vectoraustral.com.ar/` coincide con
`origin/main` (commit `bbfa178`). El trabajo se basa en esa versión.

El objetivo es mejorar la comprensión e indexación de la página para búsquedas
orgánicas en Argentina, priorizando automatizaciones de procesos con n8n para
negocios. No hay datos de Search Console ni investigación de volúmenes de
búsqueda disponibles; las frases propuestas son hipótesis editoriales, no
promesas de posicionamiento.

## Objetivo

Dejar la landing técnicamente rastreable y con una propuesta de valor clara para
personas que buscan automatizar procesos de negocio con n8n en Argentina, sin
inventar ubicaciones, clientes, métricas ni resultados.

## Alcance

- SEO técnico de la URL principal en Next.js App Router.
- Mejoras puntuales del título, descripción y copy existente de la landing,
  priorizando de forma natural términos relacionados con automatizaciones n8n.
- Metadatos de compartir en redes y datos estructurados institucionales basados
  únicamente en información verificada.
- Validación de idioma, jerarquía de encabezados y textos alternativos relevantes.
- Documentación de verificación posterior al despliegue en Google Search
  Console.

No se crearán páginas nuevas en esta etapa; el alcance es la landing actual.

## Requisitos funcionales

- **RF-1:** El documento principal tendrá un título único y una descripción
  concisa, en español de Argentina, que identifiquen a Vector Austral y su
  servicio prioritario de automatización con n8n, sin repetición artificial de
  palabras clave.
- **RF-2:** La página declarará `https://vectoraustral.com.ar` como URL canónica
  de la landing y proveerá metadatos Open Graph con la misma URL normalizada.
- **RF-3:** El sitio publicará `robots.txt` y `sitemap.xml` compatibles con
  Next.js App Router. El sitemap incluirá únicamente URLs públicas canónicas
  incluidas en el alcance; las APIs no se presentarán como páginas indexables.
- **RF-4:** El HTML mantendrá idioma español de Argentina, un único encabezado
  principal descriptivo y una jerarquía semántica comprensible. El texto deberá
  nombrar n8n y explicar el problema de negocio que resuelven las
  automatizaciones, sin alterar funcionalidades ni agregar afirmaciones no
  verificadas.
- **RF-5:** Si se agrega JSON-LD, describirá únicamente la organización con
  nombre, URL y logo verificados. No se usará `LocalBusiness`, dirección,
  coordenadas, perfiles sociales o reseñas que no estén confirmados.
- **RF-6:** Los metadatos y datos estructurados no incluirán secretos,
  información personal innecesaria ni valores de ejemplo presentados como
  reales.

## Fuera de alcance

- Garantizar posiciones, visitas, leads o plazos de posicionamiento.
- Crear páginas nuevas por servicio, artículos de blog o contenido de campaña.
- Comprar enlaces, publicar reseñas o alterar perfiles externos.
- Configurar Search Console, Google Analytics o accesos de terceros desde el
  repositorio.
- Añadir direcciones, áreas de atención locales específicas, casos de éxito,
  certificaciones, precios, estadísticas o claims no aprobados.
- Cambiar la arquitectura de producción o las integraciones existentes.

## Criterios de aceptación

1. Los metadatos renderizados identifican el dominio canónico y el foco de
   automatización n8n en Argentina; Open Graph contiene título, descripción,
   URL y locale en español de Argentina.
2. `robots.txt` y `sitemap.xml` responden con contenido válido y el sitemap no
   incluye rutas de API.
3. La landing conserva un único H1 y encabezados semánticamente ordenados; el
   copy revisado es legible y evita keyword stuffing y afirmaciones no
   verificadas.
4. Los datos estructurados, si se incluyen, pasan validación sintáctica y solo
   usan información verificada.
5. Tests, lint, formato y build existentes pasan sin introducir dependencias no
   autorizadas.
6. La guía de lanzamiento indica cómo inspeccionar sitemap/robots y solicitar
   indexación o revisar consultas en Search Console tras desplegar.

## Decisiones

- Dominio canónico: `https://vectoraustral.com.ar` (URL raíz normalizada por
  Next.js sin barra final).
- Mercado: Argentina. Servicio prioritario: automatizaciones con n8n.
- Las prioridades de palabras clave se validarán más adelante con datos de
  Search Console y herramientas de búsqueda; no se inferirán volúmenes ni
  posiciones.
