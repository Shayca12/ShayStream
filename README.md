# 🎬 ShayStream

ענן מדיה אישי בסגנון Netflix/Disney+ — להעלות, לצפות ולשתף סרטונים (ובהמשך מוזיקה)
עם חברים. נבנה כמערכת **מיקרו-סרוויסים** אמיתית, ומשמש כפרויקט **DevOps** אישי מקצה לקצה.

> סטטוס: 🚧 שלב 0 — יסודות (בהקמה).

---

## הסטאק (Tech Stack)

| שכבה | טכנולוגיה |
|---|---|
| Frontend | Next.js 14 + TypeScript + Tailwind + shadcn/ui + Framer Motion (עיצוב Cinematic כהה) |
| Backend (מיקרו-סרוויסים) | NestJS (TypeScript) |
| Database (מטא-דאטה) | PostgreSQL + Prisma ORM |
| אחסון מדיה | MinIO (S3-compatible) |
| Gateway / Proxy | Traefik |
| Containerization | Docker + Docker Compose |
| CI/CD | Jenkins (self-hosted) |
| Orchestration | Kubernetes (k3d / k3s) + Helm |
| IaC | Terraform + Ansible |
| GitOps | ArgoCD |
| Monitoring | Prometheus + Grafana + Alertmanager |

## שירותי הליבה (MVP)

- **auth-service** — הרשמה, התחברות, JWT.
- **media-service** — העלאת וידאו (→ MinIO) + מטא-דאטה (→ Postgres).
- **stream-service** — הזרמת וידאו עם HTTP Range requests (206 Partial Content).

## מבנה התיקיות (ייבנה בהדרגה)

```
ShayStream/
├─ services/        # שירותי ה-NestJS (auth / media / stream)
├─ frontend/        # אפליקציית Next.js
├─ gateway/         # קונפיג Traefik
├─ ci/              # Jenkinsfile
├─ monitoring/      # Prometheus / Grafana
├─ deploy/          # helm / k3d / terraform / argocd
└─ docker-compose.yml
```

## איך מריצים (יתעדכן בסוף שלב 1)

```bash
cp .env.example .env      # למלא ערכים
docker compose up --build
```

---

נבנה צעד-צעד. מפת הדרכים המלאה נמצאת בקובץ התוכנית של הפרויקט.
