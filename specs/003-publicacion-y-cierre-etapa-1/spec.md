# Spec 003 — Publicación web y cierre de la Etapa 1

## Contexto y objetivo

La landing institucional está construida, pero todavía no se considera publicada
ni completa la Etapa 1 hasta validar el dominio real, el formulario de leads y
Vector Uno conectado a un servicio activo de n8n. El usuario eligió Vercel para
publicar la web bajo `vectoraustral.com.ar` y un VPS de Hostinger para alojar
n8n. Las conversaciones no se conservarán después de la sesión del visitante.
Esta especificación reúne los requisitos de salida a producción, preparación
SEO y verificación operativa, sin incluir el dashboard de clientes.

## Usuarios / actores

- Personas que visitan la web desde buscadores o enlaces directos.
- Personas que consultan a Vector Uno.
- Personas que solicitan un Diagnóstico Inicial.
- Equipo de Vector Austral, responsable de la cuenta, el contenido y la
  operación de los servicios externos.
- Motores de búsqueda que rastrean el contenido público del sitio.

## Historias de usuario

- H1: Como visitante, quiero encontrar y consultar la web bajo el dominio de
  Vector Austral para conocer sus servicios y solicitar un diagnóstico.
- H2: Como visitante, quiero conversar con Vector Uno para conocer los servicios
  y el proceso de trabajo, sin recibir presupuestos automáticos.
- H3: Como responsable del proyecto, quiero publicar una versión validada y
  verificar sus funciones principales antes de dar por cerrada la Etapa 1.

## Requisitos funcionales (criterios de aceptación en EARS)

- RF-1: CUANDO un cambio se integre a la rama de producción y todas las
  comprobaciones de calidad finalicen correctamente, EL SISTEMA publicará la
  versión validada en Vercel.
- RF-2: SI alguna comprobación de calidad falla, ENTONCES EL SISTEMA no
  desplegará esa versión a producción e informará qué comprobación falló.
- RF-3: SI falta una credencial o configuración requerida para publicar,
  ENTONCES EL SISTEMA finalizará el despliegue como fallido e identificará el
  nombre de la configuración faltante sin revelar valores secretos.
- RF-4: CUANDO la web se publique en el dominio aprobado, EL SISTEMA la servirá
  por HTTPS con un certificado válido para ese dominio.
- RF-5: SI el dominio, HTTPS o las variables críticas de producción no están
  verificados, ENTONCES EL EQUIPO no dará por cerrada la Etapa 1.
- RF-6: CUANDO un buscador solicite la página principal, EL SISTEMA ofrecerá un
  título y una descripción únicos, visibles en el HTML inicial y fieles a los
  servicios aprobados.
- RF-7: CUANDO un buscador solicite la página principal, EL SISTEMA ofrecerá
  `https://vectoraustral.com.ar/` como URL canónica.
- RF-8: CUANDO un buscador solicite las directivas de rastreo, EL SISTEMA
  permitirá rastrear la página institucional pública y no expondrá rutas
  privadas ni de API como páginas indexables.
- RF-9: CUANDO un buscador solicite el mapa del sitio, EL SISTEMA devolverá
  únicamente URLs públicas canónicas que respondan correctamente.
- RF-10: MIENTRAS la web esté en producción, EL SISTEMA no bloqueará la página
  institucional mediante directivas `noindex` ni mediante reglas de rastreo.
- RF-11: CUANDO se compartan enlaces de la web en plataformas sociales, EL
  SISTEMA entregará metadatos de título, descripción e imagen coherentes con la
  marca y el contenido publicado.
- RF-12: CUANDO se publiquen datos estructurados, EL SISTEMA incluirá solamente
  información verificable en las fuentes aprobadas y válida para el contenido
  visible de la página.
- RF-13: CUANDO finalice la auditoría SEO previa al lanzamiento, EL EQUIPO
  resolverá cada hallazgo crítico o alto antes de publicar o registrará su
  aceptación explícita como pendiente.
- RF-14: CUANDO la web se presente a visitantes de Argentina, EL SISTEMA
  ofrecerá contenido en español rioplatense sin atribuir presencia física a
  ciudades o regiones no confirmadas.
- RF-15: CUANDO se revise la landing en anchos de 360, 390, 768 y 1440 píxeles,
  EL SISTEMA permitirá leer y operar el contenido sin desplazamiento horizontal
  de la página.
- RF-16: CUANDO un visitante envíe una consulta a Vector Uno, EL SISTEMA
  procesará la consulta mediante el servicio de n8n habilitado en el VPS de
  Hostinger y mostrará la respuesta recibida.
- RF-17: CUANDO Vector Uno responda una consulta, EL SISTEMA limitará la
  respuesta a información aprobada sobre servicios y proceso de Vector Austral.
- RF-18: SI un visitante solicita un precio o presupuesto, ENTONCES Vector Uno
  no generará una cifra ni una cotización y lo derivará al Diagnóstico Inicial.
- RF-19: SI Vector Uno no puede responder con información aprobada, ENTONCES EL
  SISTEMA indicará que no tiene información suficiente y ofrecerá el formulario
  de contacto.
- RF-20: SI n8n no responde, devuelve una respuesta inválida o excede 8 segundos,
  ENTONCES EL SISTEMA informará que el asistente no está disponible y ofrecerá
  el formulario de contacto sin inventar una respuesta.
- RF-21: CUANDO una conversación de Vector Uno se procese, EL SISTEMA no
  almacenará de forma persistente el contenido de los mensajes en el servicio
  del asistente ni en la base de leads.
- RF-22: MIENTRAS el asistente esté publicado, EL SISTEMA permitirá iniciar
  consultas en cualquier momento, sujeto a la disponibilidad del VPS y de los
  servicios de red.
