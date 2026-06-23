"use client";

import { useState, useEffect } from "react";
import { getUsers } from "@/lib/actions/admin-actions";
import Link from "next/link";
import Button from "@/app/components/Button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  isActive: boolean;
  emailVerified: Date | null;
  isTwoFactorEnabled: boolean;
  createdAt: Date;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const roleLabels: Record<string, string> = {
  super_admin: "Супер-админ",
  admin: "Админ",
  moderator: "Модератор",
  user: "Пользователь",
};

const roleColors: Record<string, string> = {
  super_admin: "bg-purple-100 text-purple-800",
  admin: "bg-blue-100 text-blue-800",
  moderator: "bg-yellow-100 text-yellow-800",
  user: "bg-gray-100 text-gray-800",
};

export default function UsersList() {
  const { data: session } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, [pagination.page, roleFilter]);

  const loadUsers = async () => {
    setIsLoading(true);
    const result = await getUsers({
      page: pagination.page,
      limit: pagination.limit,
      search: search || undefined,
      role: roleFilter || undefined,
    });

    if (result.users) {
      setUsers(result.users as User[]);
      setPagination(result.pagination as Pagination);
    }
    setIsLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    loadUsers();
  };

  return (
    <div>
      {/* Фильтры */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
        <form
          onSubmit={handleSearch}
          className="flex flex-wrap gap-3 items-end"
        >
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Поиск
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Имя или email..."
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-default-lime"
            />
          </div>
          <div className="w-40">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Роль
            </label>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-default-lime"
            >
              <option value="">Все роли</option>
              <option value="super_admin">Супер-админ</option>
              <option value="admin">Админ</option>
              <option value="moderator">Модератор</option>
              <option value="user">Пользователь</option>
            </select>
          </div>
          <Button type="submit" variant="primary" size="md">
            Поиск
          </Button>
        </form>
      </div>

      {/* Таблица пользователей */}
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
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Загрузка...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Пользователи не найдены
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">
                      {user.name || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          roleColors[user.role] || roleColors.user
                        }`}
                      >
                        {roleLabels[user.role] || user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {user.isActive ? (
                        <span className="text-green-600 text-sm">Активен</span>
                      ) : (
                        <span className="text-red-600 text-sm">
                          Заблокирован
                        </span>
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

      {/* Пагинация */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
            }
            variant="outline"
            size="sm"
            disabled={pagination.page <= 1}
          >
            Назад
          </Button>
          <span className="text-sm text-gray-600">
            Страница {pagination.page} из {pagination.totalPages}
          </span>
          <Button
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
            }
            variant="outline"
            size="sm"
            disabled={pagination.page >= pagination.totalPages}
          >
            Вперёд
          </Button>
        </div>
      )}
    </div>
  );
}
