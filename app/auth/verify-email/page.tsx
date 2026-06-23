"use client";

import { verifyEmail } from "@/lib/actions/auth-actions";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Button from "@/app/components/Button";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Недействительная ссылка подтверждения");
      return;
    }

    verifyEmail(token).then((result) => {
      if (result.error) {
        setStatus("error");
        setMessage(result.error);
      } else {
        setStatus("success");
        setMessage(result.message || "Email успешно подтверждён!");
      }
    });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md mx-auto p-6 text-center">
        {status === "loading" && (
          <div>
            <div className="animate-spin h-10 w-10 border-4 border-default-lime border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600">Подтверждение email...</p>
          </div>
        )}

        {status === "success" && (
          <div>
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-6 rounded-xl mb-4">
              <h2 className="text-xl font-bold mb-2">Email подтверждён!</h2>
              <p>{message}</p>
            </div>
            <Button
              onClick={() => router.push("/auth/login")}
              variant="primary"
              size="fluid"
              className="w-full"
            >
              Войти в систему
            </Button>
          </div>
        )}

        {status === "error" && (
          <div>
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-6 rounded-xl mb-4">
              <h2 className="text-xl font-bold mb-2">Ошибка</h2>
              <p>{message}</p>
            </div>
            <Link
              href="/auth/login"
              className="text-black font-medium hover:underline"
            >
              Вернуться ко входу
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Загрузка...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
