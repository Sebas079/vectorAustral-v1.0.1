# Despliegue del MVP — GitHub + Hostinger VPS

## Objetivo

Este documento define el despliegue de Vector Austral para el MVP mediante:

- GitHub como repositorio y control de versiones.
- GitHub Actions como pipeline de calidad y automatización.
- Hostinger VPS como entorno de producción.
- Node.js 20 o superior para ejecutar Next.js.
- PM2 para mantener el proceso activo.
- Nginx como reverse proxy HTTPS.
- Firebase/Firestore como persistencia de leads.

La estrategia inicial prioriza bajo costo, trazabilidad y simplicidad operativa.
Las releases versionadas y los despliegues sin interrupción quedan reservados
para Specs 2 y 3.

## Arquitectura de producción

```text
Push a main
    |
    v
GitHub Actions
    |
    +--> npm ci
    +--> npm run lint
    +--> npm run format
    +--> npm run test
    +--> npm run build
    |
    v
SSH seguro hacia Hostinger VPS
    |
    +--> git pull origin main
    +--> npm ci
    +--> npm run build
    +--> pm2 restart vector-austral
    |
    v
Nginx HTTPS
    |
    v
Next.js en localhost:3000
    |
    +--> Firebase/Firestore
```

## Requisitos del VPS

El servidor debe contar con:

- Ubuntu LTS actualizado.
- Node.js 20 o superior.
- npm.
- Git.
- PM2 instalado globalmente.
- Nginx.
- Certbot y certificado SSL activo.
- Firewall con SSH, HTTP y HTTPS habilitados.
- Usuario de despliegue sin utilizar `root` para la operación cotidiana.

La aplicación se ubicará inicialmente en:

```text
/var/www/vector-austral
```

El archivo de variables de producción debe permanecer fuera del repositorio:

```text
/var/www/vector-austral/.env.production
```

## Configuración inicial de la aplicación

En el VPS, la primera instalación debe realizarse de forma manual y controlada:

```bash
cd /var/www
git clone git@github.com:ORGANIZACION/REPOSITORIO.git vector-austral
cd vector-austral
npm ci
npm run build
pm2 start npm --name vector-austral -- start
pm2 save
pm2 startup
```

El comando generado por `pm2 startup` debe ejecutarse con los permisos
indicados por PM2 para que la aplicación se reinicie después de un reboot.

## Variables de entorno

Las variables reales se configuran directamente en Hostinger dentro de
`.env.production`. Nunca se suben al repositorio.

Variables esperadas:

```text
FIREBASE_SERVICE_ACCOUNT_JSON
NEXT_PUBLIC_TURNSTILE_SITE_KEY
TURNSTILE_SECRET_KEY
TURNSTILE_HOSTNAME
LEAD_RATE_LIMIT_HMAC_KEY
CONTACT_WEBHOOK_URL
CONTACT_WEBHOOK_SECRET
VECTORUNO_WEBHOOK_URL
VECTORUNO_WEBHOOK_SECRET
ALLOWED_ORIGINS
NEXT_PUBLIC_WHATSAPP_NUMBER
NEXT_PUBLIC_CONTACT_EMAIL
```

`FIREBASE_SERVICE_ACCOUNT_JSON` es el JSON completo de una cuenta de servicio
con acceso mínimo necesario a Firestore. Esta credencial se usa solo en el
servidor Node.js y nunca debe tener el prefijo `NEXT_PUBLIC_`. La clave privada
debe permanecer en el archivo `.env.production`, con los saltos de línea
codificados como `\n` si el panel de Hostinger requiere una sola línea.

`NEXT_PUBLIC_TURNSTILE_SITE_KEY` es pública y debe corresponder al dominio de
producción registrado en Cloudflare. `TURNSTILE_SECRET_KEY` es privada. Ambas
son necesarias junto con `TURNSTILE_HOSTNAME`, que debe coincidir exactamente
con el hostname del dominio registrado en el widget de Cloudflare (por ejemplo,
`www.ejemplo.com`, sin protocolo ni ruta). Si falta alguna variable, el
formulario bloquea el envío.
Las variables deben estar cargadas antes de ejecutar `npm run build`; las
variables `NEXT_PUBLIC_*` quedan incluidas en el bundle de cliente durante la
compilación y requieren un nuevo build si cambian.

La plantilla sin secretos se mantiene en
[.env.example](../.env.example). El archivo `.gitignore` bloquea los entornos
locales y de producción.

