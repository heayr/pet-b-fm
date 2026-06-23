"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/app/components/Button";
import { Alert } from "@/app/components/ui/Alert";
import { AuthFormWrapper } from "@/app/components/auth/AuthFormWrapper";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      email,
      password,
      code: code || undefined,
      redirect: false,
    });

    if (res?.error) {
      if (res.error === "TwoFactorRequired") {
        setTwoFactorRequired(true);
        setIsLoading(false);
        return;
      }
      setError(res.error);
      setIsLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  if (twoFactorRequired) {
    return (
      <AuthFormWrapper title="Двухфакторная аутентификация">
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-default-lime"
          />
          <Button
            type="submit"
            variant="primary"
            size="fluid"
            className="w-full"
            loading={isLoading}
          >
            Подтвердить
          </Button>
        </form>
      </AuthFormWrapper>
    );
  }

  return (
    <AuthFormWrapper
      title="Вход в систему"
      error={error}
      footer={
        <Link
          href="/auth/register"
          className="text-black font-medium hover:underline"
        >
          Зарегистрироваться
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-default-lime"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Пароль
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-default-lime"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="fluid"
          className="w-full"
          loading={isLoading}
        >
          Войти
        </Button>
      </form>
    </AuthFormWrapper>
  );
}
