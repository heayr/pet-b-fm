import { db } from "./db";

export async function createAuditLog(params: {
  userId: string;
  action: string;
  entity?: string;
  entityId?: string;
  metadata?: Record<string, unknown> | Record<string, never>;
}) {
  try {
    const user = await db.user.findUnique({
      where: { id: params.userId },
      select: { id: true },
    });
    if (!user) {
      // Пользователь отсутствует в БД, пропускаем запись в аудит
      return;
    }

    await db.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        metadata: (params.metadata ?? {}) as Record<string, string>,
      },
    });
  } catch (error) {
    console.error("[AUDIT ERROR]", error);
    // Не прерываем выполнение из-за ошибки аудита
  }
}
