"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  passwordChangeSchema,
  type PasswordChangeInput,
} from "@/lib/validations";
import { changePassword } from "@/lib/actions/auth-actions";
import { signOut } from "next-auth/react";
import Button from "@/app/components/Button";
import TwoFactorSetup from "@/app/components/Auth/TwoFactorSetup";

interface DashboardClientProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role: string;
    isTwoFactorEnabled: boolean;
  };
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordChangeInput>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmitPassword = async (data: PasswordChangeInput) => {
    setIsLoading(true);
    setPasswordError(null);
    setPasswordSuccess(null);

    const result = await changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });

    if (result.error) {
      setPasswordError(result.error);
      setIsLoading(false);
      return;
    }

    setPasswordSuccess(result.message || "Пароль успешно изменён!");
    reset();
    setIsLoading(false);
  };

  const roleLabels: Record<string, string> = {
    super_admin: "Супер-администратор",
    admin: "Администратор",
    moderator: "Модератор",
    user: "Пользователь",
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Личный кабинет</h1>

      {/* Информация о пользователе */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Информация</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-500">Имя</span>
            <p className="font-medium">{user.name || "Не указано"}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Email</span>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Роль</span>
            <p className="font-medium">{roleLabels[user.role] || user.role}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">2FA</span>
            <p className="font-medium">
              {user.isTwoFactorEnabled ? "Включена" : "Отключена"}
            </p>
          </div>
        </div>

        {["super_admin", "admin", "moderator"].includes(user.role) && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Button href="/admin/users" variant="outline" size="md">
              Панель управления
            </Button>
          </div>
        )}
      </div>

      {/* Смена пароля */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Смена пароля</h2>

        {passwordError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
            {passwordError}
          </div>
        )}

        {passwordSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4">
            {passwordSuccess}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Текущий пароль
            </label>
            <input
              {...register("currentPassword")}
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-default-lime"
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Новый пароль
            </label>
            <input
              {...register("newPassword")}
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-default-lime"
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Подтверждение нового пароля
            </label>
            <input
              {...register("confirmNewPassword")}
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-default-lime"
            />
            {errors.confirmNewPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmNewPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="fluid"
            className="w-full md:w-auto"
            loading={isLoading}
          >
            Сменить пароль
          </Button>
        </form>
      </div>

      {/* 2FA Настройка */}
      <div className="mb-6">
        <TwoFactorSetup />
      </div>

      {/* Выход */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <Button
          onClick={() => signOut({ callbackUrl: "/" })}
          variant="outline"
          size="md"
        >
          Выйти из системы
        </Button>
      </div>
    </div>
  );
}
