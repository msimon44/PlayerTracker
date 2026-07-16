# Multi-stage build for production, basé sur le pattern officiel Turborepo
# (https://turborepo.com/docs/guides/tools/docker) pour un monorepo pnpm + Next.js.
FROM node:20-alpine AS base

# ---------------------------------------------------------------------------
# 1. Builder : élague le monorepo pour ne garder que ce dont landing a besoin
# ---------------------------------------------------------------------------
FROM base AS builder
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune @playertracker/landing --docker

# ---------------------------------------------------------------------------
# 2. Installer : installe les dépendances élaguées puis build
# ---------------------------------------------------------------------------
FROM base AS installer
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g pnpm

COPY --from=builder /app/out/json/ .
RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .

ARG NEXT_PUBLIC_API_URL=http://localhost:3001
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN pnpm turbo build --filter=@playertracker/landing

# ---------------------------------------------------------------------------
# 3. Runner : image de production minimale (sortie Next.js "standalone")
# ---------------------------------------------------------------------------
FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=installer --chown=nextjs:nodejs /app/apps/landing/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/landing/.next/static ./apps/landing/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/landing/public ./apps/landing/public

USER nextjs

ENV NODE_ENV=production
ENV PORT=3002
ENV HOSTNAME="0.0.0.0"
EXPOSE 3002

CMD ["node", "apps/landing/server.js"]
