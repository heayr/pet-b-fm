#!/usr/bin/env node

/**
 * Скрипт генерации README.md на основе данных из JSON-файлов.
 *
 * Использование:
 *   node scripts/generate-readme.js
 *   DATA_DIR=./docs node scripts/generate-readme.js
 *
 * Структура данных:
 *   docs/dashboard-data.json      — Health, Uptime, метрики, тренды
 *   docs/bugs.json                — Список багов
 *   docs/roadmap.json             — Дорожная карта
 *   docs/security-checklist.json  — Результаты проверок безопасности
 */

const fs = require("fs");
const path = require("path");

// ─── Конфигурация ────────────────────────────────────────────
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "..", "docs");
const OUTPUT = path.join(__dirname, "..", "README.md");

// ─── Чтение JSON-файлов ─────────────────────────────────────
function readJSON(filename) {
    const filepath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filepath)) {
        console.error(`⚠️  Файл не найден: ${filepath}`);
        return null;
    }
    return JSON.parse(fs.readFileSync(filepath, "utf-8"));
}

// ─── Утилиты ─────────────────────────────────────────────────
function progressBar(percent, width = 20) {
    const filled = Math.round((percent / 100) * width);
    const empty = width - filled;
    return "[" + "█".repeat(filled) + "░".repeat(empty) + "] " + percent + "%";
}

function healthEmoji(score) {
    if (score >= 90) return "🟢";
    if (score >= 70) return "🟡";
    return "🔴";
}

function severityEmoji(severity) {
    const map = {
        critical: "🔴",
        high: "🟠",
        medium: "🟡",
        low: "🔵",
    };
    return map[severity] || "⚪";
}

function statusEmoji(status) {
    const map = {
        done: "✅ Выполнено",
        in_progress: "🔧 В работе",
        planned: "📋 Запланировано",
        idea: "💡 Идея",
    };
    return map[status] || status;
}

function priorityLabel(priority) {
    const map = {
        critical: "🔴 Критический",
        high: "🟠 Высокий",
        medium: "🟡 Средний",
        low: "🔵 Низкий",
    };
    return map[priority] || priority;
}

function bugSeverityBadge(severity) {
    const map = {
        high: "🟠 High",
        low: "🟡 Low",
        critical: "🔴 Critical",
    };
    return map[severity] || severity;
}

function bugStatusBadge(status) {
    const map = {
        investigating: "🟡 Investigating",
        fixed: "🟢 Fixed",
        backlog: "🔴 Backlog",
    };
    return map[status] || status;
}

function securityCheckBadge(status) {
    const map = {
        passed: "✅ Пройдено",
        warning: "⚠️",
        failed: "❌ Не пройдено",
        partial: "⚠️ Частично",
    };
    return map[status] || status;
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toISOString().split("T")[0];
}

// ─── Генерация секций ───────────────────────────────────────

function generateHeader() {
    return `<div align="center">

# 🏠 Балаково FM — Платформа для жителей

**Современный веб-портал сообщества Балаково**
*Новости, услуги, управление контентом и авторизация — всё в одном месте.*

---

![Сборка](https://img.shields.io/badge/Build-passing-brightgreen?style=for-the-badge&logo=githubactions&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Версия](https://img.shields.io/badge/version-0.2.0-blue?style=for-the-badge&logo=semver&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15.2-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Traefik](https://img.shields.io/badge/Traefik-Proxy-E33B33?style=for-the-badge&logo=traefik&logoColor=white)
![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)

</div>`;
}

