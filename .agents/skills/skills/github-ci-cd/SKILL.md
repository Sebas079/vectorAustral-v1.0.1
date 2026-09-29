# Skill: github-ci-cd

## Cuándo usar

Control de versiones y pipeline CI/CD a producción en GitHub.

## Reglas duras

- `.gitignore` bloquea `.env*.local`, `node_modules`, `.next` (Const #9).
- Workflow `.github/workflows/ci.yml` en push/PR a `main`: `npm ci` -> `lint` -> `prettier --check` -> `test` -> `build` (Spec RF-8).
- Sin credenciales expuestas; deploy solo con pipeline verde.

## Hecho cuando

- [ ] `.github/workflows/ci.yml` existe con los 5 pasos
- [ ] `git status` limpio salvo archivos intencionales
