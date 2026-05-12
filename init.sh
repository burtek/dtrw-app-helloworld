#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

APP_NAME_INPUT="${1:-}"
if [[ -z "$APP_NAME_INPUT" ]]; then
  read -r -p "Enter the new app name: " APP_NAME_INPUT
fi

if [[ -z "$APP_NAME_INPUT" ]]; then
  echo "❌ App name is required. Exiting."
  exit 1
fi

read -r -p "Default database mode (none/sqlite) [none]: " DB_MODE_INPUT
DB_MODE_INPUT=${DB_MODE_INPUT,,}
if [[ -z "$DB_MODE_INPUT" ]]; then
  DB_MODE_INPUT="none"
fi

if [[ "$DB_MODE_INPUT" != "none" && "$DB_MODE_INPUT" != "sqlite" ]]; then
  echo "❌ Invalid database mode. Use 'none' or 'sqlite'."
  exit 1
fi

cat > .github/template.env <<EOT
APP_NAME=${APP_NAME_INPUT}
KUMA_APP=${APP_NAME_INPUT}
EOT

if grep -q '^APP_NAME=' docker/backend/env; then
  sed -i "s/^APP_NAME=.*/APP_NAME=${APP_NAME_INPUT}/" docker/backend/env
else
  echo "APP_NAME=${APP_NAME_INPUT}" >> docker/backend/env
fi

if grep -q '^DB_MODE=' docker/backend/env; then
  sed -i "s/^DB_MODE=.*/DB_MODE=${DB_MODE_INPUT}/" docker/backend/env
else
  echo "DB_MODE=${DB_MODE_INPUT}" >> docker/backend/env
fi

if ! grep -q '^DB_FILE_NAME=' docker/backend/env; then
  echo 'DB_FILE_NAME=./packages/backend/development/db.db' >> docker/backend/env
fi

mkdir -p packages/backend/development

sed -i "s/\"name\": \"dtrw-app-[^\"]*\"/\"name\": \"dtrw-app-${APP_NAME_INPUT}\"/" package.json
sed -i "s|\"repository\": \"git@github.com:[^\"]*\"|\"repository\": \"git@github.com:<owner>/dtrw-app-${APP_NAME_INPUT}.git\"|" package.json

cat <<EOFMSG

✅ Initialized template configuration.

- APP_NAME: ${APP_NAME_INPUT}
- Default DB_MODE: ${DB_MODE_INPUT}

Next steps:
1) Update package.json repository owner and any deployment secrets.
2) Review .github/template.env and docker/backend/env.
3) Run yarn install, yarn test, and yarn build.

EOFMSG