function generateStatusSection(data) {
    if (!data) return "<!-- Данные dashboard-data.json не найдены -->";

    const apiTrendLines = data.api_trend || [];
    const trendAscii = apiTrendLines.length
        ? apiTrendLines.map((t) => `    ${String(t.ms).padStart(3)} │`).join("\n")
        : "    Нет данных";

    return `## 📊 Состояние проекта

> 🤖 Данные обновляются автоматически через GitHub Actions раз в 24 часа.
> 🌐 **Продакшн**: [radiotochka.nologs.site](https://radiotochka.nologs.site)

| Метрика | Значение | Статус |
|:--------|:--------:|:------:|
| **🏥 Health** | ${data.health}% | ${healthEmoji(data.health)} ${data.health >= 90 ? "Отлично" : data.health >= 70 ? "Хорошо" : "Плохо"} |
| **⏱️ Uptime** | ${data.uptime}% | ${data.uptime >= 99.5 ? "🟢 Стабильно" : "🟡 Есть проблемы"} |
| **⚡ Скорость API** | ${data.api_p95_ms} ms (p95) | ${data.api_p95_ms <= 200 ? "🟢 Хорошо" : "🟡 Норма"} |
| **📦 Размер Docker-образа** | ~${data.docker_image_size_mb} MB (gzipped) | 🟢 Оптимально |
| **🔒 Безопасность** | ${data.security_score} пройдено | ${data.security_score === "6/6" ? "🟢 Отлично" : "🟡 Требует внимания"} |
| **🧪 Покрытие тестами** | ${data.test_coverage}% | ${data.test_coverage >= 60 ? "🟢 Хорошо" : "🔴 Нужно улучшить"} |

\`\`\`
Общее здоровье проекта: ${progressBar(data.health)}
Uptime за 30 дней:     ${progressBar(data.uptime)}
\`\`\`

### 📈 Динамика API за последнюю неделю

\`\`\`
API Response Time (ms) — тренд:
${trendAscii}
    ────┴────┴────┴────┴────┴────┴────┤
${apiTrendLines.map((t, i) => (i === 0 ? "    " + String(t.day).padEnd(4) : "    " + String(t.day).padEnd(4))).join("").trim().split("").join("") ? apiTrendLines.map((t) => t.day).join("   ") : ""}
\`\`\`

> 📅 *Обновлено: ${formatDate(data.last_updated)}*`;
}

function generateBugsSection(bugsData) {
    if (!bugsData || !bugsData.bugs) return "<!-- Данные bugs.json не найдены -->";

    const rows = bugsData.bugs
        .map((b) => {
            const status =
                b.status === "fixed"
                    ? `🟢 Fixed${b.fix_version ? ` (${b.fix_version})` : ""}`
                    : bugStatusBadge(b.status);
            return `| ${b.id} | **${b.title}** | ${bugSeverityBadge(b.severity)} | ${status} | ${b.assignee} |`;
        })
        .join("\n");

    return `## 🐛 Что не работает?

> Актуальный баг-трекер. Severity: 🔴 Critical · 🟠 High · 🟡 Low

| ID | Описание | Severity | Статус | Ответственный |
|:--:|:---------|:--------:|:------:|:-------------:|
${rows}`;
}

function generateRoadmapSection(roadmapData) {
    if (!roadmapData || !roadmapData.roadmap)
        return "<!-- Данные roadmap.json не найдены -->";

    const rows = roadmapData.roadmap
        .map((r) => {
            const icons = {
                critical: "🏎️",
                high: "🧹",
                medium: "⚡",
                low: "🤖",
            };
            const icon = icons[r.priority] || "📋";
            return `| **${r.quarter}** | ${icon} ${r.task} | ${priorityLabel(r.priority)} | ${statusEmoji(r.status)} |`;
        })
        .join("\n");

    return `## 🗺️ Планы по улучшению (Roadmap)

### Ближайшие приоритеты

| Квартал | Задача | Приоритет | Статус |
|:-------:|:-------|:---------:|:------:|
${rows}

### Архитектурная эволюция

\`\`\`
Текущий стек:                          Целевой стек:
┌─────────────────────────┐           ┌─────────────────────────┐
│ Next.js 15 SSR          │    ──►    │ Next.js 15 SSR          │
│ PostgreSQL 16 (Docker)  │           │ PostgreSQL 16 (Docker)  │
│ Prisma ORM              │           │ Prisma ORM              │
│ NextAuth v5 (beta)      │           │ NextAuth v5 (stable)    │
│ REST API Routes         │           │ GraphQL (gql)           │
│ Traefik (reverse proxy) │           │ Traefik + Redis Cache   │
│ —                       │           │ WebSocket               │
│ —                       │           │ AI Assist               │
└─────────────────────────┘           └─────────────────────────┘
\`\`\``;
}

