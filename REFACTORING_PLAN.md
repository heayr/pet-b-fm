# План рефакторинга: pet-b-fm (Радиоточка)

## 1. Введение

Приложение — корпоративный сайт рекламного агентства «Радиоточка» на **Next.js 15 (App Router)** с TypeScript, Tailwind CSS, Prisma ORM, NextAuth (Credentials + 2FA), Resend для email.

### Технологический стек

- **Framework:** Next.js 15.2 (App Router)
- **Язык:** TypeScript 5
- **UI:** React 19, Tailwind CSS 3
- **Формы:** react-hook-form + zod + @hookform/resolvers
- **ORM:** Prisma 5
- **Auth:** NextAuth 5 (beta) + Credentials + TOTP 2FA (speakeasy)
- **Email:** Resend API
- **Стейт-менеджмент:** Только локальный (useState/useReducer) — глобального менеджера нет
- **Стили:** Tailwind CSS

### Цель

Уменьшить размер компонентов до 100–150 строк, устранить дублирование, разделить ответственности, повысить тестируемость и расширяемость.

---

## 2. Анализ текущего состояния

### 2.1 Карта файлов по размеру

| Файл                                     | Строк   | Проблема                                  |
| ---------------------------------------- | ------- | ----------------------------------------- |
| `app/admin/content/ContentList.tsx`      | **922** | 🔴 Критично — 8 компонентов в одном файле |
| `lib/actions/auth-actions.ts`            | **445** | 🟡 10 серверных действий в одном файле    |
| `app/components/Auth/TwoFactorSetup.tsx` | **245** | 🟡 3 компонента, много state              |
| `app/admin/users/UsersList.tsx`          | **256** | 🟡 Фильтры + таблица + пагинация          |
| `app/dashboard/DashboardClient.tsx`      | **203** | 🟡 3 секции в одном компоненте            |
| `app/components/Button.tsx`              | **159** | 🟢 Приемлемо, но есть что оптимизировать  |
| `app/components/Form.tsx`                | **158** | 🟡 Ручные useState вместо react-hook-form |
| `app/components/Auth/LoginForm.tsx`      | **133** | 🟢 Приемлемо                              |
| `app/components/Auth/RegisterForm.tsx`   | **150** | 🟢 Приемлемо                              |
| `lib/actions/admin-actions.ts`           | **297** | 🟡 Смешаны user + content actions         |

### 2.2 Выявленные проблемы

#### 🔴 Критические

**1. `ContentList.tsx` — God File (922 строк)**

- Содержит **8 компонентов**: `ContentList`, `LogoSectionEditor`, `ServicesEditor`, `CasesEditor`, `ProposalEditor`, `JsonEditor`, `CreateContentBlock`, `ImageHint`
- Каждый редактор — полноценный компонент со своим state и логикой
- Нарушение **Single Responsibility**: один файл отвечает за CRUD всех типов контент-блоков
- Невозможно тестировать изолированно
- При добавлении нового типа блока файл будет расти бесконечно

**2. Дублирование интерфейсов и констант**

- `ContentBlock` интерфейс объявлен в `ContentList.tsx`, но не экспортируется — дублируется при необходимости
- `roleLabels` и `roleColors` дублируются в `UsersList.tsx`, `DashboardClient.tsx`, `ContentList.tsx`
- `statusLabels` и `statusColors` дублируются в `ContentList.tsx`

#### 🟡 Средние

**3. `auth-actions.ts` — 445 строк, 10 функций**

- Смешаны: регистрация, логин, верификация email, сброс пароля, 2FA (setup/confirm/disable/verify), смена пароля
- Нарушение **Single Responsibility**

**4. `Form.tsx` — ручное управление state**

- Использует 5 `useState` вместо `react-hook-form`, который уже используется в других формах
- Нарушение **DRY** по паттерну работы с формами
- Нет валидации через zod (проверка `!name || !email || !message` — примитивная)

**5. `Footer.tsx` — серверный компонент с проверкой ролей**

- Содержит хардкод ролей `["super_admin", "admin", "moderator"]`
- Ссылка «Модерация» видна всем пользователям (включая неавторизованных), хотя `href="/admin/content"` защищён middleware

**6. `DashboardClient.tsx` — смешение UI и логики**

- Содержит информацию о пользователе, форму смены пароля и блок 2FA — три разных ответственности
- `roleLabels` дублируется (см. п.2)

