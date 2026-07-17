# Multi-stage build for production, basé sur le pattern officiel Turborepo
# (https://turborepo.com/docs/guides/tools/docker) pour un monorepo pnpm + Next.js.
FROM node:26-alpine AS base

# ---------------------------------------------------------------------------
# 1. Builder : élague le monorepo pour ne garder que ce dont le web a besoin
# ---------------------------------------------------------------------------
FROM base AS builder
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune @playertracker/web --docker

# ---------------------------------------------------------------------------
# 2. Installer : installe les dépendances élaguées, génère le client API
#    (Orval, à partir du contrat OpenAPI versionné dans specs/), puis build
# ---------------------------------------------------------------------------
FROM base AS installer
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g pnpm

# Dépendances (couche mise en cache tant que le lockfile élagué ne change pas)
COPY --from=builder /app/out/json/ .
RUN pnpm install --frozen-lockfile

# Code source complet des packages nécessaires + du web
COPY --from=builder /app/out/full/ .
# Le contrat OpenAPI n'est pas un package du workspace : on le récupère
# explicitement depuis le checkout complet conservé côté builder.
COPY --from=builder /app/specs ./specs

ARG NEXT_PUBLIC_API_URL=http://localhost:3001
ARG NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_FRONTEND_URL=$NEXT_PUBLIC_FRONTEND_URL

RUN pnpm --filter @playertracker/web generate:client
RUN pnpm turbo build --filter=@playertracker/web

# ---------------------------------------------------------------------------
# 3. Runner : image de production minimale (sortie Next.js "standalone")
# ---------------------------------------------------------------------------
FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=installer /app/apps/web/next.config.js ./apps/web/next.config.js
COPY --from=installer /app/apps/web/package.json ./apps/web/package.json
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

USER nextjs

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
EXPOSE 3000

CMD ["node", "apps/web/server.js"]