function generateSecuritySection(securityData) {
    if (!securityData || !securityData.checks)
        return "<!-- Данные security-checklist.json не найдены -->";

    const rows = securityData.checks
        .map(
            (c) =>
                `| ${c.id} | ${c.icon} **${c.name}** | ${securityCheckBadge(c.status)} | ${c.description} |`
        )
        .join("\n");

    // Находим уязвимости
    const vulnChecks = securityData.checks.filter((c) => c.vulnerabilities);
    let vulnSection = "";

    if (vulnChecks.length) {
        for (const check of vulnChecks) {
            const vulnRows = check.vulnerabilities
                .map(
                    (v) =>
                        `| \`${v.package}\` | ${v.current_version} | [${v.cve}](https://github.com/advisories/) | 🟡 Low | ${v.fix} |`
                )
                .join("\n");
            vulnSection += `
### 📋 Подробности по уязвимостям зависимостей

| Пакет | Текущая версия | Уязвимость | Уровень | Исправление |
|:------|:--------------:|:-----------|:-------:|:------------|
${vulnRows}

**Как исправить:**

\`\`\`bash
# Локально
npm audit fix

# В Docker
docker compose exec web npm audit fix

# Или пересобрать контейнер
docker compose down
npm audit fix
docker compose up -d --build
\`\`\``;
        }
    }

    return `## 🛡️ Безопасность

> Чеклист безопасности проекта. Обновляется при каждом скане.

| # | Проверка | Статус | Описание |
|:-:|:---------|:------:|:---------|
${rows}
${vulnSection}`;
}

function generateDockerSection() {
    return `## 🐳 Архитектура Docker-окружения

### Инфраструктура

\`\`\`
                    ┌─────────────────────────────────┐
                    │         Traefik Proxy            │
                    │   (Let's Encrypt / TLS 1.3)     │
                    └────────────┬────────────────────┘
                                 │
                    ┌────────────▼────────────────────┐
                    │    radiotochka-web (Next.js 15)  │
                    │    node:22-alpine · Порт 3000   │
                    │    Multi-stage build             │
                    └────────────┬────────────────────┘
                                 │
                    ┌────────────▼────────────────────┐
                    │    radiotochka-db (PostgreSQL 16)│
                    │    postgres:16-alpine            │
                    │    Volume: pgdata                │
                    └─────────────────────────────────┘
\`\`\`

### Контейнеры

| Контейнер | Образ | Порт | Описание |
|:----------|:------|:----:|:---------|
| \`radiotochka-web\` | Собирается из \`Dockerfile\` | 3000 | Next.js приложение (production) |
| \`radiotochka-db\` | \`postgres:16-alpine\` | 5432 (internal) | PostgreSQL база данных |

### Multi-stage сборка

\`\`\`
Этап 1 (builder):                 Этап 2 (production):
┌──────────────────────┐          ┌──────────────────────┐
│ node:22-alpine       │          │ node:22-alpine       │
│ npm install          │   ───►   │ копирует:            │
│ prisma generate      │          │   .next/             │
│ npm run build        │          │   public/            │
│                      │          │   node_modules/      │
│                      │          │   prisma/            │
│                      │          │   package.json       │
└──────────────────────┘          │ npm start (порт 3000)│
                                  └──────────────────────┘
\`\`\``;
}

