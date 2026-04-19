#!/usr/bin/env zsh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

COMPOSE_FILES=(-f docker-compose.yml -f docker-compose.local.yml)

echo "Stopping gateway services if they are running..."
docker compose "${COMPOSE_FILES[@]}" stop nginx certbot >/dev/null 2>&1 || true

echo "Building and starting local services..."
docker compose "${COMPOSE_FILES[@]}" up -d --build postgres backend frontend admin-panel

cat <<'EOF'

Local services are available at:
  Mini app:    http://127.0.0.1:3000/
  Admin panel: http://127.0.0.1:3001/
  Backend API: http://127.0.0.1:8000/api/
  Healthcheck: http://127.0.0.1:8000/health

Useful commands:
  docker compose -f docker-compose.yml -f docker-compose.local.yml logs -f backend
  docker compose -f docker-compose.yml -f docker-compose.local.yml logs -f frontend
  docker compose -f docker-compose.yml -f docker-compose.local.yml logs -f admin-panel
EOF
