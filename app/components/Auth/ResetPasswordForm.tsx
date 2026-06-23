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
import { AuthFormWrapper } from "@/app/components/auth/AuthFormWrapper";
import { FormField } from "@/app/components/ui/FormField";

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
      <AuthFormWrapper
        title="Сброс пароля"
        footer={
          <Link
            href="/auth/forgot-password"
            className="text-black font-medium hover:underline"
          >
            Запросить новую ссылку
          </Link>
        }
      >
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-xl">
          Недействительная ссылка для сброса пароля. Пожалуйста, запросите
          новую.
        </div>
      </AuthFormWrapper>
    );
  }

  return (
    <AuthFormWrapper
      title="Новый пароль"
      error={error}
      success={
        success
          ? `${success} Войти в систему можно по ссылке ниже.`
          : undefined
      }
      footer={
        <Link
          href="/auth/login"
          className="text-black font-medium hover:underline"
        >
          Вернуться ко входу
        </Link>
      }
    >
      {!success && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register("token")} />

          <FormField label="Новый пароль" id="password" error={errors.password?.message}>
            <input
              {...register("password")}
              type="password"
              placeholder="Минимум 6 символов"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-default-lime"
            />
          </FormField>

          <FormField label="Подтверждение пароля" id="confirmPassword" error={errors.confirmPassword?.message}>
            <input
              {...register("confirmPassword")}
              type="password"
              placeholder="Повторите пароль"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-default-lime"
            />
          </FormField>

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
    </AuthFormWrapper>
  );
}