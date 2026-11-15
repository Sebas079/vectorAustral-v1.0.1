# Spec 003 — Persistencia provisoria y conocimiento de Vector Uno

## Contexto y objetivo

Mientras Vector Austral no disponga del VPS y de la integración con n8n, las consultas de potenciales clientes se guardarán en Firestore y Vector Uno responderá preguntas básicas con información que el equipo pueda mantener en Google Sheets. Esta etapa es provisoria y no debe registrar conversaciones ni confirmar consultas que no hayan podido guardarse.

## Usuarios / actores

- Visitantes que envían una consulta desde la web.
- Visitantes que conversan con Vector Uno.
- La persona propietaria de los datos, que administra las consultas y el contenido autorizado.

## Historias de usuario

- H1: Como visitante, quiero que mi consulta quede registrada para que Vector Austral pueda responderme.
- H2: Como visitante, quiero recibir respuestas básicas de Vector Uno basadas en información vigente y autorizada.
- H3: Como persona propietaria, quiero revisar consultas en Firestore y actualizar el contenido de Vector Uno en Google Sheets durante la etapa provisoria.

## Requisitos funcionales (criterios de aceptación en EARS)

- RF-1: CUANDO se envíe un formulario de contacto válido, EL SISTEMA registrará los datos de contacto, el motivo y la fecha de recepción en el destino provisorio.
- RF-2: CUANDO una consulta use un email o teléfono ya registrado, EL SISTEMA actualizará el registro existente y agregará el nuevo motivo al historial, sin crear otro registro, conforme a la Spec 002.
- RF-3: SI el email y el teléfono de una consulta corresponden a registros diferentes, ENTONCES EL SISTEMA no combinará esos registros ni expondrá sus datos, conforme a la Spec 002.
- RF-4: CUANDO el destino provisorio confirme que guardó una consulta válida, EL SISTEMA mostrará la confirmación de recepción existente.
- RF-5: SI el destino provisorio no confirma el guardado, ENTONCES EL SISTEMA no mostrará una confirmación de recepción y ofrecerá reintentar o contactar por email o WhatsApp.
- RF-6: EL SISTEMA limitará el acceso directo a los leads en Firestore al servidor mediante Firebase Admin SDK y reglas que denieguen el acceso directo desde clientes.
- RF-7: CUANDO un visitante abra Vector Uno, EL SISTEMA mostrará el saludo inicial existente antes de responder preguntas.
- RF-8: CUANDO el visitante haga una pregunta, EL SISTEMA responderá usando únicamente el contenido vigente autorizado sobre desarrollo web, automatización con n8n, diagnóstico inicial o proceso de trabajo.
- RF-9: CUANDO la persona propietaria actualice el contenido autorizado, EL SISTEMA utilizará ese contenido al responder la siguiente interacción del visitante, después del saludo inicial.
- RF-10: SI el visitante solicita precios o presupuestos, ENTONCES EL SISTEMA no proporcionará importes y lo derivará al formulario de contacto, conforme a la Spec 001.
- RF-11: SI el contenido autorizado no permite responder una pregunta, ENTONCES EL SISTEMA lo indicará explícitamente y ofrecerá el formulario de contacto y las vías alternativas existentes.
- RF-12: EL SISTEMA no guardará conversaciones fuera del navegador ni enviará mensajes anteriores como contexto de una respuesta posterior.
- RF-13: CUANDO el sitio aparezca en una pestaña del navegador, EL SISTEMA mostrará el isotipo de Vector Austral sobre un fondo blanco.

## Requisitos no funcionales

- Las credenciales de acceso al destino provisorio no estarán disponibles en el navegador ni en el repositorio.
- Los datos personales de leads se guardarán en Firestore; no se copiarán automáticamente los registros que ya existan en Google Sheets.
- Los mensajes de estado y error seguirán en español.
- La solución podrá retirarse al migrar la persistencia y las respuestas al VPS y a n8n, sin requerir que esta etapa temporal conserve memoria conversacional.

## Casos límite

- El formulario es válido, pero Firestore no está disponible: se informa el fallo y no se confirma recepción.
- El email y el teléfono coinciden con leads diferentes: no se combinan datos y se mantiene el comportamiento definido en la Spec 002.
- La hoja de conocimiento está vacía o no contiene una respuesta aplicable: Vector Uno usa su respuesta de fallback y ofrece contacto.
- La persona propietaria modifica una respuesta: el cambio se refleja en la próxima respuesta posterior al saludo, sin memoria de conversaciones anteriores.

## Fuera de alcance

- Migrar la solución a VPS o conectar n8n en esta etapa.
- Guardar o recuperar conversaciones de Vector Uno.
- Generar presupuestos, precios o respuestas fuera del contenido autorizado.
- Crear un panel administrativo para leads o para editar el conocimiento.
- Migrar los leads existentes en Google Sheets a Firestore.

## Criterios de finalización

- Las pruebas verifican creación y actualización de consultas, deduplicación, conflicto entre datos de contacto, confirmación solo después de guardar y errores de persistencia.
- Las pruebas verifican saludo, respuestas con contenido autorizado vigente, bloqueo de presupuestos, fallback y ausencia de memoria entre interacciones.
- La revisión manual confirma que la persona propietaria puede consultar los leads en Firestore y actualizar el conocimiento en Google Sheets sin publicar una nueva versión del sitio.
- Lint, formato, tests y build terminan correctamente.
- Las credenciales y los datos de leads no quedan expuestos al navegador ni al repositorio.

## Dudas abiertas

- Ninguna. Los leads existentes en Firestore se reutilizan; los registros históricos de Google Sheets quedan allí y no se migran.