El límite de envíos almacena un HMAC no reversible de la IP y marcas de tiempo
en `leadSubmissionRateLimits`. Habilitá una política TTL de Firestore sobre el
campo `expiresAt` para eliminar estos documentos vencidos.
Configurá `LEAD_RATE_LIMIT_HMAC_KEY` con un valor aleatorio de al menos 32
caracteres (por ejemplo, generado con `openssl rand -hex 32`); se usa para
seudonimizar la IP y no se comparte con Turnstile.

Si siguen activas las integraciones externas antiguas, configurá sus URL de
webhook y secretos correspondientes. El endpoint `/api/contact` falla de forma
explícita si no tiene `CONTACT_WEBHOOK_URL`. El endpoint `/api/vectoruno`
también responde indisponible hasta que se configure `VECTORUNO_WEBHOOK_URL`;
ninguno simula recepción exitosa cuando falta la integración.
`ALLOWED_ORIGINS` puede configurarse como una lista separada por comas para
restringir el acceso de navegador a las APIs heredadas.

Publicá las reglas de [firestore.rules](../firestore.rules) en el proyecto
Firebase para impedir acceso directo no autenticado a las colecciones; las
operaciones de leads las ejecuta exclusivamente el servidor con Admin SDK.

## Nginx y dominio

Nginx debe recibir el tráfico público y derivarlo a Next.js:

```text
https://dominio-real
    |
    v
Nginx :443
    |
    v
http://127.0.0.1:3000
```

La configuración debe incluir:

- redirección de HTTP a HTTPS;
- certificado TLS válido;
- proxy hacia `127.0.0.1:3000`;
- `proxy_set_header X-Real-IP $remote_addr` para que la aplicación reciba la
  IP efectiva del cliente y no una cabecera reenviada por el visitante;
- soporte para archivos estáticos y el video institucional;
- headers básicos de seguridad;
- timeouts compatibles con la aplicación.

El puerto 3000 no debe exponerse públicamente.

## Secrets de GitHub Actions

El repositorio debe configurar estos secrets en GitHub:

```text
HOSTINGER_HOST
HOSTINGER_PORT
HOSTINGER_USER
HOSTINGER_SSH_KEY
HOSTINGER_APP_PATH
```

Opcionalmente:

```text
HOSTINGER_KNOWN_HOSTS
```

La clave SSH debe ser exclusiva para el despliegue y no debe reutilizar una
clave personal. Nunca se deben escribir contraseñas, claves privadas o tokens
en el workflow.

## Flujo de despliegue aprobado para el MVP

El job de despliegue solo debe ejecutarse después de que el job de calidad
termine correctamente y únicamente para pushes a `main`.

En Hostinger, el flujo será:

```bash
cd /var/www/vector-austral
git fetch origin
git checkout main
git pull --ff-only origin main
npm ci
npm run build
pm2 restart vector-austral
```

Si el build falla, no se debe reiniciar PM2. El error debe quedar visible en
los logs de GitHub Actions y en la consola del servidor.

## Verificación posterior

Después de cada despliegue se debe verificar:

- la URL pública responde con HTTP 200;
- el certificado HTTPS es válido;
- la landing carga el logo y los estilos;
- el video institucional responde desde `public/assets`;
- Vector Uno abre correctamente;
- el formulario se renderiza;
- Firebase recibe leads en el proyecto esperado;
- PM2 informa el proceso `vector-austral` como `online`.

Comandos útiles en el VPS:

```bash
pm2 status
pm2 logs vector-austral --lines 100
curl -I https://dominio-real
curl -I https://dominio-real/assets/demos/vector-uno/VectorUnoDemo.mp4
```

## Rollback operativo del MVP

La estrategia simple utiliza Git para volver a un commit conocido:

```bash
cd /var/www/vector-austral
git log --oneline -5
git checkout COMMIT_ESTABLE
npm ci
npm run build
pm2 restart vector-austral
```

Este rollback es manual y debe registrarse en el historial de despliegues. Las
releases aisladas con enlaces simbólicos se evaluarán antes de Specs 2 y 3.

## Límites y decisiones

- No se guardan credenciales en GitHub como archivos del repositorio.
- No se cambia Next.js por un sitio estático.
- No se modifica Firebase por el cambio de hosting.
- El video institucional continúa siendo un asset versionado y rastreable.
- La configuración de producción no se inventa hasta disponer del dominio,
  IP, usuario y clave SSH reales.
- El despliegue automático requiere completar los secrets de GitHub y probar
  primero un despliegue manual.

## Estado

La arquitectura del proyecto y el pipeline de calidad local están listos. El
despliegue automático queda pendiente de:

1. preparar el VPS de Hostinger;
2. configurar dominio, Nginx y SSL;
3. crear el usuario y la clave SSH de despliegue;
4. probar el primer despliegue manual;
5. agregar los secrets de GitHub;
6. habilitar el job `deploy` en GitHub Actions.
