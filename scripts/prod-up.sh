#!/usr/bin/env zsh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

if [[ -f .env ]]; then
  set -a
  source .env
  set +a
fi

GATEWAY_NETWORK_NAME="${GATEWAY_NETWORK:-gateway-net}"

if ! docker network inspect "$GATEWAY_NETWORK_NAME" >/dev/null 2>&1; then
  echo "Creating external gateway network: $GATEWAY_NETWORK_NAME"
  docker network create "$GATEWAY_NETWORK_NAME" >/dev/null
fi

docker compose up -d --build postgres backend frontend admin-panel

cat <<EOF

Production services started:
  backend:    tochka-backend:8000
  frontend:   tochka-frontend:80
  admin:      tochka-admin:80
  postgres:   internal only

Gateway network:
  ${GATEWAY_NETWORK_NAME}

Gateway upstream names:
  http://tochka-frontend:80
  http://tochka-admin:80
  http://tochka-backend:8000
EOF
