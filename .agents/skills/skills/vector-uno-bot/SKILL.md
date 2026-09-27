# Skill: vector-uno-bot

## Cuándo usar

Motor y widget del asistente Vector Uno 24/7: responde servicios, deriva presupuestos a formulario.

## Reglas duras

- NUNCA presupuesta ni da precios numéricos. Ante "precio/presupuesto/cuánto/cotiza" deriva a `#contacto` con "un especialista te cotiza según requerimientos" (Spec RF-3).
- Solo responde desde `knowledgeBase` (web, Android, n8n, alcances, proceso). Si no sabe, fallback + mail/WhatsApp sin inventar (RF-2, RF-7).
- Tests unitarios obligatorios antes de cerrar (Const #7).
- Archivos permitidos: `lib/bot/knowledgeBase.ts`, `lib/bot/botEngine.ts`, `components/ChatWidget.tsx`, `tests/botEngine.test.ts`, `tests/ChatWidget.test.tsx`.

## Hecho cuando

- [ ] `npx vitest run tests/botEngine.test.ts tests/ChatWidget.test.tsx` verde
- [ ] Ninguna respuesta contiene precio (verificado en tests)