**7. `UsersList.tsx` — useEffect + ручной fetch**

- Использует `useEffect` для загрузки данных вместо Server Components или SWR/React Query
- Ручное управление `isLoading`, `users`, `pagination` state

#### 🟢 Мелкие

**8. `Navbar.tsx` — гамбургер без анимации**

- Мелочь: нет анимации открытия/закрытия меню

**9. `SafeImage.tsx` — клиентский компонент для простой задачи**

- `"use client"` из-за `useState` для error handling — это оправдано, но можно рассмотреть SSR fallback

---

## 3. Предлагаемые паттерны рефакторинга

### 3.1 Разделение на серверные и клиентские компоненты

**Принцип:** Данные загружаются в серверных компонентах, UI-взаимодействие — в клиентских.

```tsx
// ✅ Серверный компонент — загружает данные
async function ServicesSection() {
  const services = await getServices(); // серверная логика
  return <ServicesGrid services={services} />;
}

// ✅ Клиентский компонент — только UI
("use client");
function ServicesGrid({ services }: { services: Service[] }) {
  // рендеринг
}
```

### 3.2 Кастомные хуки для бизнес-логики

**Паттерн:** Вынос логики в `use...` хуки для переиспользования и тестирования.

```tsx
// hooks/useContactForm.ts
export function useContactForm() {
  // логика формы
  return { onSubmit, isSubmitting, error, success };
}
```

### 3.3 Абстракция повторяющихся паттернов

**Паттерн:** Универсальные компоненты для повторяющихся UI-элементов.

```tsx
// components/ui/Alert.tsx
type AlertVariant = 'error' | 'success' | 'info';
function Alert({ variant, children }: { variant: AlertVariant; children: React.ReactNode }) { ... }

// components/ui/FormSection.tsx — обёртка для секций админки
// components/ui/StatusBadge.tsx — бейдж статусов с цветами
// components/ui/Pagination.tsx — пагинация
```

### 3.4 Сервисный слой для данных

**Паттерн:** Вынос Prisma-запросов в сервисы для переиспользования и тестирования.

```ts
// services/content.service.ts
export async function getContentBlock(slug: string) { ... }
export async function updateContentBlock(slug: string, data: any) { ... }

// services/user.service.ts
export async function getUsers(params: GetUsersParams) { ... }
```

### 3.5 Маппинг констант в общем файле

**Паттерн:** Все маппинговые константы в одном месте.

```ts
// constants/roles.ts
export const ROLE_LABELS = { super_admin: "Супер-админ", ... };
export const ROLE_COLORS = { super_admin: "bg-purple-100 text-purple-800", ... };
export const ADMIN_ROLES = ["super_admin", "admin", "moderator"] as const;

// constants/statuses.ts
export const STATUS_LABELS = { draft: "Черновик", ... };
export const STATUS_COLORS = { draft: "bg-yellow-100 text-yellow-800", ... };
```

---

## 4. Предлагаемая файловая структура

