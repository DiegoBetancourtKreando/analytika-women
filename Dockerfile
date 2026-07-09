# Railway deployment starts from the apps/api directory
# This symlinks the root and builds the monorepo

FROM node:22-alpine AS base
RUN npm i -g turbo

FROM base AS builder
WORKDIR /app

# Copy root workspace config
COPY package.json package-lock.json turbo.json ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/types/package.json packages/types/
COPY packages/utils/package.json packages/utils/
COPY packages/config/package.json packages/config/
COPY packages/ui/package.json packages/ui/
COPY packages/tsconfig/package.json packages/tsconfig/
COPY packages/eslint-config/package.json packages/eslint-config/

# Install dependencies
RUN npm ci

# Copy source code
COPY apps/api apps/api
COPY apps/web apps/web
COPY packages packages

# Build shared packages
RUN npm run build --workspace=packages/types --workspace=packages/utils --workspace=packages/config --workspace=packages/ui 2>/dev/null || true

# Build web (frontend)
RUN npm run build --workspace=apps/web

# Build api (backend)
RUN npm run build --workspace=apps/api

FROM node:22-alpine AS runner
WORKDIR /app

# Install only production deps
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
RUN npm ci --omit=dev --workspace=apps/api 2>/dev/null || npm ci --omit=dev

# Copy built artifacts
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/apps/api/.env ./apps/api/ 2>/dev/null || true
COPY --from=builder /app/apps/web/dist ./apps/web/dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

WORKDIR /app/apps/api

# Generate Prisma client (needs schema)
RUN npx prisma generate

EXPOSE 4000

# Run migrations, seed, then start
CMD npx prisma migrate deploy && \
    npx prisma db seed 2>/dev/null || true && \
    node dist/main
