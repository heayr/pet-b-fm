"use server";

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { db } from "@/lib/db";
import { auth, signIn } from "@/auth";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  twoFactorSchema,
  type LoginInput,
  type RegisterInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
  type TwoFactorInput,
} from "@/lib/validations";
import { sendEmail, generateVerificationEmail, generatePasswordResetEmail } from "@/lib/mailer";
import { rateLimit } from "@/lib/rate-limit";
import { createAuditLog } from "@/lib/audit";
import { AuthError } from "next-auth";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function registerUser(input: RegisterInput) {
  const validated = registerSchema.safeParse(input);
  if (!validated.success) {
    return { error: validated.error.errors[0]?.message || "Ошибка валидации" };
  }

  const { name, email, password } = validated.data;

  // Rate limiting по email
  const ip = "global"; // В продакшне можно передавать реальный IP
  const rateResult = await rateLimit(`register:${email}`, { interval: 60000, maxRequests: 3 });
  if (!rateResult.success) {
    return { error: "Слишком много попыток. Попробуйте позже." };
  }

  // Проверяем, не занят ли email
  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: "Пользователь с таким email уже существует" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // Создаём токен верификации email
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 часа

  await db.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
      type: "email",
    },
  });

  // Отправляем письмо с подтверждением
  await sendEmail({
    to: email,
    subject: "Подтверждение email — Радиоточка",
    html: generateVerificationEmail(name, token, APP_URL),
  });

  await createAuditLog({
    userId: user.id,
    action: "register",
    entity: "user",
    entityId: user.id,
  });

  return {
    success: true,
    message: "Регистрация успешна! Проверьте email для подтверждения.",
  };
}

export async function verifyEmail(token: string) {
  const verificationToken = await db.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken) {
    return { error: "Недействительный токен" };
  }

  if (verificationToken.expires < new Date()) {
    await db.verificationToken.delete({ where: { id: verificationToken.id } });
    return { error: "Срок действия токена истёк. Запросите новый." };
  }

  if (verificationToken.type !== "email") {
    return { error: "Неверный тип токена" };
  }

  await db.user.update({
    where: { email: verificationToken.identifier },
    data: { emailVerified: new Date() },
  });

  await db.verificationToken.delete({ where: { id: verificationToken.id } });

  return { success: true, message: "Email успешно подтверждён!" };
}

export async function loginUser(input: LoginInput) {
  const validated = loginSchema.safeParse(input);
  if (!validated.success) {
    return { error: validated.error.errors[0]?.message || "Ошибка валидации" };
  }

  const { email, password, code } = validated.data;

  const rateResult = await rateLimit(`login:${email}`, { interval: 60000, maxRequests: 5 });
  if (!rateResult.success) {
    return { error: "Слишком много попыток входа. Попробуйте через минуту." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      code: code || undefined,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Неверный email или пароль" };
        default:
          if ((error as any)?.cause?.err?.message === "TwoFactorRequired") {
            return { twoFactorRequired: true, email };
          }
          if ((error as any)?.cause?.err?.message === "EmailNotVerified") {
            return { error: "Пожалуйста, подтвердите email перед входом" };
          }
          if ((error as any)?.cause?.err?.message === "AccountBlocked") {
            return { error: "Ваш аккаунт заблокирован. Обратитесь к администратору." };
          }
          return { error: "Ошибка входа" };
      }
    }
    throw error;
  }

  // Получаем пользователя для аудита
  const user = await db.user.findUnique({ where: { email } });
  if (user) {
    await createAuditLog({
      userId: user.id,
      action: "login",
      entity: "user",
      entityId: user.id,
    });
  }

  return { success: true, message: "Вход выполнен успешно!" };
}

export async function forgotPasswordAction(input: ForgotPasswordInput) {
  const validated = forgotPasswordSchema.safeParse(input);
  if (!validated.success) {
    return { error: validated.error.errors[0]?.message || "Ошибка валидации" };
  }

  const { email } = validated.data;

  const rateResult = await rateLimit(`forgot:${email}`, { interval: 60000, maxRequests: 2 });
  if (!rateResult.success) {
    return { error: "Слишком много запросов. Попробуйте через минуту." };
  }

  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    // Не сообщаем, существует пользователь или нет (безопасность)
    return { success: true, message: "Если пользователь с таким email существует, ему отправлена ссылка для сброса пароля." };
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 час

  await db.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
      type: "passwordReset",
    },
  });

  await sendEmail({
    to: email,
    subject: "Сброс пароля — Радиоточка",
    html: generatePasswordResetEmail(user.name || "Пользователь", token, APP_URL),
  });

  await createAuditLog({
    userId: user.id,
    action: "password_reset_request",
    entity: "user",
    entityId: user.id,
  });

  return { success: true, message: "Если пользователь с таким email существует, ему отправлена ссылка для сброса пароля." };
}