```
app/
├── layout.tsx                          # Root layout (без изменений)
├── page.tsx                            # Home page (без изменений)
├── globals.css
│
├── components/
│   ├── ui/                             # Атомарные UI-компоненты
│   │   ├── Button.tsx                  # (оставить как есть)
│   │   ├── SafeImage.tsx               # (оставить как есть)
│   │   ├── Alert.tsx                   # 🆕 Универсальный алерт (error/success/info)
│   │   ├── StatusBadge.tsx             # 🆕 Бейдж статусов
│   │   ├── Pagination.tsx              # 🆕 Пагинация
│   │   ├── SectionHeader.tsx           # 🆕 Заголовок секции с lime-бейджем
│   │   └── EmptyState.tsx              # 🆕 Пустое состояние
│   │
│   ├── layout/                         # Layout-компоненты
│   │   ├── Navbar.tsx                  # (без изменений)
│   │   └── Footer/
│   │       ├── Footer.tsx              # Серверный — загружает session
│   │       ├── FooterNav.tsx           # Клиентский — навигация
│   │       └── FooterContacts.tsx      # Серверный — контакты
│   │
│   ├── sections/                       # Секции главной страницы
│   │   ├── MainSection.tsx             # (без изменений, уже чистый)
│   │   ├── LogoSection/
│   │   │   ├── LogoSection.tsx         # Серверный — загружает данные
│   │   │   └── LogoGrid.tsx            # Клиентский — рендерит логотипы
│   │   ├── ServicesSection/
│   │   │   ├── ServicesSection.tsx     # Серверный — загружает данные
│   │   │   ├── ServiceCard.tsx         # Карточка услуги
│   │   │   └── services-data.ts        # Default data + типы
│   │   ├── ProposalSection/
│   │   │   ├── ProposalSection.tsx     # Серверный — загружает данные
│   │   │   └── ProposalContent.tsx     # Клиентский — рендерит контент
│   │   ├── CasesSection/
│   │   │   ├── CasesSection.tsx        # Серверный — загружает данные
│   │   │   ├── CaseCard.tsx            # Карточка кейса
│   │   │   └── cases-data.ts           # Default data + типы
│   │   └── ContactForm/
│   │       ├── ContactForm.tsx         # Клиентский — обёртка
│   │       └── useContactForm.ts       # 🆕 Хук для формы
│   │
│   ├── auth/                           # Auth-компоненты (переименовать из Auth/)
│   │   ├── LoginForm.tsx               # (без изменений)
│   │   ├── RegisterForm.tsx            # (без изменений)
│   │   ├── ForgotPasswordForm.tsx      # (без изменений)
│   │   ├── ResetPasswordForm.tsx       # (без изменений)
│   │   ├── TwoFactorSetup/
│   │   │   ├── TwoFactorSetup.tsx      # Основной компонент
│   │   │   ├── SetupWizard.tsx         # 🆕 Пошаговый мастер настройки
│   │   │   └── Disable2FA.tsx          # 🆕 Отдельный компонент отключения
│   │   └── SessionProvider.tsx         # (без изменений)
│   │
│   └── shared/                         # Переиспользуемые компоненты
│       ├── AuthFormWrapper.tsx         # 🆕 Обёртка для auth-форм
│       ├── AdminCard.tsx               # 🆕 Карточка для админки
│       └── UserAvatar.tsx              # (если появится)
│
├── admin/
│   ├── content/
│   │   ├── page.tsx                    # Серверный — загружает блоки
│   │   ├── ContentList.tsx             # Только список + навигация
│   │   └── editors/                    # 🆕 Папка редакторов
│   │       ├── LogoSectionEditor.tsx   # 🆕
│   │       ├── ServicesEditor.tsx      # 🆕
│   │       ├── CasesEditor.tsx         # 🆕
│   │       ├── ProposalEditor.tsx      # 🆕
│   │       ├── JsonEditor.tsx          # 🆕
│   │       ├── CreateContentBlock.tsx  # 🆕
│   │       └── editor-types.ts         # 🆕 Общие типы для редакторов
│   │
│   └── users/
│       ├── page.tsx
│       ├── UsersList.tsx               # Разбить на подкомпоненты
│       ├── UsersFilters.tsx            # 🆕 Фильтры
│       ├── UsersTable.tsx              # 🆕 Таблица
│       └── [id]/
│           ├── page.tsx
│           └── EditUserForm.tsx
│
├── dashboard/
│   ├── page.tsx
│   ├── DashboardClient.tsx             # Упростить до компоновщика
│   ├── UserInfoCard.tsx                # 🆕 Информация о пользователе
│   ├── PasswordChangeCard.tsx          # 🆕 Форма смены пароля
│   └── SecurityCard.tsx                # 🆕 2FA + выход
│
├── auth/                               # Auth pages (без изменений)
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── forgot-password/page.tsx
│   ├── reset-password/page.tsx
│   ├── verify-email/page.tsx
│   └── error/page.tsx
│
└── api/                                # API routes (без изменений)
    └── content/
        ├── cases/route.ts
        ├── services/route.ts
        ├── proposal/route.ts
        └── logo-section/route.ts

lib/
├── db.ts                               # (без изменений)
├── audit.ts                            # (без изменений)
├── mailer.ts                           # (без изменений)
├── rate-limit.ts                       # (без изменений)
├── validations.ts                      # (без изменений)
├── auth-helpers.ts                     # (без изменений)
│
├── services/                           # 🆕 Сервисный слой
│   ├── content.service.ts              # Работа с ContentBlock
│   ├── user.service.ts                 # Работа с User
│   └── audit.service.ts                # Работа с AuditLog
│
├── actions/
│   ├── auth-actions.ts                 # Уменьшить за счёт сервисов
│   ├── admin-actions.ts               # Уменьшить за счёт сервисов
│   └── content-actions.ts             # 🆕 Вынести из admin-actions
│
└── constants/                          # 🆕 Общие константы
    ├── roles.ts                        # ROLE_LABELS, ROLE_COLORS, ADMIN_ROLES
    └── statuses.ts                     # STATUS_LABELS, STATUS_COLORS

types/
├── next-auth.d.ts                      # (без изменений)
├── content.ts                          # 🆕 ContentBlock, ServiceItem, CaseItem и т.д.
└── user.ts                             # 🆕 UserListItem, Pagination и т.д.
```

