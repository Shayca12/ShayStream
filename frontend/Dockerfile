# ─────────────────────────────────────────────────────────────
#  frontend (Next.js) — Dockerfile (multi-stage, standalone output)
# ─────────────────────────────────────────────────────────────

# ═══ שלב 1: בנייה ═══
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# משתני NEXT_PUBLIC_ נצרבים לתוך ה-JS בזמן ה-build — לכן מקבלים אותם כ-build args.
ARG NEXT_PUBLIC_AUTH_URL
ARG NEXT_PUBLIC_MEDIA_URL
ARG NEXT_PUBLIC_STREAM_URL
ENV NEXT_PUBLIC_AUTH_URL=$NEXT_PUBLIC_AUTH_URL
ENV NEXT_PUBLIC_MEDIA_URL=$NEXT_PUBLIC_MEDIA_URL
ENV NEXT_PUBLIC_STREAM_URL=$NEXT_PUBLIC_STREAM_URL
RUN npm run build

# ═══ שלב 2: ריצה ═══
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0


# החבילה העצמאית של Next (server.js + node_modules מינימלי) + הנכסים הסטטיים.
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
