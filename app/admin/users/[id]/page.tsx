import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserById } from "@/lib/actions/admin-actions";
import EditUserForm from "./EditUserForm";

export default async function EditUserPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  if (!["super_admin", "admin"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  const result = await getUserById(params.id);

  if (result.error || !result.user) {
    redirect("/admin/users");
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Редактирование пользователя</h1>
      <EditUserForm
        user={result.user as any}
        isSuperAdmin={session.user.role === "super_admin"}
      />
    </div>
  );
}
