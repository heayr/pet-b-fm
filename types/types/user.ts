export interface UserListItem {
  id: string;
  name: string | null;
  email: string;
  role: string;
  isActive: boolean;
  emailVerified: Date | null;
  isTwoFactorEnabled: boolean;
  createdAt: Date;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}