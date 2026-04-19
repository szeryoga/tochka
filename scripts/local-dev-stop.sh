#!/usr/bin/env zsh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

COMPOSE_FILES=(-f docker-compose.yml -f docker-compose.local.yml)

docker compose "${COMPOSE_FILES[@]}" stop postgres backend frontend admin-panel

cat <<'EOF'

Local services stopped:
  postgres
  backend
  frontend
  admin-panel
EOF
