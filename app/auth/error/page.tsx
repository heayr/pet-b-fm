"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import Button from "@/app/components/Button";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams?.get("error") ?? null;

  const errorMessages: Record<string, string> = {
    Configuration: "Ошибка конфигурации сервера.",
    AccessDenied: "Доступ запрещён.",
    Verification: "Ошибка верификации. Ссылка устарела или недействительна.",
    Default: "Произошла ошибка при аутентификации.",
    CredentialsSignin: "Неверный email или пароль.",
  };

  const message = error
    ? errorMessages[error] || errorMessages.Default
    : errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md mx-auto p-6 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-6 rounded-xl mb-4">
          <h2 className="text-xl font-bold mb-2">Ошибка входа</h2>
          <p>{message}</p>
        </div>
        <div className="flex gap-3 justify-center">
          <Link href="/auth/login">
            <Button variant="primary" size="md">
              Вернуться ко входу
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="md">
              На главную
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Загрузка...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
}
