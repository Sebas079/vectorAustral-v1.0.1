# Spec MVP — Landing Vector Austral (Lead Generation)

## Contexto (POR QUÉ)

Vector Austral comercializa soluciones web, apps Android y automatizaciones con n8n. La landing es la cara visible y debe: (1) parecer automatizada, (2) generar leads calificados para problemas puntuales, (3) filtrar con bot 24/7 sin presupuestar.

## Requisitos Funcionales (EARS)

- **RF-1:** CUANDO un visitante entra a la landing, EL SISTEMA mostrará hero + servicios (web/app/n8n) + prueba de automatización visible + contacto, en español y mobile-first oscuro (azul profundo/cian).
- **RF-2:** CUANDO un visitante consulta al bot, EL SISTEMA responderá 24/7 solo con base de servicios precargada (servicios, alcances, tiempos orientativos, proceso de trabajo).
- **RF-3:** EL SISTEMA NUNCA dará presupuestos automáticos; SI detecta pedido de precio/caso real, derivará a formulario con mensaje "un especialista te cotiza según requerimientos".
- **RF-4:** CUANDO el visitante completa el formulario, EL SISTEMA exigirá nombre + teléfono + email + motivo/requerimiento, validará formato email/teléfono y campos no vacíos.
- **RF-5:** CUANDO el formulario es válido, EL SISTEMA registrará el lead (destino a definir: n8n/email) y mostrará confirmación de recepción.
- **RF-6:** SI el envío falla, EL SISTEMA mostrará "Tuvimos un problema, volvé a intentar más tarde" + botones alternativos mail/WhatsApp; SI el visitante es cliente identificado, mensaje "tenemos un problema y en breve nos comunicaremos" + mismas vías.
- **RF-7:** SI el bot no sabe responder o se cae, EL SISTEMA lo dirá explícitamente y ofrecerá formulario + mail/WhatsApp, sin inventar servicios ni precios.

## Fuera de alcance

Dashboard clientes, auth Google, pagos, panel métricas, presupuestos automáticos, animaciones pesadas, librerías UI pesadas.

## Criterios de finalización

1. Landing comunica automatización a simple vista y convierte a formulario.
2. Bot filtra sin presupuestar; todo pedido real termina en lead.
3. Formulario valida 4 campos y tiene fallback visible ante error.
4. Lint + prettier + tests en verde; sin secretos hardcodeados.