---

## 5. Пошаговый план рефакторинга

### Этап 0: Подготовка (без изменения логики)

**Цель:** Создать инфраструктуру для рефакторинга.

#### Шаг 0.1: Создать общие типы

```
Создать: types/content.ts, types/user.ts
```

**`types/content.ts`** — вынести интерфейсы из `ContentList.tsx`:

```ts
export interface ContentBlock {
  id: string;
  slug: string;
  title: string;
  content: Record<string, unknown>;
  status: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceItem {
  title: string;
  description?: string;
  imageSrc: string;
  iconSrc?: string;
  bgColor: string;
  textColor: string;
  borderColor?: string;
  borderWidth?: string;
}

export interface CaseItem {
  text: string;
  link: string;
  imageSrc?: string;
}

export interface ProposalContent {
  title: string;
  description: string;
  buttonText: string;
}

export interface LogoItem {
  src: string;
  alt: string;
}
```

**`types/user.ts`** — вынести интерфейсы из `UsersList.tsx` и `DashboardClient.tsx`:

```ts
export interface UserListItem {
  id: string;
  name: string | null;
  email: string;
  role: string;
  isActive: boolean;
  emailVerified: Date | null;
  isTwoFactorEnabled: boolean;
  createdAt: Date;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
```

#### Шаг 0.2: Создать общие константы

```
Создать: constants/roles.ts, constants/statuses.ts
```

**`constants/roles.ts`**:

```ts
export const ROLE_LABELS: Record<string, string> = {
  super_admin: "Супер-админ",
  admin: "Админ",
  moderator: "Модератор",
  user: "Пользователь",
};

export const ROLE_COLORS: Record<string, string> = {
  super_admin: "bg-purple-100 text-purple-800",
  admin: "bg-blue-100 text-blue-800",
  moderator: "bg-yellow-100 text-yellow-800",
  user: "bg-gray-100 text-gray-800",
};

export const ADMIN_ROLES = ["super_admin", "admin", "moderator"] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];
```

**`constants/statuses.ts`**:

```ts
export const STATUS_LABELS: Record<string, string> = {
  draft: "Черновик",
  published: "Опубликован",
  archived: "В архиве",
};

export const STATUS_COLORS: Record<string, string> = {
  draft: "bg-yellow-100 text-yellow-800",
  published: "bg-green-100 text-green-800",
  archived: "bg-gray-100 text-gray-800",
};
```

#### Шаг 0.3: Создать переиспользуемые UI-компоненты

```
Создать: components/ui/Alert.tsx, StatusBadge.tsx, Pagination.tsx, SectionHeader.tsx, EmptyState.tsx
```

**`components/ui/Alert.tsx`** (~30 строк):

```tsx
interface AlertProps {
  variant: "error" | "success" | "info";
  children: React.ReactNode;
}

const styles = {
  error: "bg-red-50 border-red-200 text-red-700",
  success: "bg-green-50 border-green-200 text-green-700",
  info: "bg-blue-50 border-blue-200 text-blue-800",
};

export function Alert({ variant, children }: AlertProps) {
  return (
    <div className={`border px-4 py-3 rounded-xl mb-4 ${styles[variant]}`}>
      {children}
    </div>
  );
}
```

**`components/ui/StatusBadge.tsx`** (~25 строк):

```tsx
interface StatusBadgeProps {
  label: string;
  colorClass: string;
  extra?: string; // например "v2"
}

export function StatusBadge({ label, colorClass, extra }: StatusBadgeProps) {
  return (
    <span className="flex items-center gap-2">
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
      >
        {label}
      </span>
      {extra && <span className="text-xs text-gray-400">{extra}</span>}
    </span>
  );
}
```

**`components/ui/Pagination.tsx`** (~40 строк):

