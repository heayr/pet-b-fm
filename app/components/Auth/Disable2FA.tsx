"use client";

import { useState } from "react";
import { disable2FA } from "@/lib/actions/auth-actions";
import { useSession } from "next-auth/react";
import Button from "@/app/components/Button";
import { Alert } from "@/app/components/ui/Alert";

export function Disable2FA() {
  const { update: updateSession } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} variant="outline" size="sm">
        Отключить 2FA
      </Button>
    );
  }

  const handleDisable = async () => {
    setIsLoading(true);
    setError(null);

    const result = await disable2FA({ code });
    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    setIsOpen(false);
    setIsLoading(false);
    await updateSession();
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">
        Введите код из приложения для отключения 2FA
      </p>
      {error && <Alert variant="error">{error}</Alert>}
      <div className="flex gap-2">
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="000000"
          className="flex-1 px-4 py-2 text-center tracking-widest border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-default-lime"
        />
        <Button
          onClick={handleDisable}
          variant="primary"
          size="md"
          loading={isLoading}
        >
          Отключить
        </Button>
        <Button onClick={() => setIsOpen(false)} variant="ghost" size="md">
          Отмена
        </Button>
      </div>
    </div>
  );
}