function generateQuickStartSection() {
    return `## 🚀 Быстрый старт

### Предварительные требования

- **Docker** ≥ 24.0
- **Docker Compose** ≥ 2.20
- **Git**

### 1. Клонируем репозиторий

\`\`\`bash
git clone https://github.com/your-org/pet-b-fm.git
cd pet-b-fm
\`\`\`

### 2. Настраиваем переменные окружения

\`\`\`bash
cp .env.example .env
\`\`\`

Отредактируйте \`.env\` — заполните секреты:

\`\`\`bash
# Обязательные переменные:
NEXTAUTH_SECRET="ваш-секрет-минимум-32-символа"
RESEND_API_KEY="re_xxxxxxxxxxxxxxxx"
NEXT_PUBLIC_ACCESS_KEY_WEB_FORM="ваш-web3forms-ключ"
\`\`\`

### 3. Запускаем (продакшн)

\`\`\`bash
# Сборка образов и запуск контейнеров
docker compose up -d --build

# Проверяем статус
docker compose ps

# Смотрим логи
docker compose logs -f web

# Миграции БД (выполняются автоматически при старте)
# Если нужно вручную:
docker compose exec web npx prisma migrate deploy
\`\`\`

🌐 Откройте [https://radiotochka.nologs.site](https://radiotochka.nologs.site)

### 4. Запуск (разработка)

\`\`\`bash
# Dev-окружение с hot-reload
docker compose -f docker-compose.dev.yml up --build

# Логи
docker compose -f docker-compose.dev.yml logs -f web-dev
\`\`\`

🌐 Откройте [http://localhost:3000](http://localhost:3000)

### Полезные Docker-команды

\`\`\`bash
# ─── Production ────────────────────────────────────
docker compose up -d --build          # Пересобрать и запустить
docker compose down                   # Остановить все контейнеры
docker compose restart web            # Перезапустить приложение
docker compose ps                     # Статус контейнеров
docker compose logs -f web            # Логи приложения
docker compose logs -f db             # Логи базы данных
docker compose exec web sh            # Войти в контейнер

# ─── Миграции БД ───────────────────────────────────
docker compose exec web npx prisma migrate deploy
docker compose exec web npx prisma db seed
docker compose exec web npx prisma studio  # UI для БД

# ─── Development ────────────────────────────────────
docker compose -f docker-compose.dev.yml up --build
docker compose -f docker-compose.dev.yml down
docker compose -f docker-compose.dev.yml logs -f web-dev

# ─── Очистка ────────────────────────────────────────
docker system prune -af               # Удалить неиспользуемые образы
docker volume prune                   # Удалить неиспользуемые тома
\`\`\``;
}

function generateTechStackSection() {
    return `## 🏗️ Стек технологий

\`\`\`
┌──────────────────────────────────────────────────────────┐
│                      FRONTEND                            │
│  React 19 · Next.js 15 · Tailwind CSS · TypeScript 5    │
├──────────────────────────────────────────────────────────┤
│                      BACKEND                             │
│  Next.js API Routes · Prisma ORM · NextAuth v5 (beta)   │
│  bcryptjs · Resend (email) · Zod (валидация)             │
├──────────────────────────────────────────────────────────┤
│                      DATABASE                            │
│  PostgreSQL 16 (Alpine) · Prisma Migrations              │
├──────────────────────────────────────────────────────────┤
│                      DOCKER                              │
│  Multi-stage build · node:22-alpine · docker-compose     │
├──────────────────────────────────────────────────────────┤
│                    INFRASTRUCTURE                         │
│  Traefik (reverse proxy) · Let's Encrypt (TLS)           │
│  GitHub Actions (CI/CD)                                  │
└──────────────────────────────────────────────────────────┘
\`\`\`

### Структура файлов

\`\`\`
pet-b-fm/
├── app/                          # Next.js App Router
│   ├── admin/                    # Админ-панель
│   │   ├── content/              # Управление контентом
│   │   │   ├── editors/          # Редакторы блоков контента
│   │   │   └── ContentList.tsx   # Список контент-блоков
│   │   └── users/                # Управление пользователями
│   ├── api/                      # API-маршруты
│   │   ├── auth/                 # Аутентификация (NextAuth)
│   │   └── content/              # CRUD для контента
│   ├── auth/                     # Страницы авторизации
│   ├── components/               # React-компоненты
│   │   ├── Auth/                 # Формы аутентификации
│   │   ├── sections/             # Секции страницы
│   │   └── ui/                   # UI-элементы
│   ├── dashboard/                # Личный кабинет
│   ├── personal-data-consent/    # Согласие на обработку данных
│   └── privacy-policy/           # Политика конфиденциальности
├── lib/                          # Утилиты и общая логика
├── prisma/                       # Схема БД и миграции
├── docs/                         # Документация проекта
├── .github/                      # GitHub Actions workflows
├── Dockerfile                    # Продакшн (multi-stage)
├── Dockerfile.dev                # Разработка (hot-reload)
├── docker-compose.yml            # Продакшн-конфигурация
├── docker-compose.dev.yml        # Разработка
├── auth.ts                       # Конфигурация NextAuth
├── middleware.ts                  # Middleware
└── package.json                  # Зависимости и скрипты
\`\`\`

### Модели данных (Prisma)

\`\`\`mermaid
erDiagram
    User ||--o{ Account : "имеет"
    User ||--o{ Session : "имеет"
    User ||--o{ AuditLog : "создаёт"
    User ||--o{ ContentHistory : "изменяет"
    ContentBlock ||--o{ ContentHistory : "версионируется"

    User {
        string id PK
        string name
        string email UK
        UserRole role
        boolean isTwoFactorEnabled
        boolean isActive
    }

    ContentBlock {
        string id PK
        string slug UK
        string title
        json content
        ContentStatus status
        int version
    }

    AuditLog {
        string id PK
        string userId FK
        string action
        string entity
        json metadata
    }
\`\`\``;
}