```tsx
import Button from "@/app/components/Button";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <Button
        onClick={() => onPageChange(page - 1)}
        variant="outline"
        size="sm"
        disabled={page <= 1}
      >
        Назад
      </Button>
      <span className="text-sm text-gray-600">
        Страница {page} из {totalPages}
      </span>
      <Button
        onClick={() => onPageChange(page + 1)}
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
      >
        Вперёд
      </Button>
    </div>
  );
}
```

---

### Этап 1: Рефакторинг `ContentList.tsx` (приоритет — критический)

**Цель:** Разбить 922-строчный файл на 8+ отдельных файлов.

#### Шаг 1.1: Вынести редакторы в `app/admin/content/editors/`

Создать папку `app/admin/content/editors/` и перенести каждый редактор в отдельный файл:

| Файл                             | Компонент               | Строк (ориентир.) |
| -------------------------------- | ----------------------- | ----------------- |
| `editors/editor-types.ts`        | Общие пропсы редакторов | ~20               |
| `editors/LogoSectionEditor.tsx`  | `LogoSectionEditor`     | ~120              |
| `editors/ServicesEditor.tsx`     | `ServicesEditor`        | ~140              |
| `editors/CasesEditor.tsx`        | `CasesEditor`           | ~120              |
| `editors/ProposalEditor.tsx`     | `ProposalEditor`        | ~60               |
| `editors/JsonEditor.tsx`         | `JsonEditor`            | ~40               |
| `editors/CreateContentBlock.tsx` | `CreateContentBlock`    | ~60               |
| `editors/ImageHint.tsx`          | `ImageHint`             | ~15               |

**`editors/editor-types.ts`** — общий интерфейс:

```ts
import type { ContentBlock } from "@/types/content";

export interface EditorProps {
  block: ContentBlock;
  onSave: (data: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
}
```

#### Шаг 1.2: Упростить `ContentList.tsx`

После выноса редакторов `ContentList.tsx` будет содержать только:

- Интерфейс `ContentBlock` (заменить импортом из `types/content.ts`)
- Функцию `ContentList` (список блоков + навигация к редакторам)
- Функцию `renderEditor` (switch по slug — делегирует редакторам)

**Ожидаемый результат:** ~80–100 строк.

#### Шаг 1.3: Убрать дублирование `onCancel`

В `renderEditor` повторяется `onCancel`:

```tsx
// Было (4 раза одинаковый callback):
onCancel={() => { setEditingSlug(null); setEditingBlock(null); }}

// Стало (одна функция):
const handleCancel = useCallback(() => {
  setEditingSlug(null);
  setEditingBlock(null);
}, []);
```

---

### Этап 2: Рефакторинг `DashboardClient.tsx`

**Цель:** Разбить 203-строчный файл на 3 карточки.

#### Шаг 2.1: Создать подкомпоненты

```
app/dashboard/
├── DashboardClient.tsx        # ~30 строк — компоновщик
├── UserInfoCard.tsx           # ~50 строк — информация о пользователе
├── PasswordChangeCard.tsx     # ~80 строк — форма смены пароля
└── SecurityCard.tsx           # ~40 строк — 2FA + кнопка выхода
```

**`DashboardClient.tsx`** (после рефакторинга):

```tsx
export default function DashboardClient({ user }: DashboardClientProps) {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Личный кабинет</h1>
      <UserInfoCard user={user} />
      <PasswordChangeCard />
      <SecurityCard />
    </div>
  );
}
```

---

### Этап 3: Рефакторинг `UsersList.tsx`

**Цель:** Разбить 256-строчный файл на фильтры, таблицу и пагинацию.

#### Шаг 3.1: Вынести подкомпоненты

```
app/admin/users/
├── UsersList.tsx           # ~60 строк — компоновщик + state
├── UsersFilters.tsx        # ~50 строк — форма фильтров
├── UsersTable.tsx          # ~80 строк — таблица
└── (Pagination из ui/)    # переиспользовать общий
```

#### Шаг 3.2: Использовать общие константы

Заменить локальные `roleLabels` и `roleColors` на импорт из `constants/roles.ts`.

---

### Этап 4: Рефакторинг `Form.tsx`

**Цель:** Привести к паттерну с `react-hook-form` + zod (как в других формах).

#### Шаг 4.1: Создать хук `useContactForm`

```
app/components/sections/ContactForm/
├── ContactForm.tsx         # Клиентский компонент
└── useContactForm.ts       # Хук с логикой
```

**`useContactForm.ts`**:

```ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Имя обязательно"),
  email: z.string().email("Введите корректный email"),
  message: z.string().min(1, "Сообщение обязательно"),
});

type ContactInput = z.infer<typeof contactSchema>;

export function useContactForm() {
  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  // ... логика отправки

  return { form, onSubmit, isSubmitting, error, success };
}
```

#### Шаг 4.2: Использовать `Alert` из `components/ui`

Заменить ручные блоки ошибок/успеха на универсальный `Alert`.

---

### Этап 5: Рефакторинг `TwoFactorSetup.tsx`

**Цель:** Разбить 245-строчный файл.

#### Шаг 5.1: Вынести `Disable2FA` в отдельный файл

```
app/components/auth/TwoFactorSetup/
├── TwoFactorSetup.tsx      # ~80 строк — основной компонент
├── SetupWizard.tsx          # ~80 строк — пошаговый мастер
└── Disable2FA.tsx           # ~60 строк — отдельный компонент
```

---

### Этап 6: Рефакторинг `auth-actions.ts`

**Цель:** Уменьшить за счёт выноса бизнес-логики в сервисы.

#### Шаг 6.1: Создать сервисный слой

**`lib/services/user.service.ts`**:

```ts
export async function findUserByEmail(email: string) { ... }
export async function createUser(data: CreateUserInput) { ... }
export async function updateUserPassword(userId: string, hashedPassword: string) { ... }
```

**`lib/services/content.service.ts`**:

```ts
export async function getContentBlock(slug: string) { ... }
export async function updateContentBlock(slug: string, data: UpdateContentInput) { ... }
export async function createContentBlock(data: CreateContentInput) { ... }
```

#### Шаг 6.2: Разделить `admin-actions.ts`

```
lib/actions/
├── auth-actions.ts          # Только auth-действия
├── admin-actions.ts         # Только user-управление
└── content-actions.ts       # 🆕 Только content-управление
```

---

### Этап 7: Рефакторинг `Footer.tsx`

**Цель:** Использовать общие константы ролей.

#### Шаг 7.1: Заменить хардкод ролей

```tsx
// Было:
const isAdmin = session?.user?.role
  ? ["super_admin", "admin", "moderator"].includes(session.user.role)
  : false;

// Стало:
import { ADMIN_ROLES } from "@/constants/roles";
const isAdmin = ADMIN_ROLES.includes(session?.user?.role as any);
```

---

### Этап 8: Рефакторинг `Auth` форм (мелкие улучшения)

**Цель:** Вынести повторяющуюся обёртку.

#### Шаг 8.1: Создать `AuthFormWrapper`

Все auth-формы имеют одинаковую обёртку:

```tsx
<div className="w-full max-w-md mx-auto p-6">
  <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
  {/* alerts */}
  {/* form */}
  {/* links */}
</div>
```

**`components/auth/AuthFormWrapper.tsx`** (~30 строк):

```tsx
interface AuthFormWrapperProps {
  title: string;
  error?: string | null;
  success?: string | null;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthFormWrapper({
  title,
  error,
  success,
  children,
  footer,
}: AuthFormWrapperProps) {
  return (
    <div className="w-full max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      {children}
      {footer && (
        <p className="text-center mt-6 text-sm text-gray-600">{footer}</p>
      )}
    </div>
  );
}
```

---

## 6. Пример переписанного компонента: ContentList.tsx

### До (922 строки — один файл)

```tsx
// 922 строки: ContentList + LogoSectionEditor + ServicesEditor +
// CasesEditor + ProposalEditor + JsonEditor + CreateContentBlock + ImageHint
```

### После (~90 строк — ContentList.tsx + 8 файлов в editors/)

**`app/admin/content/ContentList.tsx`** (~90 строк):

