# Этап сборки
FROM node:22-alpine AS builder

# Устанавливаем OpenSSL для Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Копируем файлы зависимостей
COPY package.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем Prisma schema и генерируем клиент
COPY prisma/schema.prisma ./prisma/
RUN npx prisma generate

# Копируем код проекта
COPY . .

# Собираем Next.js приложение
RUN npm run build

# Финальный этап
FROM node:22-alpine

# Устанавливаем OpenSSL для Prisma (migrate deploy требует его на этапе runtime)
RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV production

# Копируем только необходимые файлы
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["npm", "start"]