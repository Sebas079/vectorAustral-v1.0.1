# Desglose de tareas de implementación — Spec 003

Tareas ordenadas por dependencias operativas. No se estiman tiempos. La última
tarea está reservada para publicar la web en su host definitivo y verificarla
en el dominio público.

## Mapa de dependencias

```text
[T1 Prerrequisitos] -> [T2 VPS y n8n] -> [T3 Vector Uno + pruebas]
        |                                      |
        +-> [T4 Revisión SEO y UX] ------------+
                                               v
                                  [T5 Preflight de producción]
                                               |
                                               v
                              [T6 Publicación web en Vercel]
```

## Fase 0 — Prerrequisitos externos

- [ ] **T1: Resolver accesos y recursos de publicación**
  - Requisitos: RF-1, RF-3, RF-5
  - Pasos:
    - [ ] Confirmar que el VPS de Hostinger existe, está activo y tiene recursos
          suficientes para alojar n8n de forma continua.
    - [x] Confirmar quién administrará Vercel, Hostinger y los secretos de
          producción.
    - [x] Confirmar acceso a DNS de `vectoraustral.com.ar`.
    - [ ] Obtener los accesos por un canal seguro; no incorporarlos al
          repositorio ni a esta tarea.
  - Hecho cuando:
    - [ ] Los responsables y accesos necesarios están confirmados sin exponer
          credenciales en el repositorio.
    - [ ] Se puede administrar el VPS, el proyecto Vercel y los registros DNS.
  - Estado al 2026-10-18: el propietario administrará Vercel, Hostinger y los
    secretos; tiene acceso DNS. El VPS todavía no existe, por lo que T1 sigue
    bloqueada hasta aprovisionarlo.

## Fase 1 — Asistente en el VPS

- [ ] **T2: Preparar n8n en Hostinger**
  - Requisitos: RF-16, RF-20, RF-21, RF-22
  - Dependencia: T1
  - Pasos:
    - [ ] Instalar y configurar n8n en el VPS con acceso persistente y
          reinicio/recuperación ante reinicios del servicio.
    - [ ] Configurar HTTPS y proteger la interfaz administrativa de n8n.
    - [ ] Guardar credenciales y claves de cifrado de n8n fuera del repositorio.
    - [ ] Configurar el workflow de Vector Uno para no persistir conversaciones
          después de la sesión.
    - [ ] Documentar de forma segura la URL de webhook que consumirá la web.
  - Hecho cuando:
    - [ ] n8n permanece accesible por HTTPS y sobrevive a un reinicio del
          servicio.
    - [ ] El webhook responde con el esquema esperado y no guarda historiales
          persistentes.
    - [ ] Ninguna credencial aparece en el código, logs públicos o documentación
          versionada.

- [ ] **T3: Conectar Vector Uno y verificar sus comportamientos**
  - Requisitos: RF-16–RF-21, RF-24
  - Dependencia: T2
  - Pasos:
    - [x] Conectar el chat al endpoint de servidor y validar el contrato JSON
          estricto de respuesta `{ "message": "..." }`.
    - [x] Firmar las solicitudes a n8n con HMAC-SHA256 y rechazar la llamada si
          falta el secreto.
    - [x] Resolver las solicitudes de precio localmente y mostrar fallback
          explícito ante error de red, respuesta inválida o timeout.
    - [ ] Configurar en el entorno de ejecución la URL y el secreto del webhook.
    - [ ] Probar una consulta válida y comprobar que el chat muestra la
          respuesta del workflow.
    - [ ] Probar una solicitud de precio y comprobar que no se devuelve una
          cifra ni un presupuesto.
    - [ ] Probar una consulta fuera de la información aprobada y comprobar que
          se ofrece el formulario de contacto.
    - [ ] Probar n8n detenido, respuesta inválida y timeout superior a
          8 segundos; comprobar el fallback al formulario.
    - [ ] Comprobar que los mensajes no se guardan en la base de leads ni en un
          historial persistente del asistente.
  - Hecho cuando:
    - [ ] Los casos anteriores pasan y sus resultados no dependen de respuestas
          inventadas.
    - [ ] Los fallos se informan como indisponibilidad, sin presentarse como
          respuestas exitosas.

## Fase 2 — Preparación de la web

