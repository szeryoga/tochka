# Tochka MVP

Production-like MVP Telegram Mini App для школы импровизации "Точка" в виде монорепозитория с Docker Compose.

## Состав

- `frontend/` — Telegram Mini App на React + TypeScript + Vite
- `admin-panel/` — админка на React + TypeScript + Vite
- `backend/` — FastAPI + SQLAlchemy + Pydantic
- `nginx/` — reverse proxy для frontend, admin и API
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

2. Подними проект:

```bash
docker compose up --build
```

3. После старта сервисы доступны по адресам:

- mini app: `http://localhost/`
- admin panel: `http://localhost/admin/`
- backend API: `http://localhost/api/`
- healthcheck: `http://localhost/health`

## HTTPS через Let's Encrypt

1. Укажи реальные домены и e-mail в `.env`:

```bash
cp .env.example .env
```

Заполни:

- `APP_DOMAIN`
- `ADMIN_DOMAIN`
- `API_DOMAIN`
- `LETSENCRYPT_EMAIL`

2. Убедись, что все три домена уже смотрят на IP сервера и что порты `80` и `443` открыты.

3. Запусти проект в bootstrap-режиме для ACME challenge:

```bash
docker compose up -d --build postgres backend frontend admin-panel nginx
```

На первом запуске `nginx` поднимется без TLS и будет обслуживать только `/.well-known/acme-challenge/` и редиректить остальное на HTTPS.

4. Выпусти сертификаты:

```bash
docker compose run --rm --profile certbot certbot
```

5. Перезапусти `nginx`, чтобы он подхватил сертификаты и включил HTTPS-конфиг:

```bash
docker compose restart nginx
```

6. После этого сервисы будут доступны по адресам:

- mini app: `https://${APP_DOMAIN}`
- admin panel: `https://${ADMIN_DOMAIN}`
- backend API: `https://${API_DOMAIN}`

7. Обновление сертификатов:

```bash
docker compose run --rm --profile certbot certbot renew --webroot -w /var/www/certbot
docker compose restart nginx
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
- reverse proxy на `nginx` маршрутизирует:
  - `/` -> `frontend`
  - `/admin` -> `admin-panel`
  - `/api` -> `backend`
- для первого запуска на Ubuntu достаточно Docker и Docker Compose plugin

## Переменные окружения

Основные переменные:

- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_HOST`
- `POSTGRES_PORT`
- `NGINX_PORT`
- `CORS_ORIGINS`
- `DEV_TELEGRAM_*`

Если меняешь порт публикации nginx, меняй `NGINX_PORT` в `.env`.
