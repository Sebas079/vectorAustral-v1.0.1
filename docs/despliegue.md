# Despliegue del MVP — Vercel

## Arquitectura

Los cambios se integran en `main` mediante pull request. GitHub Actions ejecuta
lint, formato, tests y build; solo si todo pasa, un push a `main` inicia el
despliegue de producción a Vercel mediante su CLI. Los secretos y las variables
de la aplicación se guardan fuera del repositorio.

```text
Pull request / push a main
          |
          v
GitHub Actions: calidad (Node.js 22)
          |
          +-- error: no despliega
          |
          +-- push exitoso a main
                    |
                    v
          Vercel CLI: pull + build + deploy --prod
                    |
                    v
          Vercel HTTPS + Next.js + Firebase/Firestore
```

## Preparación de Vercel

1. Crear un proyecto Vercel para este repositorio y mantener `main` como rama
   de producción. Seleccionar Node.js 22 como versión de runtime.
2. Configurar las variables de aplicación indicadas abajo en **Project
   Settings → Environment Variables**, seleccionando Production.
3. Si el proyecto queda conectado a GitHub, desactivar los despliegues
   automáticos por integración Git para evitar builds y publicaciones
   duplicadas. El despliegue productivo lo controla el job de GitHub Actions.
4. Vincular el proyecto con Vercel CLI desde una copia local autenticada:

   ```bash
   npx vercel link
   ```

   La vinculación genera `.vercel/project.json`, ignorado por Git. Obtener de
   ese archivo `orgId` y `projectId`; no copiar ni publicar el archivo.

5. Crear un token de despliegue de Vercel con los permisos necesarios para el
   proyecto.

## Secrets de GitHub

En **GitHub → Settings → Secrets and variables → Actions**, crear estos
repository secrets:

| Secret              | Valor                                 |
| ------------------- | ------------------------------------- |
| `VERCEL_TOKEN`      | Token de Vercel                       |
| `VERCEL_ORG_ID`     | `orgId` de `.vercel/project.json`     |
| `VERCEL_PROJECT_ID` | `projectId` de `.vercel/project.json` |

El workflow valida que los tres secrets existan antes de llamar a Vercel. No
agregar sus valores al código, a los logs ni a archivos versionados.

## Variables de aplicación en Vercel

Configurar los valores reales en el entorno **Production** del proyecto:

| Variable                         | Uso                                                                 |
| -------------------------------- | ------------------------------------------------------------------- |
| `FIREBASE_SERVICE_ACCOUNT_JSON`  | Credencial privada de Firebase Admin, con acceso mínimo a Firestore |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Clave pública Turnstile registrada para el hostname de producción   |
| `TURNSTILE_SECRET_KEY`           | Secreto privado Turnstile                                           |
| `TURNSTILE_HOSTNAME`             | Hostname exacto registrado en Turnstile, sin protocolo ni ruta      |
| `LEAD_RATE_LIMIT_HMAC_KEY`       | Valor aleatorio de al menos 32 caracteres para seudonimizar IP      |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`    | Número público de contacto, si se ofrece WhatsApp                   |
| `NEXT_PUBLIC_CONTACT_EMAIL`      | Email público de contacto                                           |

Las variables `CONTACT_WEBHOOK_URL`, `CONTACT_WEBHOOK_SECRET`,
`VECTORUNO_WEBHOOK_URL`, `VECTORUNO_WEBHOOK_SECRET` y `ALLOWED_ORIGINS` solo
se configuran si se mantienen activas esas integraciones heredadas. Los
endpoints correspondientes responden con error explícito cuando el webhook
requerido no está configurado.

Las variables `NEXT_PUBLIC_*` se incorporan al bundle durante el build. Si se
modifican, se debe ejecutar un nuevo despliegue. El formulario no puede
verificar visitantes ni guardar leads correctamente si faltan la configuración
de Turnstile o la credencial de Firebase.

La plantilla sin secretos está en [.env.example](../.env.example). Las reglas
de [firestore.rules](../firestore.rules) deben publicarse en el proyecto
Firebase de producción; las operaciones de leads usan Firebase Admin
exclusivamente en el servidor.

## Flujo y validación

El job de producción en [.github/workflows/ci.yml](../.github/workflows/ci.yml)
se ejecuta únicamente en pushes a `main` y depende del job de calidad. Corre
`vercel pull`, `vercel build --prod` y `vercel deploy --prebuilt --prod`. Los
despliegues se serializan para evitar que dos commits compitan por producción.
Un pull request o un push a otra rama no publica el sitio.

Después de configurar los secrets y las variables:

1. Integrar a `main` un cambio que haya pasado el workflow de calidad.
2. Confirmar que termina correctamente el job **Deploy production to Vercel**.
3. Verificar la URL de Vercel o el dominio configurado: HTTPS, landing, logo,
   video, Vector Uno, formulario, captcha y persistencia de leads en el
   proyecto Firebase esperado.
4. Configurar el hostname real en Cloudflare Turnstile y actualizar
   `TURNSTILE_HOSTNAME` y las claves correspondientes en Vercel si cambia el
   dominio.

La publicación queda pendiente hasta crear el proyecto, cargar los secrets y
las variables de producción, y completar esa verificación con una URL real.