- [ ] **T4: Completar la revisión SEO, navegación y experiencia responsive**
  - Requisitos: RF-6–RF-15, RF-25, RF-26
  - Pasos:
    - [x] Implementar y validar localmente título, descripción, canonical,
          metadatos sociales, `robots.txt`, sitemap y noindex para APIs.
    - [x] Revisar el contenido visible y los enlaces internos; confirmar que
          destinos y anchors existan y sean alcanzables.
    - [x] Confirmar que no haya claims, ubicaciones, métricas o datos
          estructurados no respaldados por fuentes aprobadas.
    - [x] Confirmar que “Clientes” no aparezca mientras no exista el dashboard.
    - [x] Verificar localmente que no haya desbordamiento horizontal a 360, 390,
          768 y 1440 píxeles.
    - [x] Registrar y resolver hallazgos SEO críticos o altos, o documentar su
          aceptación explícita antes del lanzamiento.
  - Hecho cuando:
    - [x] Los enlaces y contenidos satisfacen la Spec y no quedan hallazgos
          críticos o altos sin resolver o aceptar.
    - [x] La navegación funciona con teclado y en móvil y escritorio.

  - Revisión local 2026-10-18: todos los enlaces internos renderizados tienen
    destino; no hay overflow horizontal a 360, 390, 768 y 1440 px; el menú
    móvil abre con teclado y los enlaces del menú de escritorio reciben foco.
    “Clientes” no aparece en la página activa y no se encontró JSON-LD. El
    responsable confirmó que el copy visible está aprobado y respaldado. La
    revisión local no dejó hallazgos críticos o altos pendientes; la
    validación del dominio público sigue pendiente para T6.

- [ ] **T5: Ejecutar preflight de producción**
  - Requisitos: RF-1–RF-5, RF-23, RF-24
  - Dependencias: T3, T4
  - Pasos:
    - [ ] Integrar los cambios aprobados a la rama configurada para producción.
    - [ ] Ejecutar CI: instalación reproducible, lint, formato, tests y build.
    - [ ] Definir las variables de producción en Vercel, incluyendo
          `NEXT_PUBLIC_SITE_URL=https://vectoraustral.com.ar`, Firebase Admin,
          Turnstile, rate limit y las variables necesarias para el webhook.
    - [ ] Confirmar que Turnstile incluya el hostname definitivo y que Firebase
          apunte al proyecto aprobado.
    - [ ] Revisar que no haya secretos en el repositorio, bundle cliente, logs o
          respuestas de API.
  - Hecho cuando:
    - [ ] CI finaliza sin errores y el build usa la configuración de producción
          esperada.
    - [ ] Las variables requeridas están configuradas de forma segura; no se
          imprimen ni versionan sus valores.
    - [ ] Ninguna comprobación crítica de publicación queda pendiente.

## Fase 3 — Publicación final

- [ ] **T6: Publicar la web en Vercel y habilitar el dominio definitivo**
  - Requisitos: RF-1–RF-15, RF-23–RF-26 y criterios de finalización
  - Dependencias: T1, T3, T4, T5
  - Pasos:
    - [ ] Crear o confirmar el proyecto de Vercel y vincularlo al repositorio y
          rama de producción.
    - [ ] Configurar los secretos requeridos por el despliegue automático de
          GitHub Actions (`VERCEL_TOKEN`, `VERCEL_ORG_ID` y
          `VERCEL_PROJECT_ID`) en los secretos del repositorio.
    - [ ] Apuntar `vectoraustral.com.ar` a Vercel mediante los registros DNS
          indicados por el proveedor.
    - [ ] Esperar la emisión del certificado y confirmar HTTPS válido para el
          dominio canónico.
    - [ ] Confirmar que un push aprobado a la rama de producción despliegue
          únicamente después de pasar los controles de calidad.
    - [ ] Verificar en el dominio real la versión publicada, canonical,
          metadatos sociales, `robots.txt`, sitemap y cabeceras noindex de API.
    - [ ] Verificar en el dominio real navegación, video, formulario, Turnstile,
          guardado en Firebase, Vector Uno, bloqueo de presupuestos y fallback si
          n8n no responde.
    - [ ] Confirmar la navegación en 360, 390, 768 y 1440 píxeles y comprobar
          que no haya desbordamiento horizontal.
    - [ ] Obtener la confirmación del responsable de que la web, el formulario
          y Vector Uno funcionan en el dominio público.
  - Hecho cuando:
    - [ ] `https://vectoraustral.com.ar` sirve la versión esperada con
          certificado válido y configuración de producción correcta.
    - [ ] Las verificaciones funcionales y SEO de producción pasan sin errores
          ni secretos expuestos.
    - [ ] El responsable confirma el resultado; solo entonces puede cerrarse la
          Etapa 1.
