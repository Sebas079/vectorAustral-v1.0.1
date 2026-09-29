# Skill: landing-tech-ui

## Cuándo usar

Maquetado de la landing Vector Austral (Hero, showroom, demo video, page) en Next.js App Router + Tailwind.

## Reglas duras

- Solo tokens propios: navy `#0A1128`, cyan `#00E5FF`, dark `#0D131F`, graphite `#1E293B`. Prohibidas librerías UI pesadas (Const #6, #10).
- Mobile-first, modo oscuro, textos UI en español (Const #5, #6).
- Componentes `PascalCase.tsx`; rutas `kebab-case` (Const #5).
- Spec: RF-1. Archivos permitidos: `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, `components/Hero.tsx`, `components/ServicesShowroom.tsx`, `components/DemoVideo.tsx`.

## Hecho cuando

- [ ] `npm run build` verde
- [ ] `npm run lint` verde, cero warnings
- [ ] CTA a `#contacto` verificable con grep
