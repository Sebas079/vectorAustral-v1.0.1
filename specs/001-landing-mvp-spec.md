# Spec 001 — Landing Vector Austral (Lead Generation)

## Contexto (POR QUÉ)

Vector Austral vende webs, apps Android y automatizaciones n8n. La landing debe parecer automatizada, generar leads calificados y filtrar con bot 24/7 que nunca presupuesta. Cada lead se guarda en BD para reconocer visitas repetidas.

## Requisitos Funcionales (EARS)

- **RF-1:** CUANDO un visitante entra, EL SISTEMA mostrará hero + servicios (web/app/n8n) + prueba visible de automatización + contacto, en español, mobile-first oscuro (azul profundo/cian).
- **RF-2:** CUANDO el visitante consulta al bot, EL SISTEMA responderá 24/7 solo desde base de servicios (alcances, proceso, tiempos orientativos).
- **RF-3:** EL SISTEMA NUNCA presupuestará; SI detecta pedido de precio o caso real, derivará a formulario con "un especialista te cotiza según requerimientos".
- **RF-4:** CUANDO completa el formulario, EL SISTEMA exigirá nombre + teléfono + email + motivo, validará formato email/teléfono, campos no vacíos y captcha humano + anti-spam.
- **RF-5:** CUANDO el lead es válido, EL SISTEMA lo guardará en BD con clave email/teléfono + historial de motivos por fecha, y mostrará confirmación.
- **RF-6:** SI el visitante vuelve (mismo email/teléfono), EL SISTEMA lo reconocerá y precargará datos, sumando nuevo motivo al historial.
- **RF-7:** SI falla el envío o el bot cae, EL SISTEMA mostrará "Tuvimos un problema, volvé a intentar más tarde" (visitante) o "tenemos un problema y en breve nos comunicaremos" (cliente), + reintento + mail/WhatsApp, sin inventar datos.
- **RF-8:** CUANDO se realice un push a la rama `main` en GitHub, EL SISTEMA ejecutará el pipeline de CI (lint, prettier, tests unitarios y build) y desplegará automáticamente la versión del MVP a producción (Vercel / Firebase Hosting) sin credenciales expuestas.

## Fuera de alcance

Dashboard clientes, auth Google, pagos, métricas, presupuestos automáticos, animaciones pesadas, UI pesada. Solo Spec 001.

## Arquitectura de fuentes y assets

La landing deberá separar el contenido editorial, la identidad visual y los recursos
multimedia del código de la aplicación.

### Estructura aprobada

```text
sources/
├── brand/
│   ├── vector-austral-logo.svg
│   ├── vector-austral-logo-dark.svg
│   └── brand-guidelines.md
├── content/
│   ├── landing.ts
│   ├── services.ts
│   ├── company.ts
│   ├── process.ts
│   └── navigation.ts
└── demos/
    └── vector-uno/
        ├── README.md
        ├── scripts/
        │   ├── demo-01-script.md
        │   └── demo-02-script.md
        ├── prompts/
        │   ├── vector-one-demo-01.md
        │   └── vector-one-demo-02.md
        ├── storyboards/
        │   ├── scene-01.md
        │   └── scene-02.md
        ├── renders/
        │   ├── draft-01.mp4
        │   └── draft-02.mp4
        ├── poster/
        │   ├── vector-one-demo-01-poster.jpg
        │   └── vector-one-demo-02-poster.jpg
        └── final/
            ├── vector-one-demo-01.mp4
            └── vector-one-demo-02.mp4

public/
└── assets/
    ├── brand/
    │   └── vector-austral-logo.svg
    ├── demos/
    │   └── vector-uno/
    │       ├── vector-one-demo-01.mp4
    │       └── vector-one-demo-01-poster.jpg
    └── images/
```

### Reglas de organización

- `sources/content/` será la fuente de los textos de la landing, servicios,
  navegación, identidad y metadatos asociados. Los componentes no deberán contener
  bloques extensos de texto comercial hardcodeados.
- `sources/brand/` conservará los originales del logo SVG de Vector Austral y
  sus variantes aprobadas para fondos claros, oscuros o monocromáticos.
