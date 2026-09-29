# Plan de Arquitectura Técnica — Spec 001

## 1. Visión General del Sistema y Módulos

El sistema corresponde a la Landing Page institucional y de captación de **Vector Austral**, con integración de un asistente virtual (`Vector Uno`), formulario de captación anti-spam y persistencia en Firebase Firestore para trazabilidad de leads y clientes.

```
┌─────────────────────────────────────────────────────────────┐
│                 Visitante / Cliente Potencial               │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌─────────────────────────┐           ┌─────────────────────────┐
│   M1: Landing Showroom  │           │   M2: Bot Vector Uno    │
│  - Hero Tech            │           │  - Base Conocimiento    │
│  - Servicios (Web/App/n8n)          │  - Bloqueo Presupuestos │
│  - Video Demo Vector Uno│           │  - Desvío a Formulario  │
└───────────┬─────────────┘           └───────────┬─────────────┘
            │                                     │
            └──────────────────┬──────────────────┘
                               ▼
            ┌─────────────────────────────────────┐
            │   M3: Formulario Lead & Anti-Spam   │
            │  - Validación Zod (4 campos)        │
            │  - Captcha Humano                   │
            │  - Fallback WhatsApp / Mail         │
            └──────────────────┬──────────────────┘
                               ▼
            ┌─────────────────────────────────────┐
            │   M4: Persistencia Firebase Lead    │
            │  - Deduplicación (email / phone)    │
            │  - Historial de consultas por fecha │
            │  - Clasificación Lead vs Cliente    │
            └──────────────────┬──────────────────┘
                               ▼
            ┌─────────────────────────────────────┐
            │   M5: CI/CD Pipeline (GitHub)       │
            │  - Lint + Prettier + Tests + Build  │
            │  - Despliegue Automático            │
            └─────────────────────────────────────┘
```

---

## 2. Matriz de Cobertura de Requisitos Funcionales

| Módulo                  | Componente / Archivo                                                                                       | Responsabilidad                                                                                                | Requisitos (EARS)    |
| :---------------------- | :--------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------- | :------------------- |
| **M1: Landing Core**    | `app/page.tsx`<br>`components/Hero.tsx`<br>`components/ServicesShowroom.tsx`<br>`components/DemoVideo.tsx` | Layout oscuro/cian, mobile-first, visualización de servicios y demo de automatización con Vector Uno.          | **RF-1**             |
| **M2: Bot Asistente**   | `lib/bot/botEngine.ts`<br>`components/ChatWidget.tsx`                                                      | Respuestas 24/7 de base de servicios, bloqueo estricto de presupuestos automáticos y redirección a formulario. | **RF-2, RF-3, RF-7** |
| **M3: Captación**       | `components/ContactForm.tsx`<br>`lib/validators/leadSchema.ts`                                             | Captura de datos, validación Zod, captcha humano y gestión de estados de error/fallback.                       | **RF-4, RF-7**       |
| **M4: Repositorio**     | `lib/firebase/leadService.ts`<br>`lib/firebase/config.ts`                                                  | Registro en Firestore, deduplicación por email/teléfono y acumulación histórica de motivos.                    | **RF-5, RF-6**       |
| **M5: Infraestructura** | `.github/workflows/ci.yml`<br>`package.json`                                                               | Pipeline de integración continua y verificación de calidad automática.                                         | **RF-8**             |

---

## 3. Modelo de Datos (Firestore)

**Colección:** `/leads`
**Estructura del Documento:**

