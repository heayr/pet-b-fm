"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { adminUpdateUserSchema, contentBlockSchema } from "@/lib/validations";
import { createAuditLog } from "@/lib/audit";
import { requireRole, requireAdmin } from "@/lib/auth-helpers";

export async function getUsers(params: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}) {
  await requireRole(["super_admin", "admin"]);

  const page = params.page || 1;
  const limit = params.limit || 20;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { email: { contains: params.search, mode: "insensitive" } },
    ];
  }

  if (params.role) {
    where.role = params.role;
  }

  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        emailVerified: true,
        isTwoFactorEnabled: true,
        createdAt: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    db.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getUserById(id: string) {
  await requireRole(["super_admin", "admin"]);

  const user = await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      emailVerified: true,
      isTwoFactorEnabled: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return { error: "Пользователь не найден" };
  }

  return { user };
}

export async function updateUser(
  id: string,
  input: {
    name?: string;
    role?: string;
    isActive?: boolean;
    emailVerified?: boolean;
  }
) {
  const session = await requireRole(["super_admin", "admin"]);

  const validated = adminUpdateUserSchema.safeParse(input);
  if (!validated.success) {
    return { error: validated.error.errors[0]?.message || "Ошибка валидации" };
  }

  const targetUser = await db.user.findUnique({ where: { id } });
  if (!targetUser) {
    return { error: "Пользователь не найден" };
  }

  // Только super_admin может менять роли
  if (input.role && session.user.role !== "super_admin") {
    return { error: "Недостаточно прав для изменения роли" };
  }

  // Нельзя изменить super_admin другому super_admin
  if (
    targetUser.role === "super_admin" &&
    session.user.id !== id &&
    session.user.role === "super_admin"
  ) {
    // Разрешаем только если текущий пользователь super_admin
  }

  const data: any = {};
  if (validated.data.name !== undefined) data.name = validated.data.name;
  if (validated.data.role !== undefined) data.role = validated.data.role;
  if (validated.data.isActive !== undefined) data.isActive = validated.data.isActive;
  if (validated.data.emailVerified !== undefined) {
    data.emailVerified = validated.data.emailVerified ? new Date() : null;
  }

  await db.user.update({
    where: { id },
    data,
  });

  await createAuditLog({
    userId: session.user.id,
    action: "user_update",
    entity: "user",
    entityId: id,
    metadata: { changes: validated.data },
  });

  return { success: true, message: "Пользователь обновлён" };
}

export async function getContentBlocks() {
  await requireAdmin();

  const blocks = await db.contentBlock.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return { blocks };
}

export async function getContentBlockBySlug(slug: string) {
  await requireAdmin();

  const block = await db.contentBlock.findUnique({
    where: { slug },
  });

  if (!block) {
    return { error: "Блок не найден" };
  }

  return { block };
}

export async function updateContentBlock(
  slug: string,
  input: {
    title?: string;
    content?: any;
    status?: string;
  }
) {
  const session = await requireAdmin();

  // title может быть на верхнем уровне или внутри content
  const title = input.title || input.content?.title || "";
  const validated = contentBlockSchema.safeParse({
    slug,
    title,
    content: input.content,
    status: input.status,
  });
  if (!validated.success) {
    return { error: validated.error.errors[0]?.message || "Ошибка валидации" };
  }

  const existingBlock = await db.contentBlock.findUnique({ where: { slug } });
  if (!existingBlock) {
    return { error: "Блок не найден" };
  }

  const data: any = {};
  if (validated.data.title !== undefined) data.title = validated.data.title;
  if (validated.data.content !== undefined) data.content = validated.data.content;
  if (validated.data.status !== undefined) data.status = validated.data.status;
  data.version = existingBlock.version + 1;

  await db.contentBlock.update({
    where: { slug },
    data,
  });

  await createAuditLog({
    userId: session.user.id,
    action: "content_update",
    entity: "content",
    entityId: existingBlock.id,
    metadata: { slug, version: data.version },
  });

  return { success: true, message: "Контент обновлён" };
}

export async function createContentBlock(input: {
  slug: string;
  title: string;
  content?: any;
  status?: string;
}) {
  const session = await requireRole(["super_admin", "admin"]);

  const validated = contentBlockSchema.safeParse(input);
  if (!validated.success) {
    return { error: validated.error.errors[0]?.message || "Ошибка валидации" };
  }

  const existing = await db.contentBlock.findUnique({ where: { slug: validated.data.slug } });
  if (existing) {
    return { error: "Блок с таким slug уже существует" };
  }

  await db.contentBlock.create({
    data: {
      slug: validated.data.slug,
      title: validated.data.title,
      content: validated.data.content || {},
      status: (validated.data.status as any) || "draft",
    },
  });

  await createAuditLog({
    userId: session.user.id,
    action: "content_create",
    entity: "content",
    metadata: { slug: validated.data.slug },
  });

  return { success: true, message: "Блок создан" };
}

export async function getAuditLogs(params: {
  page?: number;
  limit?: number;
  userId?: string;
  action?: string;
}) {
  await requireRole(["super_admin", "admin"]);

  const page = params.page || 1;
  const limit = params.limit || 50;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (params.userId) where.userId = params.userId;
  if (params.action) where.action = params.action;

  const [logs, total] = await Promise.all([
    db.auditLog.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    db.auditLog.count({ where }),
  ]);

  return {
    logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}