"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { registerUser } from "@/lib/actions/auth-actions";
import { useState } from "react";
import Link from "next/link";
import Button from "@/app/components/Button";
import { AuthFormWrapper } from "@/app/components/auth/AuthFormWrapper";
import { FormField } from "@/app/components/ui/FormField";

export default function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const result = await registerUser(data);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    setSuccess(result.message || "Регистрация успешна!");
    setIsLoading(false);
  };

  return (
    <AuthFormWrapper
      title="Регистрация"
      error={error}
      success={success}
      footer={
        <span>
          Уже есть аккаунт?{" "}
          <Link
            href="/auth/login"
            className="text-black font-medium hover:underline"
          >
            Войти
          </Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Имя" id="name" error={errors.name?.message}>
          <input
            {...register("name")}
            type="text"
            placeholder="Иван Иванов"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-default-lime"
          />
        </FormField>

        <FormField label="Email" id="email" error={errors.email?.message}>
          <input
            {...register("email")}
            type="email"
            placeholder="your@email.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-default-lime"
          />
        </FormField>

        <FormField label="Пароль" id="password" error={errors.password?.message}>
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
          Зарегистрироваться
        </Button>
      </form>
    </AuthFormWrapper>
  );
}