```typescript
export interface ConsultationEntry {
  reason: string;
  timestamp: string; // Formato ISO 8601 UTC
  source: "landing_form" | "bot_redirect";
}

export interface LeadDocument {
  id: string; // Generado o UID
  fullName: string;
  email: string; // Clave de búsqueda / indexado
  phone: string; // Clave de búsqueda / indexado
  isClient: boolean; // Flag indicando si es cliente activo
  consultationHistory: ConsultationEntry[];
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

---

## 4. Estructura de Directorios del Proyecto

```
VectorAustraWeb/
├── .github/
│   └── workflows/
│       └── ci.yml               # Pipeline GitHub Actions (RF-8)
├── app/
│   ├── layout.tsx               # Root layout con metadata y estilos globales
│   ├── page.tsx                 # Landing Page principal (RF-1)
│   └── globals.css              # Variables de Tailwind y tokens de diseño
├── components/
│   ├── Hero.tsx                 # Hero Section
│   ├── ServicesShowroom.tsx     # Showroom de Servicios Web, Android, n8n
│   ├── DemoVideo.tsx            # Video demo interactivo Vector Uno
│   ├── ContactForm.tsx          # Formulario con Captcha y fallbacks (RF-4, RF-7)
│   └── ChatWidget.tsx           # Asistente flotante 24/7 Vector Uno (RF-2, RF-3)
├── lib/
│   ├── bot/
│   │   ├── knowledgeBase.ts     # Base de datos local de servicios y alcances
│   │   └── botEngine.ts         # Lógica y filtros del bot
│   ├── firebase/
│   │   ├── config.ts            # Inicialización segura de Firebase
│   │   └── leadService.ts       # Operaciones CRUD y deduplicación de leads
│   └── validators/
│       └── leadSchema.ts        # Contratos de validación con Zod
├── sources/
│   ├── content/
│   │   ├── landing-copy.md      # Copy aprobado de la landing
│   │   ├── landing.ts           # Contenido estructurado de la landing
│   │   ├── services.ts          # Servicios y propuesta de valor
│   │   ├── demos.ts             # Metadatos de demos de Vector Uno
│   │   └── navigation.ts        # Navegación y enlaces editoriales
│   ├── brand/
│   │   ├── vector-austral-logo.svg
│   │   ├── vector-austral-logo-dark.svg
│   │   └── brand-guidelines.md
│   └── demos/
│       └── vector-uno/
│           ├── <demo-name>.mp4
│           ├── <demo-name>-poster.webp
│           └── metadata.ts
├── public/
│   └── assets/
│       ├── brand/
│       ├── demos/
│       └── images/
├── tests/
│   ├── botEngine.test.ts        # Tests unitarios del motor del bot
│   ├── leadSchema.test.ts       # Tests unitarios de esquemas de validación
│   ├── leadService.test.ts      # Tests de persistencia y deduplicación
│   └── ContactForm.test.tsx     # Tests de componente y fallback de formulario
├── docs/
│   └── constitution.md          # 10 principios del proyecto
├── specs/
│   ├── 001-landing-mvp-spec.md  # Especificación funcional
│   ├── plan.md                  # Este documento de arquitectura
│   └── task.md                  # Lista de tareas atómicas <30 min
├── .env.example                 # Plantilla tipada de variables de entorno
├── .vscode/
│   └── mcp.json                 # Context7 documental; no participa del runtime
└── package.json                 # Scripts de build, test y lint
```

## 5. Arquitectura de contenido y assets

La landing separará el contenido editorial, la identidad visual y los recursos
multimedia del código de presentación.

`sources/content/` será la fuente de los textos de la landing, incluyendo el
hero, llamados a la acción, Diagnóstico Inicial, propuesta de valor, servicios,
diferenciadores técnicos, cierre, navegación y metadatos de demos. El copy
aprobado se conservará inicialmente en `sources/content/landing-copy.md` y
podrá transformarse en estructuras tipadas antes de conectarlo a componentes.

`sources/brand/` conservará los originales del logo SVG de Vector Austral y sus
variantes aprobadas. `sources/demos/vector-uno/` conservará los videos
originales, posters y metadatos de cada demo cuando sean creados.

La demo institucional del MVP se incorporará y cargará de forma diferida cuando
el visitante seleccione "Ver demo". La pieza será protagonizada por Vector Uno
y podrá producirse con Nano Banana o Veo 3; estas herramientas no forman parte
del runtime ni reciben credenciales desde la aplicación. No se inventarán ni se
incluirán archivos multimedia antes de que existan los recursos aprobados.

El área privada de clientes y el material avanzado de Vector Uno no forman
parte de este plan técnico. Se especificarán por separado en Specs 2 y 3 para
evitar ampliar el alcance del MVP.

`public/assets/` contendrá las versiones optimizadas que el navegador deba
consumir. Cada asset publicado deberá poder rastrearse a su fuente original.
Los videos deberán contar con poster y formato compatible con navegadores
modernos. Si su tamaño excede los límites razonables del repositorio, se
evaluará almacenamiento externo sin hardcodear URLs de producción.

## 6. Herramientas de documentación

Context7 estará configurado en `.vscode/mcp.json` como servidor MCP documental.
Se utilizará únicamente para consultar documentación técnica de las versiones
instaladas de Next.js, React, Tailwind, Vitest, Testing Library y servicios
integrados.

Context7 no será una dependencia de la aplicación, no participará en el
runtime, no definirá decisiones de producto y no recibirá credenciales ni
información sensible. Las decisiones de arquitectura seguirán documentándose
en las specs y deberán validarse contra el repositorio y los tests.

## 7. Decisiones Técnicas y Justificación

| Decisión          | Opción Seleccionada     | Alternativa Descartada     | Justificación                                                                                                                 |
| :---------------- | :---------------------- | :------------------------- | :---------------------------------------------------------------------------------------------------------------------------- |
| **Framework**     | Next.js 15 (App Router) | Vite SPA / CRA             | SSR/SSG para SEO óptimo en landing, Server Actions para llamadas seguras y soporte nativo de TypeScript.                      |
| **Estilos**       | Tailwind CSS nativo     | Librerías UI (MUI, Chakra) | Cero impacto de bundle innecesario, personalización total con la paleta de marca y cumplimiento de la Constitución.           |
| **Base de Datos** | Firebase Firestore      | PostgreSQL / Supabase      | SDK liviano, esquema documental flexible para el array de historial de consultas y configuración sin backend dedicado en MVP. |
| **Validación**    | Zod                     | Joi / Validación manual    | Integración TypeScript de primer nivel (`z.infer`), tipado estricto y mensajes de error customizados en español.              |
| **Testing**       | Vitest + RTL            | Jest                       | Mayor velocidad en Vite/Next, compatibilidad ESM nativa y sintaxis estándar.                                                  |

---

## 8. Variables de Entorno Seguras (`.env.example`)

```env
# Firebase Client Configuration (Públicas pero restringidas por reglas)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Contacto y Fallback
NEXT_PUBLIC_WHATSAPP_NUMBER=+5491100000000
NEXT_PUBLIC_CONTACT_EMAIL=contacto@vectoraustral.com
```