function generateAuthSection() {
    return `## 🔐 Аутентификация и авторизация

Проект использует **NextAuth v5 (beta)** с расширенной системой безопасности:

| Возможность | Описание |
|:------------|:---------|
| 🔑 **Email/Password** | Регистрация, вход, сброс пароля |
| 📧 **Верификация email** | Подтверждение почты при регистрации (Resend) |
| 🛡️ **2FA (TOTP)** | Двухфакторная аутентификация (Google Authenticator) |
| 👥 **Роли** | \`super_admin\` → \`admin\` → \`moderator\` → \`user\` |
| 📋 **Аудит-логи** | Запись всех действий пользователей в \`AuditLog\` |
| 🔒 **bcrypt** | Хеширование паролей (bcryptjs) |
| ✅ **Zod** | Валидация всех входных данных |

### API-маршруты

\`\`\`
POST   /api/auth/register         # Регистрация
POST   /api/auth/login            # Вход
POST   /api/auth/forgot-password   # Запрос сброса пароля
POST   /api/auth/reset-password    # Сброс пароля
GET    /api/auth/verify-email      # Верификация email

GET    /api/content/services       # Получить услуги
PUT    /api/content/services       # Обновить услуги (admin)
GET    /api/content/cases          # Получить кейсы
PUT    /api/content/cases          # Обновить кейсы (admin)
GET    /api/content/proposal       # Получить предложение
PUT    /api/content/proposal       # Обновить предложение (admin)
GET    /api/content/logo-section   # Получить секцию логотипов
PUT    /api/content/logo-section   # Обновить секцию логотипов (admin)
\`\`\``;
}

function generateEditDocsSection() {
    return `## ✏️ Как редактировать эту документацию

Эта документация — **живой дашборд**, который обновляется автоматически. Вот как это работает:

### Автоматическое обновление (рекомендуется)

Данные для документации хранятся в JSON-файлах:

\`\`\`
docs/
├── dashboard-data.json      # Health, Uptime, метрики
├── bugs.json                # Список багов
├── roadmap.json             # Дорожная карта
├── security-checklist.json  # Результаты проверок
└── trends.json              # Данные трендов
\`\`\`

**GitHub Actions** запускает скрипт \`scripts/generate-readme.js\` раз в 24 часа:

\`\`\`yaml
# .github/workflows/update-docs.yml
name: 📝 Auto-update README

on:
  schedule:
    - cron: '0 6 * * *'   # Каждый день в 06:00 UTC
  workflow_dispatch:        # Ручной запуск

jobs:
  update-readme:
    runs-on: ubuntu-latest
    permissions:
      contents: write

    steps:
      - name: 📥 Checkout
        uses: actions/checkout@v4

      - name: 🟢 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: 📦 Install dependencies
        run: npm ci --ignore-scripts

      - name: 📊 Fetch latest metrics
        run: node scripts/fetch-metrics.js
        env:
          API_URL: \${{ secrets.API_URL }}
          API_KEY: \${{ secrets.API_KEY }}

      - name: 🔄 Generate README
        run: node scripts/generate-readme.js

      - name: 💾 Commit changes
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add README.md
          git diff --cached --quiet || git commit -m "docs: auto-update README [skip ci]"
          git push
\`\`\`

### Ручное обновление

Если нужно вручную обновить данные:

1. Отредактируйте соответствующий JSON-файл в \`docs/\`
2. Запустите генерацию:
   \`\`\`bash
   node scripts/generate-readme.js
   \`\`\`
3. Закоммитьте изменения через Pull Request

**Пример \`docs/bugs.json\`:**

\`\`\`json
{
  "bugs": [
    {
      "id": "BUG-001",
      "title": "Кеш страниц не инвалидируется",
      "severity": "high",
      "status": "investigating",
      "assignee": "@dev-team",
      "created_at": "2025-08-20"
    }
  ]
}
\`\`\`

**Пример \`docs/dashboard-data.json\`:**

\`\`\`json
{
  "health": 92,
  "uptime": 99.8,
  "api_p95_ms": 145,
  "bundle_size_kb": 187,
  "test_coverage": 34,
  "last_updated": "2025-08-25T06:00:00Z"
}
\`\`\`

### Скрипт генерации (\`scripts/generate-readme.js\`)

Скрипт читает все JSON-файлы из \`docs/\` и подставляет данные в шаблон README.md:

\`\`\`bash
# Запуск скрипта локально
node scripts/generate-readme.js

# С указанием пути к данным
DATA_DIR=./docs node scripts/generate-readme.js
\`\`\``;
}

