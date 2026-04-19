# Tochka MVP

Production-like MVP Telegram Mini App для школы импровизации "Точка" в виде монорепозитория с Docker Compose.

Текущая схема маршрутизации:

- один hostname: `APP_DOMAIN`
- mini app: `${APP_BASE_PATH}`
- admin panel: `${ADMIN_BASE_PATH}`
- backend API: `${API_BASE_PATH}`

Важно: путь не хранится в `APP_DOMAIN`. `APP_DOMAIN` — это только hostname для TLS, nginx и certbot.

Для production используется внешний gateway-проект. Этот репозиторий поднимает только:

- `postgres`
- `backend`
- `frontend`
- `admin-panel`

Внешний gateway подключается к общей Docker-сети `GATEWAY_NETWORK` и маршрутизирует трафик на:

- `http://tochka-frontend:80`
- `http://tochka-admin:80`
- `http://tochka-backend:8000`

## Состав

- `frontend/` — Telegram Mini App на React + TypeScript + Vite
- `admin-panel/` — админка на React + TypeScript + Vite
- `backend/` — FastAPI + SQLAlchemy + Pydantic
- `nginx/` — legacy reverse proxy, код сохранён, но по умолчанию не используется
- `postgres` — база данных PostgreSQL 16
- `ref/` — локальные дизайн-референсы и исходный логотип

## Структура

```text
.
├── .env.example
├── README.md
├── docker-compose.yml
├── admin-panel
│   ├── Dockerfile
│   ├── docker.nginx.conf
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── src
│       ├── App.tsx
│       ├── api
│       ├── components
│       ├── layouts
│       ├── pages
│       ├── styles
│       └── types
├── backend
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app
│       ├── __init__.py
│       ├── api
│       ├── core
│       ├── db
│       ├── main.py
│       ├── models
│       ├── repositories
│       ├── schemas
│       ├── services
│       └── static
├── frontend
│   ├── Dockerfile
│   ├── docker.nginx.conf
│   ├── index.html
│   ├── package.json
│   ├── public
│   │   └── logo.png
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── src
│       ├── App.tsx
│       ├── api
│       ├── components
│       ├── layouts
│       ├── pages
│       ├── store
│       ├── styles
│       ├── types
│       └── utils
├── nginx
│   ├── Dockerfile
│   ├── acme.conf.template
│   ├── default.conf.template
│   └── docker-entrypoint.sh
└── ref
```

## Запуск

1. Создай env-файл:

```bash
cp .env.example .env
```

2. Для production через внешний gateway подними проект:

```bash
./scripts/prod-up.sh
```

3. После старта gateway должен маршрутизировать трафик на:

- `http://tochka-frontend:80`
- `http://tochka-admin:80`
- `http://tochka-backend:8000`

4. Пример gateway routing:

```yaml
domains:
  - host: tochka.etalonfood.com
    routes:
      - path: /app
        upstream: http://tochka-frontend:80
      - path: /admin
        upstream: http://tochka-admin:80
      - path: /api
        upstream: http://tochka-backend:8000
```

5. Для локальных браузерных тестов без gateway используй:

```bash
./scripts/local-dev.sh
```

## Legacy `nginx` / `certbot`

Встроенные `nginx` и `certbot` сохранены в репозитории, но по умолчанию не запускаются. Они оставлены только как legacy-вариант.

Если всё-таки нужен старый встроенный режим:

```bash
docker compose --profile legacy-gateway up -d nginx
```

```bash
docker compose --profile legacy-gateway --profile certbot run --rm certbot
```

## Что делает backend при старте

- создает таблицы через SQLAlchemy `create_all`
- автоматически сидирует:
  - базовые `settings`
  - 3 мероприятия
  - 3 курса

Alembic пока не используется по ТЗ.

## API

### Public

- `GET /api/settings/header`
- `GET /api/events`
- `GET /api/events/{id}`
- `GET /api/courses`
- `GET /api/courses/{id}`
- `GET /api/me/registrations?telegram_id=...`
- `POST /api/registrations`
- `GET /api/profile/telegram-dev`

### Admin

- `GET /api/admin/events`
- `POST /api/admin/events`
- `PUT /api/admin/events/{id}`
- `DELETE /api/admin/events/{id}`
- `GET /api/admin/courses`
- `POST /api/admin/courses`
- `PUT /api/admin/courses/{id}`
- `DELETE /api/admin/courses/{id}`
- `GET /api/admin/teachers`
- `POST /api/admin/teachers`
- `PUT /api/admin/teachers/{id}`
- `DELETE /api/admin/teachers/{id}`
- `GET /api/admin/registrations/events`
- `GET /api/admin/registrations/courses`
- `GET /api/admin/registrations/events/{event_id}`
- `GET /api/admin/registrations/courses/{course_id}`
- `GET /api/admin/settings`
- `PUT /api/admin/settings`

## Telegram Mini App fallback

Во `frontend` есть интеграционная точка `src/utils/telegram.ts`.

Логика такая:

- если доступен `window.Telegram.WebApp`, приложение берет пользователя из `initDataUnsafe.user`
- если приложение открыто вне Telegram, frontend запрашивает `GET /api/profile/telegram-dev`
- dev-пользователь настраивается через `.env`

Серверная криптографическая валидация `initData` пока не реализована, но для нее уже оставлена отдельная точка интеграции.

## Настройка контента

Через админку можно:

- создавать, редактировать и удалять мероприятия
- создавать, редактировать и удалять курсы
- менять телефон и подпись в шапке mini app
- менять заголовки и подзаголовки страниц mini app

## Изображения

- логотип mini app используется строго из `ref/логотип.png`
- в проект он скопирован как `frontend/public/logo.png` без переработки
- изображения мероприятий и курсов пока хранятся как URL-строки

## Полезные замечания

- mini app сверстан под мобильный экран с фиксированной верхней шапкой и нижним таббаром
- production gateway должен быть подключён к сети `GATEWAY_NETWORK`
- в этой сети сервисы доступны по именам:
  - `tochka-frontend`
  - `tochka-admin`
  - `tochka-backend`
- для первого запуска на Ubuntu достаточно Docker и Docker Compose plugin

## Переменные окружения

Основные переменные:

- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_HOST`
- `POSTGRES_PORT`
- `NGINX_PORT`
- `APP_DOMAIN`
- `APP_BASE_PATH`
- `ADMIN_BASE_PATH`
- `API_BASE_PATH`
- `GATEWAY_NETWORK`
- `CORS_ORIGINS`
- `DEV_TELEGRAM_*`
