"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validations";
import { resetPasswordAction } from "@/lib/actions/auth-actions";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Button from "@/app/components/Button";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") || "";

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const result = await resetPasswordAction(data);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    setSuccess(result.message || "Пароль успешно изменён!");
    setIsLoading(false);
  };

  if (!token) {
    return (
      <div className="w-full max-w-md mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Сброс пароля</h2>
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-xl">
          Недействительная ссылка для сброса пароля. Пожалуйста, запросите
          новую.
        </div>
        <p className="text-center mt-6">
          <Link
            href="/auth/forgot-password"
            className="text-black font-medium hover:underline"
          >
            Запросить новую ссылку
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Новый пароль</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4">
          {success}
          <div className="mt-3">
            <Link
              href="/auth/login"
              className="text-green-800 font-medium underline"
            >
              Войти в систему
            </Link>
          </div>
        </div>
      )}

      {!success && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register("token")} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Новый пароль
            </label>
            <input
              {...register("password")}
              type="password"
              placeholder="Минимум 6 символов"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-default-lime"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Подтверждение пароля
            </label>
            <input
              {...register("confirmPassword")}
              type="password"
              placeholder="Повторите пароль"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-default-lime"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="fluid"
            className="w-full"
            loading={isLoading}
          >
            Сохранить новый пароль
          </Button>
        </form>
      )}
    </div>
  );
}