```tsx
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { updateContentBlock } from "@/lib/actions/content-actions";
import Button from "@/app/components/Button";
import type { ContentBlock } from "@/types/content";
import { StatusBadge } from "@/app/components/ui/StatusBadge";
import { STATUS_LABELS, STATUS_COLORS } from "@/constants/statuses";
import { LogoSectionEditor } from "./editors/LogoSectionEditor";
import { ServicesEditor } from "./editors/ServicesEditor";
import { CasesEditor } from "./editors/CasesEditor";
import { ProposalEditor } from "./editors/ProposalEditor";
import { JsonEditor } from "./editors/JsonEditor";
import { CreateContentBlock } from "./editors/CreateContentBlock";

interface ContentListProps {
  blocks: ContentBlock[];
  canCreate: boolean;
}

const editorMap: Record<string, React.ComponentType<EditorProps>> = {
  "logo-section": LogoSectionEditor,
  services: ServicesEditor,
  cases: CasesEditor,
  proposal: ProposalEditor,
};

export default function ContentList({ blocks, canCreate }: ContentListProps) {
  const router = useRouter();
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const handleCancel = useCallback(() => setEditingBlock(null), []);

  const handleSave = useCallback(
    async (updated: Record<string, unknown>) => {
      if (!editingBlock) return;
      const result = await updateContentBlock(editingBlock.slug, {
        content: updated,
      });
      if (result.error) {
        alert(result.error);
        return;
      }
      setEditingBlock(null);
      router.refresh();
    },
    [editingBlock, router],
  );

  if (editingBlock) {
    const Editor = editorMap[editingBlock.slug] ?? JsonEditor;
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-semibold text-lg mb-4">
          Редактирование: {editingBlock.title}
        </h3>
        <Editor
          block={editingBlock}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {canCreate && (
        <div className="mb-6">
          <Button
            onClick={() => setShowCreate(!showCreate)}
            variant="primary"
            size="md"
          >
            {showCreate ? "Отмена" : "Создать блок"}
          </Button>
        </div>
      )}
      {showCreate && (
        <CreateContentBlock
          onCreated={() => {
            setShowCreate(false);
            router.refresh();
          }}
        />
      )}
      <div className="grid gap-4">
        {blocks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500">
            Контентные блоки не найдены
          </div>
        ) : (
          blocks.map((block) => (
            <div
              key={block.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{block.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Slug: {block.slug}
                  </p>
                  <StatusBadge
                    label={STATUS_LABELS[block.status] || block.status}
                    colorClass={
                      STATUS_COLORS[block.status] || STATUS_COLORS.draft
                    }
                    extra={`v${block.version} · ${new Date(block.updatedAt).toLocaleDateString("ru-RU")}`}
                  />
                </div>
                <Button
                  onClick={() => setEditingBlock(block)}
                  variant="outline"
                  size="sm"
                >
                  Редактировать
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

---

## 7. Чек-лист для проверки

### Критерии завершения рефакторинга

#### Структура файлов

- [ ] Все компоненты ≤ 150 строк
- [ ] Общие типы вынесены в `types/`
- [ ] Общие константы вынесены в `constants/`
- [ ] UI-компоненты вынесены в `components/ui/`
- [ ] Сервисный слой создан в `lib/services/`
- [ ] Редакторы контента вынесены в `app/admin/content/editors/`
- [ ] Админ-действия разделены на `admin-actions.ts` и `content-actions.ts`

#### Качество кода

- [ ] Нет дублирования `roleLabels` / `roleColors` — используется `constants/roles.ts`
- [ ] Нет дублирования `statusLabels` / `statusColors` — используется `constants/statuses.ts`
- [ ] Нет интерфейсов `ContentBlock`, `ServiceItem` и т.д., объявленных повторно
- [ ] `Form.tsx` использует `react-hook-form` + zod (как остальные формы)
- [ ] Все auth-формы используют `AuthFormWrapper`
- [ ] Нет `any` типов — используются `Record<string, unknown>` или конкретные типы
- [ ] Серверные компоненты не используют `"use client"` / хуки состояния
- [ ] Клиентские компоненты минимально необходимы

#### Функциональность

- [ ] Все страницы работают как до рефакторинга
- [ ] Админ-панель: создание, редактирование, удаление контент-блоков
- [ ] Админ-панель: управление пользователями
- [ ] Дашборд: информация, смена пароля, 2FA
- [ ] Auth: вход, регистрация, сброс пароля, верификация email
- [ ] Главная страница: все секции отображаются корректно
- [ ] Middleware: защита маршрутов работает

#### Производительность

- [ ] Количество клиентских компонентов не увеличилось
- [ ] Server Components используются там, где возможен SSR
- [ ] Нет лишних ререндеров (React.memo используется где оправдано)
- [ ] Размер client bundle не вырос

#### Инфраструктура

- [ ] ESLint: нет ошибок (`npm run lint`)
- [ ] TypeScript: нет ошибок (`npx tsc --noEmit`)
- [ ] Build: проект собирается (`npm run build`)

---

## 8. Рекомендации по мемоизации

### Где оправдано

1. **`Footer.tsx`** — серверный компонент, мемоизация не нужна (рендерится на сервере)

2. **`Navbar.tsx`** — `navLinks` вынесен за пределы компонента (уже сделано ✅). Можно обернуть в `useMemo` если компонент будет перерендериваться.

3. **`ServiceCard`, `CaseCard`** — обернуть в `React.memo`, так как они статичные и рендерятся в списке:

```tsx
const ServiceCard = React.memo(function ServiceCard({ ... }: ServiceCardProps) { ... });
```

4. **`handleSave`, `handleCancel`** в `ContentList` — обернуть в `useCallback` (уже сделано в плане ✅)

5. **`roleLabels`, `roleColors`** — вынести за пределы компонентов (уже сделано в плане ✅)

### Где НЕ оправдано

- `SafeImage` — не мемоизировать (зависит от `error` state, который часто меняется)
- `Alert`, `StatusBadge`, `Pagination` — простые компоненты, мемоизация избыточна
- Серверные компоненты — мемоизация не применяется

---

## 9. Использование Server Components

### Текущее использование (хорошее)

- ✅ `Cases.tsx` — `async function Cases()` — серверный компонент
- ✅ `Services.tsx` — `async function Services()` — серверный компонент
- ✅ `Proposal.tsx` — `async function Proposal()` — серверный компонент
- ✅ `LogoSection.tsx` — `async function LogoSection()` — серверный компонент
- ✅ `Footer.tsx` — `async function Footer()` — серверный компонент

### Рекомендации по улучшению

1. **`ContentList.tsx`** — страница `/admin/content/page.tsx` может быть серверным компонентом, который передаёт `blocks` в клиентский `ContentList`:

```tsx
// app/admin/content/page.tsx (серверный)
import { getContentBlocks } from "@/lib/actions/admin-actions";
import ContentList from "./ContentList";