export async function resetPasswordAction(input: ResetPasswordInput) {
  const validated = resetPasswordSchema.safeParse(input);
  if (!validated.success) {
    return { error: validated.error.errors[0]?.message || "Ошибка валидации" };
  }

  const { token, password } = validated.data;

  const verificationToken = await db.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken) {
    return { error: "Недействительный токен" };
  }

  if (verificationToken.expires < new Date()) {
    await db.verificationToken.delete({ where: { id: verificationToken.id } });
    return { error: "Срок действия токена истёк. Запросите новый сброс." };
  }

  if (verificationToken.type !== "passwordReset") {
    return { error: "Неверный тип токена" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await db.user.update({
    where: { email: verificationToken.identifier },
    data: { password: hashedPassword },
  });

  await db.verificationToken.delete({ where: { id: verificationToken.id } });

  await createAuditLog({
    userId: (await db.user.findUnique({ where: { email: verificationToken.identifier } }))!.id,
    action: "password_change",
    entity: "user",
  });

  return { success: true, message: "Пароль успешно изменён! Теперь вы можете войти." };
}

export async function setup2FA() {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "Не авторизован" };
  }

  const user = await db.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return { error: "Пользователь не найден" };
  }

  // Генерируем TOTP секрет
  const speakeasy = await import("speakeasy");
  const secret = speakeasy.generateSecret({
    name: `Радиоточка:${user.email}`,
    length: 20,
  });

  // Временно сохраняем секрет (не активируем 2FA до подтверждения)
  // Пользователь должен подтвердить, введя код
  return {
    success: true,
    secret: secret.base32,
    otpauth_url: secret.otpauth_url,
  };
}

export async function confirm2FA(input: TwoFactorInput & { secret: string }) {
  const validated = twoFactorSchema.safeParse(input);
  if (!validated.success) {
    return { error: validated.error.errors[0]?.message || "Ошибка валидации" };
  }

  const session = await auth();
  if (!session?.user?.email) {
    return { error: "Не авторизован" };
  }

  const speakeasy = await import("speakeasy");
  const isValid = speakeasy.totp.verify({
    secret: input.secret,
    encoding: "base32",
    token: input.code,
    window: 1,
  });

  if (!isValid) {
    return { error: "Неверный код. Попробуйте ещё раз." };
  }

  await db.user.update({
    where: { email: session.user.email },
    data: {
      twoFactorSecret: input.secret,
      isTwoFactorEnabled: true,
    },
  });

  await createAuditLog({
    userId: session.user.id,
    action: "2fa_enabled",
    entity: "user",
    entityId: session.user.id,
  });

  return { success: true, message: "2FA успешно включена!" };
}

export async function disable2FA(input: { code: string }) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "Не авторизован" };
  }

  const user = await db.user.findUnique({ where: { email: session.user.email } });
  if (!user?.twoFactorSecret) {
    return { error: "2FA не настроена" };
  }

  const speakeasy = await import("speakeasy");
  const isValid = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token: input.code,
    window: 1,
  });

  if (!isValid) {
    return { error: "Неверный код" };
  }

  await db.user.update({
    where: { email: session.user.email },
    data: {
      twoFactorSecret: null,
      isTwoFactorEnabled: false,
    },
  });

  await createAuditLog({
    userId: session.user.id,
    action: "2fa_disabled",
    entity: "user",
    entityId: session.user.id,
  });

  return { success: true, message: "2FA отключена!" };
}

export async function verifyTwoFactor(input: TwoFactorInput & { email: string }) {
  const validated = twoFactorSchema.safeParse(input);
  if (!validated.success) {
    return { error: validated.error.errors[0]?.message || "Ошибка валидации" };
  }

  const { email } = input;
  const { code } = validated.data;

  const user = await db.user.findUnique({ where: { email } });
  if (!user?.twoFactorSecret) {
    return { error: "2FA не настроена" };
  }

  const speakeasy = await import("speakeasy");
  const isValid = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token: code,
    window: 1,
  });

  if (isValid) {
    return { success: true };
  }

  // Проверяем по резервным кодам
  const storedToken = await db.twoFactorToken.findFirst({
    where: {
      email,
      token: code,
      expires: { gt: new Date() },
    },
  });

  if (storedToken) {
    await db.twoFactorToken.delete({ where: { id: storedToken.id } });
    return { success: true };
  }

  return { error: "Неверный код подтверждения" };
}

export async function changePassword(input: { currentPassword: string; newPassword: string }) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "Не авторизован" };
  }

  const user = await db.user.findUnique({ where: { email: session.user.email } });
  if (!user?.password) {
    return { error: "Невозможно сменить пароль" };
  }

  const isValid = await bcrypt.compare(input.currentPassword, user.password);
  if (!isValid) {
    return { error: "Неверный текущий пароль" };
  }

  const hashedPassword = await bcrypt.hash(input.newPassword, 12);

  await db.user.update({
    where: { email: session.user.email },
    data: { password: hashedPassword },
  });

  await createAuditLog({
    userId: session.user.id,
    action: "password_change",
    entity: "user",
    entityId: session.user.id,
  });

  return { success: true, message: "Пароль успешно изменён!" };
}