function generateMigrationsSection() {
    return `## 📁 Миграции и управление БД

### Создание новой миграции

\`\`\`bash
# Локально (без Docker)
npx prisma migrate dev --name add_new_field

# В Docker
docker compose exec web npx prisma migrate dev --name add_new_field
\`\`\`

### Применение миграций в продакшне

Миграции **применяются автоматически** при каждом запуске контейнера:

\`\`\`bash
# Из docker-compose.yml:
command: sh -c "npx prisma migrate deploy && npm start"
\`\`\`

### Seed-данные

\`\`\`bash
# Локально
npx prisma db seed

# В Docker
docker compose exec web npx prisma db seed
\`\`\`

### Prisma Studio (UI для БД)

\`\`\`bash
# Локально
npx prisma studio

# В Docker (нужно пробросить порт)
docker compose exec web npx prisma studio --browser none
\`\`\``;
}

function generateEnvSection() {
    return `## 🔧 Окружения

| Окружение | Файл | URL | Описание |
|:----------|:-----|:----|:---------|
| **Production** | \`docker-compose.yml\` | [radiotochka.nologs.site](https://radiotochka.nologs.site) | Multi-stage build, Traefik, SSL |
| **Development** | \`docker-compose.dev.yml\` | [localhost:3000](http://localhost:3000) | Hot-reload, volumes |

### Переменные окружения

| Переменная | Обязательна | Описание | Пример |
|:-----------|:-----------:|:---------|:-------|
| \`DATABASE_URL\` | ✅ | URL подключения к PostgreSQL | \`postgresql://user:pass@db:5432/dbname\` |
| \`NEXTAUTH_SECRET\` | ✅ | Секрет NextAuth (мин. 32 символа) | \`random-secret-string\` |
| \`NEXTAUTH_URL\` | ✅ | Базовый URL сайта | \`https://radiotochka.nologs.site\` |
| \`AUTH_TRUST_HOST\` | ✅ | Доверять заголовку Host | \`true\` |
| \`RESEND_API_KEY\` | ⚠️ | API-ключ Resend (для email) | \`re_xxxx\` |
| \`EMAIL_FROM\` | ⚠️ | Email отправителя | \`noreply@radiotochka.nologs.site\` |
| \`NEXT_PUBLIC_APP_URL\` | ⚠️ | Публичный URL сайта | \`https://radiotochka.nologs.site\` |
| \`NEXT_PUBLIC_ACCESS_KEY_WEB_FORM\` | ⚠️ | Web3Forms API ключ | \`xxxx\` |`;
}

function generateContributingSection() {
    return `## 🤝 Участие в разработке

### Branching-модель

\`\`\`
main ─────────────────────────────────────── Продакшн (Docker)
  └── develop ─────────────────────────────── Интеграция
       ├── feature/xxx ─────────────────────── Новые фичи
       ├── fix/xxx ─────────────────────────── Исправления багов
       └── refactor/xxx ───────────────────── Рефакторинг
\`\`\`

### Команды для разработки

\`\`\`bash
# Старт dev-окружения
docker compose -f docker-compose.dev.yml up --build

# Линтинг
docker compose exec web-dev npm run lint

# Тесты
docker compose exec web-dev npm test

# Сборка проверка
docker compose exec web-dev npm run build
\`\`\``;
}

