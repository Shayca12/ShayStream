# ─────────────────────────────────────────────────────────────
#  media-service — Dockerfile (multi-stage build)
# ─────────────────────────────────────────────────────────────

# ═══ שלב 1: בנייה ═══
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
RUN npm run build

# ═══ שלב 2: ריצה ═══
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
EXPOSE 3002
# קודם מיישמים מיגרציות (על shaystream_media), ואז מפעילים את השרת.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
