import { db } from "@/lib/db";

export async function findUserByEmail(email: string) {
  return db.user.findUnique({ where: { email } });
}

export async function findUserById(id: string) {
  return db.user.findUnique({
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
}

export async function getUsers(params: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}) {
  const page = params.page || 1;
  const limit = params.limit || 20;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

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

export async function updateUser(
  id: string,
  data: Record<string, unknown>,
) {
  return db.user.update({ where: { id }, data });
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  return db.user.create({ data });
}