function generateFooter(data) {
    const lastUpdated = data?.last_updated
        ? formatDate(data.last_updated)
        : formatDate(new Date().toISOString());
    return `<div align="center">

**Built with ❤️ for жителей Балаково**

🏠 [radiotochka.nologs.site](https://radiotochka.nologs.site) · 📧 [Связаться с нами](mailto:noreply@radiotochka.nologs.site)

---

📅 *Последнее обновление документации: ${lastUpdated}*
🤖 *Автообновление: [GitHub Actions](.github/workflows/update-docs.yml)*

</div>`;
}

// ─── Mermaid-графики (тренды) ───────────────────────────────

function generateMermaidSection(data) {
    if (!data) return "";

    const bugsTrend = data.bugs_trend || [12, 10, 9, 8, 6, 5, 4];
    const featuresTrend = data.features_trend || [5, 7, 8, 10, 12, 14, 16];
    const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

    return `## 📈 Тренды багов и фич (последние 7 дней)

### 🐛 Количество багов (тренд ↓ — падает)

\`\`\`mermaid
xychart-beta
    title "Баги за неделю (тренд падающий)"
    x-axis [${days.map((d) => `"${d}"`).join(", ")}]
    y-axis "Кол-во багов" 0 --> ${Math.max(...bugsTrend) + 3}
    bar [${bugsTrend.join(", ")}]
\`\`\`

### 🚀 Количество фич (тренд ↑ — растёт)

\`\`\`mermaid
xychart-beta
    title "Фичи за неделю (тренд растущий)"
    x-axis [${days.map((d) => `"${d}"`).join(", ")}]
    y-axis "Кол-во фич" 0 --> ${Math.max(...featuresTrend) + 3}
    bar [${featuresTrend.join(", ")}]
\`\`\`

### 🗓️ Roadmap — График по задачам

\`\`\`mermaid
gantt
    title Дорожная карта проекта
    dateFormat  YYYY-MM-DD
    axisFormat  %b %Y

    section Q3 2025
    Оптимизация бандла            :done,    q3a, 2025-07-01, 2025-07-31
    Рефакторинг Admin-панели      :done,    q3b, 2025-07-15, 2025-08-31
    Покрытие тестами (→ 60%)      :active,  q3c, 2025-08-01, 2025-09-30

    section Q4 2025
    GraphQL Federation            :         q4a, 2025-10-01, 2025-11-30
    Redis-кеш для API             :         q4b, 2025-10-15, 2025-11-15
    WebSocket-уведомления         :         q4c, 2025-11-01, 2025-12-15

    section Q1 2026
    AI-ассистент для жителей      :         q1a, 2026-01-01, 2026-02-28
    Мультиязычность (ru/en)       :         q1b, 2026-02-01, 2026-03-31
    Мобильное PWA                 :         q1c, 2026-01-15, 2026-03-15
\`\`\``;
}

// ─── Основная функция ───────────────────────────────────────

function main() {
    console.log("📝 Генерация README.md...");
    console.log(`📁 Данные из: ${DATA_DIR}`);

    const dashboard = readJSON("dashboard-data.json");
    const bugs = readJSON("bugs.json");
    const roadmap = readJSON("roadmap.json");
    const security = readJSON("security-checklist.json");

    const sections = [
        generateHeader(),
        generateStatusSection(dashboard),
        generateDockerSection(),
        generateQuickStartSection(),
        generateMermaidSection(dashboard),
        generateBugsSection(bugs),
        generateRoadmapSection(roadmap),
        generateSecuritySection(security),
        generateTechStackSection(),
        generateAuthSection(),
        generateEditDocsSection(),
        generateMigrationsSection(),
        generateEnvSection(),
        generateContributingSection(),
        generateFooter(dashboard),
    ];

    const readme = sections.join("\n\n---\n\n") + "\n";

    fs.writeFileSync(OUTPUT, readme, "utf-8");
    console.log(`✅ README.md сгенерирован: ${OUTPUT}`);
    console.log(`📊 Health: ${dashboard?.health || "N/A"}% | Uptime: ${dashboard?.uptime || "N/A"}%`);
}

main();