- RF-23: CUANDO se verifique el formulario en el dominio real, EL SISTEMA
  validará el captcha del hostname publicado y guardará una consulta válida en
  el proyecto de Firebase/Firestore aprobado.
- RF-24: SI falla la verificación humana, el guardado del lead o el envío al
  asistente durante la comprobación de lanzamiento, ENTONCES EL EQUIPO no dará
  por cerrado el criterio funcional afectado ni reportará un resultado exitoso.
- RF-25: MIENTRAS no exista un dashboard de clientes publicado, EL SISTEMA no
  mostrará el enlace “Clientes” en la navegación de la web.
- RF-26: CUANDO la navegación muestre un enlace interno, EL SISTEMA lo dirigirá
  a un destino público existente y alcanzable.

## Contrato del webhook de Vector Uno

- La web enviará `POST application/json` con `message` y un `userId` opcional.
- n8n responderá `200 application/json` con un objeto estricto
  `{"message":"respuesta"}`. La web rechazará respuestas vacías, malformadas o
  con campos adicionales.
- Cada solicitud llevará `x-vector-signature` con HMAC-SHA256 del cuerpo JSON;
  n8n validará la firma usando el secreto compartido antes de procesarla.
- Las solicitudes de precio se resolverán localmente con la derivación al
  Diagnóstico Inicial y no se enviarán a n8n.

## Requisitos no funcionales

- Las credenciales y secretos permanecerán fuera del código fuente, los assets,
  los logs y los artefactos públicos del navegador.
- El contenido dirigido a visitantes estará en español rioplatense claro.
- La navegación, el chat y el formulario serán utilizables con teclado y
  tecnologías de asistencia.
- El servicio de Vector Uno estará configurado para operar continuamente,
  sujeto a los límites de disponibilidad del VPS y los servicios de red.
- La web de producción y los flujos que ejecutan Firebase Admin funcionarán con
  Node.js 22 o superior.
- El contenido de servicios no afirmará ubicaciones, clientes, resultados,
  reseñas, precios ni certificaciones que no estén aprobados y verificables.
- La configuración no afirmará disponibilidad absoluta, posiciones de
  búsqueda ni volumen de tráfico garantizados.

## Casos límite

- La configuración de despliegue no está completa al integrar un cambio a la
  rama de producción.
- El dominio todavía no resuelve al proveedor o su certificado HTTPS no está
  listo.
- El hostname real no está registrado en la configuración de Cloudflare
  Turnstile.
- El VPS está activo, pero el servicio de n8n está detenido o devuelve una
  respuesta vacía o inesperada.
- El mensaje de un visitante excede los límites aceptados por el servicio de
  n8n o contiene una solicitud de cotización.
- La auditoría detecta datos insuficientes para orientar contenido de SEO local
  por ciudad sin inventar una ubicación.
- El dashboard de clientes no existe durante esta etapa y su enlace permanece
  oculto.
- El dominio, los secretos y las cuentas externas deben ser configurados por el
  propietario y no pueden inferirse ni incorporarse al repositorio.

## Fuera de alcance

- Dashboard de clientes, sus cuentas, autenticación y autorización.
- Administración de leads o conversaciones.
- Migración de la aplicación a un proveedor distinto de Vercel.
- Garantías de ranking, indexación, tráfico o conversión.
- Creación de ubicaciones, páginas locales, testimonios, métricas o casos no
  aprobados por el equipo.
- Persistencia de historiales de conversaciones de Vector Uno entre sesiones.
- Dashboard de clientes y su acceso desde la navegación.
- Integraciones adicionales de Vector Uno fuera del flujo acordado con n8n.
- Cambios de contenido comercial que no estén aprobados en las fuentes del
  proyecto.

## Criterios de finalización

- Todas las comprobaciones de lint, formato, tests y build terminan sin errores
  en la rama de producción.
- Un cambio integrado a la rama de producción completa el despliegue de Vercel
  después de pasar calidad.
- El dominio aprobado responde por HTTPS con certificado válido y muestra la
  versión esperada.
- La revisión SEO confirma título, descripción, URL canónica, metadatos
  sociales, directivas de rastreo y mapa del sitio correctos para el dominio.
- No quedan hallazgos SEO críticos o altos sin corregir o aceptar
  explícitamente.
- La revisión funcional confirma que navegación, enlaces, video y chat operan
  en móvil y escritorio.
- Un mensaje de prueba demuestra que Vector Uno recibe y muestra una respuesta
  del flujo activo de n8n en el VPS de Hostinger.
- Una solicitud de precio no recibe cotización automática.
- Una prueba con n8n indisponible muestra el fallback acordado al formulario.
- Una consulta válida desde el dominio de producción supera Turnstile y se
  guarda en el proyecto Firebase/Firestore esperado.
- La navegación de producción no muestra el enlace “Clientes” mientras no
  exista el dashboard.
- No se exponen credenciales en repositorio, bundle, logs ni respuestas de API.
- El responsable del proyecto confirma que la URL pública, el formulario y
  Vector Uno funcionan en el dominio real.

## Dudas abiertas

- [NECESITA ACLARACIÓN: ¿El propietario ya cuenta con un VPS de Hostinger activo
  y con recursos suficientes para alojar n8n de forma continua?]
- [NECESITA ACLARACIÓN: ¿Quién aportará y configurará el acceso a Vercel, el
  acceso al VPS y los secretos de producción?]
- [NECESITA ACLARACIÓN: ¿El propietario tiene acceso a la administración DNS de
  `vectoraustral.com.ar` para apuntar el dominio a Vercel y validar HTTPS?]
