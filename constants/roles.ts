export const ROLE_LABELS: Record<string, string> = {
  super_admin: "Супер-админ",
  admin: "Админ",
  moderator: "Модератор",
  user: "Пользователь",
};

export const ROLE_COLORS: Record<string, string> = {
  super_admin: "bg-purple-100 text-purple-800",
  admin: "bg-blue-100 text-blue-800",
  moderator: "bg-yellow-100 text-yellow-800",
  user: "bg-gray-100 text-gray-800",
};

export const ADMIN_ROLES = ["super_admin", "admin", "moderator"] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];