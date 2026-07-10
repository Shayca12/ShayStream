# ─────────────────────────────────────────────────────────────
#  auth-service — Dockerfile (multi-stage build)
# ─────────────────────────────────────────────────────────────

# ═══ שלב 1: בנייה (builder) ═══
# מתחילים מדימוי רשמי של Node 20 בגרסת alpine (לינוקס קטן ורזה).
FROM node:20-alpine AS builder

# תיקיית העבודה בתוך הקונטיינר. כל פקודה מכאן רצה יחסית ל-/app.
WORKDIR /app

# מעתיקים קודם רק את קבצי החבילות. טריק לביצועים:
# כל עוד הם לא משתנים, Docker ישתמש ב-cache ולא יתקין הכל מחדש.
COPY package*.json ./

# npm ci = התקנה נקייה ומדויקת לפי package-lock.json (מהיר ודטרמיניסטי).
RUN npm ci

# מעתיקים את סכימת Prisma ומייצרים את ה-Client *בתוך* alpine.
# חשוב: כך נוצר המנוע המתאים ללינוקס (ולא ל-Windows של המחשב שלך).
COPY prisma ./prisma
RUN npx prisma generate

# מעתיקים את שאר הקוד ומקמפלים TypeScript → JavaScript (לתיקיית dist/).
COPY . .
RUN npm run build

# ═══ שלב 2: ריצה (runtime) ═══
# דימוי חדש ונקי — בלי כלי הבנייה. זה מה שירוץ בפועל.
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# מעתיקים מהשלב הקודם רק את מה שצריך כדי לרוץ:
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# מתעדים שהשירות מאזין על 3001 (תיעוד; הפרסום בפועל ב-docker-compose).
EXPOSE 3001

# פקודת ההרצה: קודם מיישמים מיגרציות ל-DB, ואז מפעילים את השרת.
# migrate deploy = מריץ מיגרציות קיימות (בלי ליצור חדשות) — בטוח לפרודקשן.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
