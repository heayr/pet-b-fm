# ADR-00X: [Название решения]

**Дата:** YYYY-MM-DD  
**Статус:** Accepted | Deprecated | Superseded  
**Автор:** @username

---

## Контекст

Опишите проблему и ограничения.

- Какие фичи Next.js 15 затрагиваются (RSC, Server Actions, Turbopack)
- Какие команды/сервисы задействованы
- Бизнес-требования

**Пример из текущего проекта:**  
Выбор между Server Component и Client Component: требуется `'use client'` для формы 2FA, так как используются `useState` и `useEffect`.

---

## Решение

Опишите выбранный подход.

> Пример: Используем NextAuth v5 с PrismaAdapter, стратегия сессии JWT.  
> 2FA через speakeasy (TOTP) с резервными кодами в модели `TwoFactorToken`.

---

## Сложности и альтернативы

| Альтернатива   | Причина отклонения                                       |
| :------------- | :------------------------------------------------------- |
| Clerk          | Проект использует next-auth v5, миграция нецелесообразна |
| Drizzle ORM    | Prisma уже используется, меньше рисков миграции          |
| Redis sessions | JWT-сессии stateless, не требует хранилища               |

---

## Обоснование

- Совместимость с Turbopack ✅
- Поддержка Server Components ✅
- Безопасность (CSP, CSRF) ✅

---

## Последствия

**Положительные:**

- Готовое RSC-решение
- Типобезопасность через Prisma Client
- Автогенерация OpenAPI

**Отрицательные:**

- Размер бандла Prisma Client (~1MB)
- Ограничения `bcryptjs` в Edge Runtime

**Миграционные шаги:**

1. Установить `@auth/prisma-adapter` — ✅ сделано
2. Обновить `auth.ts` JWT callbacks
3. Добавить seeding для `TwoFactorToken`
