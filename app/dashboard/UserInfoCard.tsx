"use client";

import Button from "@/app/components/Button";

interface UserInfoCardProps {
  user: {
    name?: string | null;
    email?: string | null;
    role: string;
    isTwoFactorEnabled: boolean;
  };
}

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Супер-администратор",
  admin: "Администратор",
  moderator: "Модератор",
  user: "Пользователь",
};

export function UserInfoCard({ user }: UserInfoCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Информация</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-sm text-gray-500">Имя</span>
          <p className="font-medium">{user.name || "Не указано"}</p>
        </div>
        <div>
          <span className="text-sm text-gray-500">Email</span>
          <p className="font-medium">{user.email}</p>
        </div>
        <div>
          <span className="text-sm text-gray-500">Роль</span>
          <p className="font-medium">{ROLE_LABELS[user.role] || user.role}</p>
        </div>
        <div>
          <span className="text-sm text-gray-500">2FA</span>
          <p className="font-medium">
            {user.isTwoFactorEnabled ? "Включена" : "Отключена"}
          </p>
        </div>
      </div>

      {["super_admin", "admin", "moderator"].includes(user.role) && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Button href="/admin/users" variant="outline" size="md">
            Панель управления
          </Button>
        </div>
      )}
    </div>
  );
}
