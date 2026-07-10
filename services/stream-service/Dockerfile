# ─────────────────────────────────────────────────────────────
#  stream-service — Dockerfile (multi-stage, ללא Prisma/DB)
# ─────────────────────────────────────────────────────────────

# ═══ שלב 1: בנייה ═══
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ═══ שלב 2: ריצה ═══
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
EXPOSE 3005
CMD ["node", "dist/main"]
