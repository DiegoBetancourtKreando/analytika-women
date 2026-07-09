FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/types/package.json packages/types/
COPY packages/utils/package.json packages/utils/
COPY packages/config/package.json packages/config/
COPY packages/ui/package.json packages/ui/
COPY packages/tsconfig/package.json packages/tsconfig/
COPY packages/eslint-config/package.json packages/eslint-config/

RUN npm install 2>&1

COPY packages/ packages/
COPY apps/api/ apps/api/
COPY apps/web/ apps/web/

ENV NODE_ENV=production

RUN npm run build --workspace=packages/types 2>&1
RUN npm run build --workspace=packages/utils 2>&1
RUN npm run build --workspace=packages/config 2>&1
RUN npm run build --workspace=packages/ui 2>&1

RUN cd apps/web && npx vite build 2>&1

RUN cd apps/api && npx prisma generate 2>&1 && npx nest build 2>&1

FROM node:22-alpine AS runner
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/apps/web/dist ./apps/web/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/package.json ./

WORKDIR /app/apps/api

RUN npx prisma generate 2>&1

EXPOSE 4000

CMD node dist/main.js
