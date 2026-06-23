import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email обязателен")
    .email("Введите корректный email"),
  password: z
    .string()
    .min(1, "Пароль обязателен")
    .min(6, "Пароль должен быть не менее 6 символов"),
  code: z.optional(z.string().length(6, "Код должен содержать 6 цифр")),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Имя обязательно")
      .max(50, "Имя не должно превышать 50 символов"),
    email: z
      .string()
      .min(1, "Email обязателен")
      .email("Введите корректный email"),
    password: z
      .string()
      .min(6, "Пароль должен быть не менее 6 символов")
      .max(100, "Пароль слишком длинный"),
    confirmPassword: z.string().min(1, "Подтвердите пароль"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email обязателен")
    .email("Введите корректный email"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Токен обязателен"),
    password: z
      .string()
      .min(6, "Пароль должен быть не менее 6 символов")
      .max(100, "Пароль слишком длинный"),
    confirmPassword: z.string().min(1, "Подтвердите пароль"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export const twoFactorSchema = z.object({
  code: z
    .string()
    .length(6, "Код должен содержать 6 цифр")
    .regex(/^\d{6}$/, "Код должен состоять только из цифр"),
});

export const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(1, "Имя обязательно")
    .max(50, "Имя не должно превышать 50 символов"),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Текущий пароль обязателен"),
    newPassword: z
      .string()
      .min(6, "Новый пароль должен быть не менее 6 символов")
      .max(100, "Пароль слишком длинный"),
    confirmNewPassword: z.string().min(1, "Подтвердите новый пароль"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Пароли не совпадают",
    path: ["confirmNewPassword"],
  });

export const adminUpdateUserSchema = z.object({
  name: z.string().optional(),
  role: z.enum(["super_admin", "admin", "moderator", "user"]).optional(),
  isActive: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
});

export const contentBlockSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug обязателен")
    .regex(/^[a-z0-9-]+$/, "Slug может содержать только латиницу, цифры и дефисы"),
  title: z.string().min(1, "Название обязательно"),
  content: z.any(),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type TwoFactorInput = z.infer<typeof twoFactorSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;
export type AdminUpdateUserInput = z.infer<typeof adminUpdateUserSchema>;
export type ContentBlockInput = z.infer<typeof contentBlockSchema>;