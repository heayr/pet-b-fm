"use client";

import Button from "@/app/components/Button";

interface UsersFiltersProps {
  search: string;
  roleFilter: string;
  onSearchChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function UsersFilters({
  search,
  roleFilter,
  onSearchChange,
  onRoleChange,
  onSubmit,
}: UsersFiltersProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
      <form onSubmit={onSubmit} className="flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Поиск
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
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
            onChange={(e) => onRoleChange(e.target.value)}
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
  );
}
