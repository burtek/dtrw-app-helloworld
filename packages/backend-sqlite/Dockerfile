# Should be run from the workspace rot using
# docker build -f packages/backend-sqlite/Dockerfile . 

FROM node:26.8.1-alpine AS build

WORKDIR /app

RUN apk add --no-cache python3 py3-pip build-base
RUN npm i -g corepack
RUN corepack enable

COPY scripts/ ./scripts/
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/backend-sqlite/package.json ./packages/backend-sqlite/package.json

RUN corepack install
RUN pnpm install --frozen-lockfile

COPY packages/backend-sqlite/ ./packages/backend-sqlite/

RUN pnpm run validate

WORKDIR /app/packages/backend-sqlite

RUN pnpm build
RUN pnpm assemble

FROM node:26.8.1-alpine AS runtime

ARG COMMIT_SHA=dev

ENV COMMIT_SHA=$COMMIT_SHA
ENV NODE_ENV=production
ENV DB_MIGRATIONS_FOLDER=/app/drizzle

WORKDIR /app

COPY --from=build /app/packages/backend-sqlite/.assembled/ ./

CMD node --enable-source-maps dist/index.mjs
