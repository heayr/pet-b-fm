"use client";

import { useState, useEffect } from "react";
import { setup2FA, confirm2FA, disable2FA } from "@/lib/actions/auth-actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { twoFactorSchema, type TwoFactorInput } from "@/lib/validations";
import { useSession } from "next-auth/react";
import Button from "@/app/components/Button";

export default function TwoFactorSetup() {
  const { data: session, update: updateSession } = useSession();
  const [step, setStep] = useState<"check" | "show_secret" | "verify" | "done">(
    "check",
  );
  const [secret, setSecret] = useState<string>("");
  const [otpauthUrl, setOtpauthUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TwoFactorInput>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: { code: "" },
  });

  if (!session?.user) return null;

  if (session.user.isTwoFactorEnabled) {
    return (
      <div className="p-6 bg-white rounded-2xl border border-gray-200">
        <h3 className="text-lg font-semibold mb-2">
          Двухфакторная аутентификация
        </h3>
        <p className="text-green-600 mb-4">2FA включена</p>
        <Disable2FA />
      </div>
    );
  }

  const handleSetup = async () => {
    setIsLoading(true);
    setError(null);

    const result = await setup2FA();
    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    setSecret(result.secret!);
    setOtpauthUrl(result.otpauth_url!);
    setStep("show_secret");
    setIsLoading(false);
  };

  const handleConfirm = async (data: TwoFactorInput) => {
    setIsLoading(true);
    setError(null);

    const result = await confirm2FA({ ...data, secret });
    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    setStep("done");
    setIsLoading(false);
    await updateSession();
  };

  if (step === "check") {
    return (
      <div className="p-6 bg-white rounded-2xl border border-gray-200">
        <h3 className="text-lg font-semibold mb-2">
          Двухфакторная аутентификация
        </h3>
        <p className="text-gray-600 mb-4">
          Защитите свой аккаунт с помощью 2FA. Потребуется приложение для
          аутентификации (Google Authenticator, Apple Passwords и т.д.).
        </p>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}
        <Button
          onClick={handleSetup}
          variant="primary"
          size="fluid"
          loading={isLoading}
        >
          Настроить 2FA
        </Button>
      </div>
    );
  }

  if (step === "show_secret") {
    return (
      <div className="p-6 bg-white rounded-2xl border border-gray-200">
        <h3 className="text-lg font-semibold mb-2">Настройка 2FA</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-4">
          <li>Установите приложение для аутентификации</li>
          <li>Отсканируйте QR-код или введите секретный ключ вручную</li>
        </ol>

        <div className="bg-gray-50 p-4 rounded-xl mb-4 text-center">
          {otpauthUrl && (
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthUrl)}`}
                alt="QR Code для 2FA"
                className="mx-auto mb-3"
              />
              <p className="text-xs text-gray-500 break-all font-mono">
                {secret}
              </p>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-4">
          После настройки приложения введите код подтверждения
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(handleConfirm)} className="space-y-4">
          <div>
            <input
              {...register("code")}
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-default-lime"
            />
            {errors.code && (
              <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
            )}
          </div>
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
      </div>
    );
  }

  // step === "done"
  return (
    <div className="p-6 bg-white rounded-2xl border border-gray-200">
      <h3 className="text-lg font-semibold mb-2">
        Двухфакторная аутентификация
      </h3>
      <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
        2FA успешно включена!
      </div>
    </div>
  );
}

function Disable2FA() {
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
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}
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
