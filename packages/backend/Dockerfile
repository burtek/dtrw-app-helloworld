# Should be run from the workspace rot using
# docker build -f packages/backend/Dockerfile . 

FROM node:26-alpine AS build

WORKDIR /app

RUN apk add --no-cache python3 py3-pip build-base
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/backend/package.json ./packages/backend/package.json

RUN pnpm install --frozen-lockfile

COPY packages/backend/ ./packages/backend/

RUN pnpm run validate

WORKDIR /app/packages/backend

RUN pnpm build
RUN pnpm assemble

FROM node:26-alpine AS runtime

ARG COMMIT_SHA

ENV COMMIT_SHA=$COMMIT_SHA
ENV NODE_ENV=production

WORKDIR /app

COPY --from=build /app/packages/backend/.assembled/ ./

CMD node --enable-source-maps dist/index.mjs
