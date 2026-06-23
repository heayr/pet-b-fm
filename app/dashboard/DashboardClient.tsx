"use client";

import { UserInfoCard } from "./UserInfoCard";
import { PasswordChangeCard } from "./PasswordChangeCard";
import { SecurityCard } from "./SecurityCard";

interface DashboardClientProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role: string;
    isTwoFactorEnabled: boolean;
  };
}

export default function DashboardClient({ user }: DashboardClientProps) {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Личный кабинет</h1>
      <UserInfoCard user={user} />
      <PasswordChangeCard />
      <SecurityCard />
    </div>
  );
}
