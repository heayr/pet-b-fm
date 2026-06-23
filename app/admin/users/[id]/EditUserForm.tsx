"use client";

import { useState } from "react";
import { updateUser } from "@/lib/actions/admin-actions";
import { useRouter } from "next/navigation";
import Button from "@/app/components/Button";

interface UserData {
  id: string;
  name: string | null;
  email: string;
  role: string;
  isActive: boolean;
  emailVerified: Date | null;
}

const roleLabels: Record<string, string> = {
  super_admin: "Супер-администратор",
  admin: "Администратор",
  moderator: "Модератор",
  user: "Пользователь",
};

const roleOptions = [
  { value: "user", label: "Пользователь" },
  { value: "moderator", label: "Модератор" },
  { value: "admin", label: "Администратор" },
  { value: "super_admin", label: "Супер-администратор" },
];

export default function EditUserForm({
  user,
  isSuperAdmin,
}: {
  user: UserData;
  isSuperAdmin: boolean;
}) {
  const router = useRouter();
  const [name, setName] = useState(user.name || "");
  const [role, setRole] = useState(user.role);
  const [isActive, setIsActive] = useState(user.isActive);
  const [emailVerified, setEmailVerified] = useState(!!user.emailVerified);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const result = await updateUser(user.id, {
      name: name || undefined,
      role: isSuperAdmin ? role : undefined,
      isActive,
      emailVerified,
    });

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    setSuccess(result.message || "Пользователь обновлён");
    setIsLoading(false);
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
          {success}
        </div>
      )}

      {/* Email (только для чтения) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          value={user.email}
          disabled
          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
        />
      </div>

      {/* Имя */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Имя
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-default-lime"
        />
      </div>

      {/* Роль (только для super_admin) */}
      {isSuperAdmin && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Роль
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-default-lime"
          >
            {roleOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Текущая роль: {roleLabels[user.role] || user.role}
          </p>
        </div>
      )}

      {/* Статус активности */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-black focus:ring-default-lime"
          />
          <span className="text-sm font-medium text-gray-700">
            Аккаунт активен
          </span>
        </label>
        <p className="text-xs text-gray-500 mt-1 ml-8">
          {isActive
            ? "Пользователь может входить в систему"
            : "Пользователь заблокирован"}
        </p>
      </div>

      {/* Email подтверждён */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={emailVerified}
            onChange={(e) => setEmailVerified(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-black focus:ring-default-lime"
          />
          <span className="text-sm font-medium text-gray-700">
            Email подтверждён
          </span>
        </label>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <Button
          type="submit"
          variant="primary"
          size="fluid"
          className="flex-1"
          loading={isLoading}
        >
          Сохранить изменения
        </Button>
        <Button
          type="button"
          variant="outline"
          size="fluid"
          className="flex-1"
          onClick={() => router.push("/admin/users")}
        >
          Отмена
        </Button>
      </div>
    </form>
  );
}
