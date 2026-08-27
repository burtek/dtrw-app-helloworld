# Should be run from the workspace rot using
# docker build -f docker/<package_name>/Dockerfile . 

FROM node:26-slim AS build

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/frontend/package.json ./packages/frontend/package.json

RUN pnpm install --frozen-lockfile

COPY packages/frontend/ ./packages/frontend/

RUN pnpm run validate

WORKDIR /app/packages/frontend

ARG COMMIT_SHA
ENV VITE_COMMIT=$COMMIT_SHA

RUN pnpm build

FROM nginx:alpine AS runtime

EXPOSE 80

COPY docker/frontend/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/packages/frontend/dist/ /usr/share/nginx/html/
