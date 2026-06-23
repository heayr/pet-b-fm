"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/validations";
import { forgotPasswordAction } from "@/lib/actions/auth-actions";
import { useState } from "react";
import Link from "next/link";
import Button from "@/app/components/Button";
import { AuthFormWrapper } from "@/app/components/auth/AuthFormWrapper";

export default function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const result = await forgotPasswordAction(data);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    setSuccess(
      result.message ||
        "Если пользователь с таким email существует, ему отправлена ссылка для сброса пароля.",
    );
    setIsLoading(false);
  };

  return (
    <AuthFormWrapper
      title="Сброс пароля"
      error={error}
      success={success}
      footer={
        <Link
          href="/auth/login"
          className="text-black font-medium hover:underline"
        >
          Вернуться ко входу
        </Link>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder="your@email.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-default-lime"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="fluid"
          className="w-full"
          loading={isLoading}
        >
          Отправить ссылку
        </Button>
      </form>
    </AuthFormWrapper>
  );
}
