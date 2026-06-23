import ResetPasswordForm from "@/app/components/Auth/ResetPasswordForm";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Suspense fallback={<div className="text-center">Загрузка...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
