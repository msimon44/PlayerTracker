# Multi-stage build for production, basé sur le pattern officiel Turborepo
# (https://turborepo.com/docs/guides/tools/docker) pour un monorepo pnpm.
FROM node:20-alpine AS base

# ---------------------------------------------------------------------------
# 1. Builder : élague le monorepo pour ne garder que ce dont l'API a besoin
# ---------------------------------------------------------------------------
FROM base AS builder
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune @playertracker/api --docker

# ---------------------------------------------------------------------------
# 2. Installer : installe les dépendances élaguées puis build l'API
# ---------------------------------------------------------------------------
FROM base AS installer
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g pnpm

# Dépendances (couche mise en cache tant que le lockfile élagué ne change pas)
COPY --from=builder /app/out/json/ .
RUN pnpm install --frozen-lockfile

# Code source complet des packages nécessaires + de l'API
COPY --from=builder /app/out/full/ .

RUN cd apps/api && npx prisma generate
RUN pnpm turbo build --filter=@playertracker/api

# ---------------------------------------------------------------------------
# 3. Runner : image de production minimale
# ---------------------------------------------------------------------------
FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=installer /app .

USER nestjs

WORKDIR /app/apps/api

ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001

CMD ["node", "dist/src/main"]
