# Spec 002 — Protección y reconocimiento de leads

## Contexto y objetivo

El formulario de contacto debe impedir envíos automatizados, proteger los datos de leads existentes y reconocer a visitantes recurrentes. La verificación actual puede ser simulada desde el navegador y el formulario no precarga la información guardada, por lo que no cumple los criterios de seguridad y continuidad definidos para la captación de leads.

## Usuarios / actores

- Visitantes que solicitan un diagnóstico inicial.
- Visitantes que ya enviaron una consulta anteriormente.
- Especialistas de Vector Austral que reciben y gestionan leads.

## Historias de usuario

- H1: Como visitante, quiero verificar que soy una persona antes de enviar una consulta para evitar que solicitudes automatizadas lleguen al equipo.
- H2: Como visitante recurrente, quiero solicitar que se busquen mis datos guardados después de verificarme para continuar con una nueva consulta.

## Requisitos funcionales (criterios de aceptación en EARS)

- RF-1: CUANDO el visitante solicite reconocer una consulta anterior después de completar la verificación humana e ingresar un email y un teléfono, EL SISTEMA buscará un lead que coincida con ambos datos.
- RF-2: CUANDO exista exactamente un lead coincidente, EL SISTEMA completará el nombre del formulario con el nombre guardado y permitirá editarlo.
- RF-3: SI el email y el teléfono coinciden con leads diferentes, ENTONCES EL SISTEMA no combinará ni expondrá los datos de esos registros e indicará que se contacte con un especialista.
- RF-4: CUANDO se solicite guardar una consulta, EL SISTEMA verificará la validez de la verificación humana antes de modificar los datos de leads.
- RF-5: SI la verificación humana no se completa, se rechaza, vence o no está disponible, ENTONCES EL SISTEMA no guardará la consulta e informará que se reintente o se contacte por email o WhatsApp.
- RF-6: SI no transcurrieron 10 segundos desde el envío anterior desde la misma dirección IP, ENTONCES EL SISTEMA rechazará el nuevo envío y mostrará cuánto esperar antes de reintentar.
- RF-7: CUANDO una consulta válida corresponda a un lead existente por email o teléfono, EL SISTEMA actualizará sus datos de contacto y agregará el motivo al historial sin crear otro lead.
- RF-8: CUANDO una consulta válida no corresponda a un lead existente, EL SISTEMA creará un lead con el historial inicial y mostrará una confirmación de recepción.
- RF-9: SI ocurre un error al guardar la consulta, ENTONCES EL SISTEMA informará que hubo un problema, permitirá reintentar y ofrecerá contacto por email o WhatsApp.
- RF-10: CUANDO se envíe una consulta a la API de contacto heredada, EL SISTEMA validará un esquema cerrado, verificará Turnstile y aplicará el límite de 10 segundos por IP antes de reenviarla.
- RF-11: CUANDO se envíe un mensaje a la API heredada de Vector Uno, EL SISTEMA validará el payload con un esquema cerrado antes de procesarlo.
- RF-12: CUANDO una API heredada reenvíe datos a un webhook, EL SISTEMA abortará la solicitud tras 8 segundos y no registrará datos personales del payload en logs.
- RF-13: SI el webhook requerido por una API heredada no está configurado o falla, ENTONCES EL SISTEMA responderá con un error explícito y no informará éxito.

## Requisitos no funcionales

- Las credenciales privadas y los secretos de verificación no estarán expuestos al navegador.
- La interfaz seguirá siendo usable con teclado y tecnologías de asistencia.
- Los mensajes de validación y error estarán en español.

## Casos límite

- Un visitante completa la verificación antes de escribir el email y teléfono; la búsqueda ocurre cuando ambos datos estén disponibles.
- Un dato de contacto coincide con un lead, pero el otro no; el sistema no revela el nombre ni el contacto no ingresado.
- La verificación vence mientras el visitante completa el formulario; el envío se bloquea y se solicita una nueva verificación.
- El email coincide con un lead y el teléfono con otro; no se revelan ni combinan los datos.
- El visitante vuelve a enviar antes de transcurridos 10 segundos desde la misma dirección IP; la consulta no se guarda.
- El servicio de verificación o el almacenamiento no están disponibles; no se informa un envío exitoso y se mantienen visibles las alternativas de contacto.
- Una llamada directa a una API heredada no debe omitir la validación de su payload ni la verificación humana exigida para contacto.
- Un webhook heredado falla o no está configurado; la API informa el fallo sin exponer el payload.

## Fuera de alcance

- Autenticación de visitantes o creación de cuentas.
- Edición o eliminación de leads desde un panel administrativo.
- Cambios al contenido comercial o al flujo de conversación del asistente.
- Analítica, seguimiento publicitario o almacenamiento de datos de verificación humana.

## Criterios de finalización

- RF-1 a RF-9 cuentan con pruebas automatizadas para sus resultados y casos de rechazo.
- La prueba manual confirma que la verificación precede a la búsqueda y al guardado, y que los datos de un lead recurrente se pueden editar.
- Lint, formato, tests y build terminan correctamente.
- La configuración de producción no expone credenciales privadas ni secretos al cliente.

## Dudas abiertas

- Ninguna.
