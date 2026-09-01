# Should be run from the workspace rot using
# docker build -f packages/frontend/Dockerfile . 

FROM node:26.8.1-slim AS build

WORKDIR /app

RUN npm i -g corepack
RUN corepack enable

COPY scripts/ ./scripts/
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/frontend/package.json ./packages/frontend/package.json

RUN corepack install
RUN pnpm install --frozen-lockfile

COPY packages/frontend/ ./packages/frontend/

RUN pnpm run validate

WORKDIR /app/packages/frontend

ARG COMMIT_SHA=dev
ENV VITE_COMMIT=$COMMIT_SHA

RUN pnpm build

FROM nginx:1.31.4-alpine AS runtime

# envsubst trick to escape nginx variables
ENV DOLLAR='$'

EXPOSE 80

COPY packages/frontend/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/packages/frontend/dist/ /usr/share/nginx/html/