export default async function ContentPage() {
  const { blocks } = await getContentBlocks();
  const session = await auth();
  const canCreate = ADMIN_ROLES.includes(session?.user?.role as any);
  return <ContentList blocks={blocks} canCreate={canCreate} />;
}
```

2. **`UsersList.tsx`** — можно рассмотреть загрузку данных на сервере, но поскольку есть клиентская фильтрация и пагинация, клиентский компонент с `useEffect` оправдан до внедрения SWR/React Query.

3. **API Routes** (`app/api/content/*/route.ts`) — дублируют логику серверных компонентов. Рекомендуется либо оставить только Server Actions, либо оставить API routes для внешних потребителей.

---

## 10. Приоритеты внедрения

| Приоритет | Этап                                       | Ожидаемый эффект               | Сложность |
| --------- | ------------------------------------------ | ------------------------------ | --------- |
| 🔴 P0     | Этап 0: Подготовка (типы, константы, UI)   | Устраняет дублирование         | Низкая    |
| 🔴 P0     | Этап 1: ContentList.tsx                    | -830 строк, 8 файлов           | Средняя   |
| 🟡 P1     | Этап 2: DashboardClient.tsx                | -120 строк, 3 файла            | Низкая    |
| 🟡 P1     | Этап 3: UsersList.tsx                      | -150 строк, 3 файла            | Низкая    |
| 🟡 P1     | Этап 4: Form.tsx                           | Единообразие с react-hook-form | Низкая    |
| 🟢 P2     | Этап 5: TwoFactorSetup.tsx                 | -100 строк, 3 файла            | Низкая    |
| 🟢 P2     | Этап 6: auth-actions.ts + admin-actions.ts | Сервисный слой                 | Средняя   |
| 🟢 P2     | Этап 7: Footer.tsx                         | Устранение хардкода            | Низкая    |
| 🟢 P2     | Этап 8: Auth формы                         | Переиспользуемая обёртка       | Низкая    |

**Общая ожидаемая трудозатратность:** 2–3 дня работы.

---

## 11. Риски и митигация

| Риск                                          | Митигация                                                                         |
| --------------------------------------------- | --------------------------------------------------------------------------------- |
| Сломать существующую функциональность         | Поэтапный рефакторинг, тестирование после каждого этапа                           |
| Увеличить размер bundle                       | Использовать Server Components, не добавлять клиентские обёртки без необходимости |
| Усложнить навигацию по файлам                 | Чёткая структура папок с описательными именами                                    |
| Конфликты при работе нескольких разработчиков | Рефакторить по модулям, мержить поэтапно                                          |
