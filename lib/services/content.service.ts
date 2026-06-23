import { db } from "@/lib/db";

export async function getContentBlock(slug: string) {
  return db.contentBlock.findUnique({ where: { slug } });
}

export async function getContentBlocks() {
  return db.contentBlock.findMany({ orderBy: { updatedAt: "desc" } });
}

export async function updateContentBlock(
  slug: string,
  data: Record<string, unknown>,
) {
  return db.contentBlock.update({ where: { slug }, data: data as never });
}

export async function createContentBlock(data: {
  slug: string;
  title: string;
  content?: Record<string, unknown>;
  status?: string;
}) {
  return db.contentBlock.create({ data: data as never });
}
