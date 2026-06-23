"use client";

import { useState, useEffect } from "react";
import { getUsers } from "@/lib/actions/admin-actions";
import { Pagination } from "@/app/components/ui/Pagination";
import type { UserListItem, Pagination as PaginationType } from "@/types/user";
import { UsersFilters } from "./UsersFilters";
import { UsersTable } from "./UsersTable";

export default function UsersList() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [pagination, setPagination] = useState<PaginationType>({
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
      setUsers(result.users as UserListItem[]);
      setPagination(result.pagination as PaginationType);
    }
    setIsLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    loadUsers();
  };

  const handleRoleChange = (value: string) => {
    setRoleFilter(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div>
      <UsersFilters
        search={search}
        roleFilter={roleFilter}
        onSearchChange={setSearch}
        onRoleChange={handleRoleChange}
        onSubmit={handleSearch}
      />
      <UsersTable users={users} isLoading={isLoading} />
      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
      />
    </div>
  );
}