- `sources/demos/vector-uno/` será el repositorio de trabajo del contenido de video.
  Allí se guardarán guiones, prompts, storyboards, renders internos y versiones
  finales revisadas, con una separación clara entre borradores y assets finales.
- La carpeta `scripts/` alberga la narrativa de cada pieza audiovisual; `prompts/`
  conserva la base para generación con IA; `storyboards/` define la secuencia visual;
  `renders/` guarda versiones de prueba; `poster/` conserva preview visuals; y
  `final/` contiene únicamente los vídeos aprobados para producción.
- Las demos no se cargarán inicialmente en la landing. Se incorporarán y
  cargarán de forma diferida cuando el visitante seleccione un producto y haga
  clic en "Ver demo".
- `public/assets/` contendrá únicamente las versiones optimizadas y publicables
  que el navegador deba consumir. Los videos de la landing deberán contar con
  poster y formato compatible con navegadores modernos.
- No se duplicarán archivos manualmente sin distinguir entre original y versión
  publicada. Cada asset publicado deberá poder rastrearse a su fuente.
- Las URLs externas de producción y cualquier configuración sensible quedarán
  fuera de la spec y no se hardcodearán en componentes; deberán resolverse
  mediante configuración de entorno tipada cuando corresponda.
- La identidad de Vector Uno como protagonista de los videos deberá mantenerse
  consistente con la marca: asistente premium, técnico, claro y útil, sin buscar
  un estilo genérico o demasiado agresivo desde el punto de vista comercial.

### Adaptación visual de referencia v1.0.1

Se adopta la dirección visual aprobada del repositorio `vectorAustral-v1.0.1`
sin reemplazar la arquitectura actual:

- Hero en dos columnas con superficies oscuras, bordes sutiles y acentos cian.
- Navbar responsive con logo oficial, navegación por anclas y CTA al diagnóstico.
- Secciones independientes para identidad, servicios y proceso.
- Copy editorial tipado en `sources/content/`; no se duplican textos extensos
  dentro de JSX.
- Se conservan Firebase/Firestore, el formulario validado, Vector Uno, tests y
  la carga diferida de demos.
- No se publican métricas o resultados cuantitativos que no estén aprobados
  explícitamente.
- El footer reutiliza el mismo logo publicado que el navbar.
- Vector Uno se presenta como una burbuja flotante accesible, con movimiento
  sutil y sin copiar literalmente la identidad visual de otras plataformas.
- Las animaciones son funcionales y respetan `prefers-reduced-motion`.

### Alcance audiovisual del MVP

- El MVP podrá incorporar una demo institucional breve protagonizada por Vector
  Uno, con una reseña clara de los servicios de Vector Austral.
- La pieza podrá generarse con Nano Banana, Veo 3 u otra herramienta aprobada
  para generación audiovisual. La herramienta es parte del flujo de producción,
  no una dependencia del runtime de la aplicación.
- El video deberá contar con guion, storyboard, poster y archivo final
  aprobado antes de publicarse. No se utilizarán renders experimentales ni
  material genérico como evidencia del producto.
- El contenido deberá presentar web, automatizaciones y soluciones móviles de
  forma breve, sin presupuestos, métricas inventadas ni promesas no aprobadas.
- La producción de videos institucionales adicionales, personajes, campañas y
  material avanzado de Vector Uno queda fuera de Spec 001 y se documentará en
  las Specs 2 y 3.

### Fuera de alcance reservado para Specs 2 y 3

- Área privada de clientes, autenticación y dashboard.
- Biblioteca avanzada de contenidos y demos específicas de Vector Uno.
- Material audiovisual adicional, guiones de campañas y variantes por servicio.
- Flujos de personalización, analítica y automatizaciones vinculadas al área de
  clientes.

## Criterios de finalización

1. Landing convierte a formulario y transmite automatización.
2. Bot filtra sin presupuestar; toda duda deriva a formulario.
3. Formulario con 4 campos + captcha guarda lead y reconoce repetidos.
4. Fallos muestran mensaje + vías alternativas.
5. Lint + prettier + tests en verde, sin secretos hardcodeados.
6. Repositorio en GitHub configurado con control de versiones y flujo CI/CD automático a producción.
