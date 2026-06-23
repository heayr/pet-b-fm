import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function getSession() {
  return await auth();
}

export async function requireAuth() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/auth/login");
  }

  return session;
}

export async function requireRole(allowedRoles: string[]) {
  const session = await requireAuth();

  if (!allowedRoles.includes(session.user.role)) {
    if (session.user.role === "super_admin") {
      redirect("/admin/users");
    } else if (session.user.role === "admin") {
      redirect("/admin/users");
    } else if (session.user.role === "moderator") {
      redirect("/admin/content");
    } else {
      redirect("/dashboard");
    }
  }

  return session;
}

export async function requireAdmin() {
  return requireRole(["super_admin", "admin", "moderator"]);
}

export async function requireSuperAdmin() {
  return requireRole(["super_admin"]);
}

export function canManageUsers(role: string): boolean {
  return ["super_admin", "admin"].includes(role);
}

export function canManageContent(role: string): boolean {
  return ["super_admin", "admin", "moderator"].includes(role);
}

export function canManageRoles(role: string): boolean {
  return role === "super_admin";
}