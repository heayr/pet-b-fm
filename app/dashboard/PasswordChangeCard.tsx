"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  passwordChangeSchema,
  type PasswordChangeInput,
} from "@/lib/validations";
import { changePassword } from "@/lib/actions/auth-actions";
import Button from "@/app/components/Button";
import { Alert } from "@/app/components/ui/Alert";

export function PasswordChangeCard() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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
    setError(null);
    setSuccess(null);

    const result = await changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    setSuccess(result.message || "Пароль успешно изменён!");
    reset();
    setIsLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Смена пароля</h2>

      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

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
  );
}
