import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getContentBlocks } from "@/lib/actions/admin-actions";
import ContentList from "./ContentList";

export default async function AdminContentPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  if (!["super_admin", "admin", "moderator"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  const result = await getContentBlocks();

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Управление контентом</h1>
      </div>
      <ContentList
        blocks={(result.blocks || []) as any[]}
        canCreate={["super_admin", "admin"].includes(session.user.role)}
      />
    </div>
  );
}
