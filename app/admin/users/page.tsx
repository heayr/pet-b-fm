import { auth } from "@/auth";
import { redirect } from "next/navigation";
import UsersList from "./UsersList";

export default async function AdminUsersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  if (!["super_admin", "admin"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Управление пользователями</h1>
      <UsersList />
    </div>
  );
}
