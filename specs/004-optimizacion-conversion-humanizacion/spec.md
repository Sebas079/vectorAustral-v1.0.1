# Spec 004 — Optimización de conversión y humanización

## Contexto y objetivo

La landing de Vector Austral debe explicar con claridad qué problemas de negocio resuelve y facilitar el contacto directo de potenciales clientes de la región. Esta iteración reemplaza el copy abstracto por beneficios y ejemplos concretos, presenta a Sebastián López Lorenzo y reduce la fricción del formulario sin quitar las protecciones existentes para el envío de leads.

## Usuarios / actores

- Personas responsables de pymes y equipos que buscan mejorar sus procesos o ventas.
- Potenciales clientes que consultan por desarrollo web, e-commerce o automatizaciones.
- Sebastián López Lorenzo, Tech Lead y responsable de automatizaciones.

## Historias de usuario

- H1: Como potencial cliente, quiero entender qué problema puede resolver Vector Austral para decidir si iniciar una conversación.
- H2: Como visitante interesado, quiero contactar por WhatsApp o dejar una consulta con pocos datos para recibir seguimiento.
- H3: Como responsable de Vector Austral, quiero presentar experiencia y ejemplos concretos para generar confianza sin hacer promesas no verificadas.

## Requisitos funcionales (criterios de aceptación en EARS)

- RF-1: CUANDO una persona visite la landing, EL SISTEMA explicará cómo Vector Austral puede reducir tareas manuales, aumentar ventas con sitios web optimizados y automatizar la atención y gestión de clientes.
- RF-2: CUANDO una persona lea el contenido comercial de la landing, EL SISTEMA evitará clichés y jerga abstracta, incluyendo “sinergia”, “arquitecturas exponenciales” y “transformación holística”.
- RF-3: CUANDO una persona visite la sección “Detrás de Vector Austral”, EL SISTEMA identificará a Sebastián López Lorenzo como Tech Lead y responsable de automatizaciones.
- RF-4: CUANDO una persona lea el perfil de Sebastián López Lorenzo, EL SISTEMA destacará su experiencia práctica en desarrollo web, integraciones y lógica de procesos.
- RF-5: CUANDO una persona visite los casos de uso, EL SISTEMA mostrará una solución de automatización que conecte WhatsApp, Google Sheets y un CRM.
- RF-6: CUANDO una persona visite los casos de uso, EL SISTEMA mostrará una solución de e-commerce enfocada en velocidad y SEO local.
- RF-7: CUANDO una persona vea el hero de la landing, EL SISTEMA ofrecerá “Hablar por WhatsApp” como acción principal.
- RF-8: CUANDO una persona active la acción principal de WhatsApp, EL SISTEMA abrirá una conversación con el número configurado para Vector Austral.
- RF-9: MIENTRAS el visitante recorra la landing, EL SISTEMA mantendrá disponible una acción flotante para iniciar contacto por WhatsApp.
- RF-10: SI no hay un número de WhatsApp configurado, ENTONCES EL SISTEMA no mostrará un enlace de WhatsApp inválido y mantendrá disponible el contacto por email.
- RF-11: CUANDO una persona complete el formulario de contacto, EL SISTEMA solicitará como máximo tres datos: nombre, un dato de contacto y necesidad principal.
- RF-12: CUANDO una persona ingrese el dato de contacto, EL SISTEMA aceptará un email o un número de WhatsApp y validará el formato correspondiente.
- RF-13: SI el nombre, el dato de contacto o la necesidad principal están vacíos o tienen formato inválido, ENTONCES EL SISTEMA indicará el error en español y no enviará la consulta.
- RF-14: CUANDO una persona solicite enviar una consulta válida, EL SISTEMA exigirá completar la verificación humana antes de guardar el lead.
- RF-15: CUANDO una consulta válida incluya un dato de contacto ya registrado, EL SISTEMA actualizará ese lead y agregará la nueva necesidad a su historial sin exponer datos guardados al visitante.
- RF-16: CUANDO una consulta válida incluya un dato de contacto no registrado, EL SISTEMA creará un lead y mostrará confirmación solo después de confirmar el guardado.
- RF-17: SI el envío no puede guardarse, ENTONCES EL SISTEMA informará el problema y ofrecerá reintentar o contactar por email y WhatsApp.
- RF-18: SI la verificación humana falla o no está disponible, ENTONCES EL SISTEMA no guardará la consulta, informará el problema y ofrecerá reintentar o usar las vías alternativas de contacto.
- RF-19: SI una consulta supera el límite de frecuencia vigente, ENTONCES EL SISTEMA rechazará el envío e indicará cuánto esperar antes de reintentar.

## Requisitos no funcionales

- La landing y el formulario seguirán siendo mobile-first y conservarán la paleta oscura azul, cian y graphite de Vector Austral.
- Los controles de contacto serán utilizables con teclado y tendrán foco visible.
- Los mensajes de validación, confirmación y error estarán en español rioplatense claro.
- Los datos de contacto y las credenciales de servicios no se expondrán en el navegador ni se incorporarán como secretos al código.
- La actualización no incorporará dependencias de interfaz pesadas.

## Casos límite

- El visitante ingresa un email con formato inválido o un teléfono que no puede validarse; el formulario identifica el dato y bloquea el envío.
- El visitante completa el formulario, pero no la verificación humana; el lead no se guarda.
- El visitante ya tiene un lead; el sistema agrega la nueva necesidad sin mostrarle información personal almacenada.
- El número de WhatsApp no está configurado; no se genera un enlace `wa.me` incompleto.
- El guardado falla o el límite de frecuencia impide el envío; no se muestra confirmación de recepción.

## Fuera de alcance

- Cambios al comportamiento conversacional o a la base de conocimiento de Vector Uno.
- Agenda en Calendly, ya que el brief no proporciona un enlace de agenda.
- Cambios al dashboard, autenticación, permisos o paneles de administración.
- Presupuestos automáticos, precios o promesas de resultados cuantificados.
- Migración de datos históricos de leads.

## Criterios de finalización

- RF-1 a RF-10 se verifican en el contenido y las acciones de la landing en viewport móvil y escritorio.
- RF-11 a RF-19 cuentan con pruebas automatizadas para validación, verificación humana, actualización/creación de leads, límites y fallos.
- La revisión manual confirma que el hero y la acción flotante permiten iniciar contacto por WhatsApp cuando el número está configurado.
- Lint, formato, tests y build terminan correctamente.
- No se agregan dependencias no autorizadas ni secretos al repositorio.

## Dudas abiertas

- Ninguna.
