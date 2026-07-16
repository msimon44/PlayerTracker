# Multi-stage build for production
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files from monorepo root
COPY package.json pnpm-lock.yaml* ./
COPY apps/api/package.json ./apps/api/
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/
COPY packages/config/package.json ./packages/config/
COPY packages/ui/package.json ./packages/ui/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules

# Copy root package.json and workspace configuration files
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY turbo.json ./
COPY tsconfig.json ./

# Copy shared packages first
COPY packages ./packages

# Copy API source
COPY apps/api ./apps/api

# Install pnpm
RUN npm install -g pnpm

# Build packages using turbo from root
RUN pnpm build:packages

# Generate Prisma client
WORKDIR /app/apps/api
RUN npx prisma generate

# Build the API
RUN pnpm build

# Production image, copy all the files and run the app
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy built application
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/prisma ./prisma
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

USER nestjs

EXPOSE 3001

ENV PORT 3001

CMD ["node", "dist/main"]