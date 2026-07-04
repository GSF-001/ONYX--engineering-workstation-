import { db } from "../db/client.js";
import { notifications } from "../db/schema.js";
import { broadcastToRoom } from "./broadcast.js";

export interface NotificationInput {
  userId: number;
  type: string;
  title: string;
  body?: string;
  metadata?: Record<string, unknown>;
}

export async function sendNotification(input: NotificationInput): Promise<void> {
  const [row] = await db
    .insert(notifications)
    .values({
      userId: input.userId,
      type: input.type,
      title: input.title,
      body: input.body,
      metadata: input.metadata,
    })
    .returning();

  broadcastToRoom(`user:${input.userId}`, {
    type: "notification.new",
    id: row.id,
    notificationType: row.type,
    title: row.title,
    body: row.body,
    createdAt: row.createdAt.toISOString(),
  });
}
