"use client";

import Link from "next/link";
import type { UserListItem } from "@/types/user";
import { ROLE_LABELS, ROLE_COLORS } from "@/constants/roles";

interface UsersTableProps {
  users: UserListItem[];
  isLoading: boolean;
}

export function UsersTable({ users, isLoading }: UsersTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                Имя
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                Роль
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                Статус
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                2FA
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                Регистрация
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  Загрузка...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  Пользователи не найдены
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{user.name || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        ROLE_COLORS[user.role] || ROLE_COLORS.user
                      }`}
                    >
                      {ROLE_LABELS[user.role] || user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {user.isActive ? (
                      <span className="text-green-600 text-sm">Активен</span>
                    ) : (
                      <span className="text-red-600 text-sm">Заблокирован</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {user.isTwoFactorEnabled ? (
                      <span className="text-green-600 text-sm">Да</span>
                    ) : (
                      <span className="text-gray-400 text-sm">Нет</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString("ru-RU")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="text-sm font-medium text-black hover:underline"
                    >
                      Редактировать
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
