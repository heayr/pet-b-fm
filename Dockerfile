# Этап сборки
FROM node:24-alpine AS builder

WORKDIR /app

# Копируем файлы зависимостей
COPY package.json yarn.lock ./

# Устанавливаем зависимости
RUN yarn install --frozen-lockfile

# Копируем код проекта
COPY . .

# Собираем Next.js приложение
RUN yarn build

# Финальный этап
FROM node:24-alpine

WORKDIR /app

ENV NODE_ENV production

# Копируем только необходимые файлы
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["yarn", "start"]