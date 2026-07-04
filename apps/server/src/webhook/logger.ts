import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { webhookEvents } from "../db/schema.js";

export async function logWebhookEvent(input: {
  deliveryId: string;
  event: string;
  action?: string;
  repositoryFullName?: string;
  payload: unknown;
}) {
  const [row] = await db
    .insert(webhookEvents)
    .values({
      deliveryId: input.deliveryId,
      event: input.event,
      action: input.action,
      repositoryFullName: input.repositoryFullName,
      payload: input.payload as object,
      status: "pending",
    })
    .returning();
  return row;
}

export async function markWebhookEventProcessed(id: number): Promise<void> {
  await db
    .update(webhookEvents)
    .set({ status: "processed", processedAt: new Date() })
    .where(eq(webhookEvents.id, id));
}

export async function markWebhookEventFailed(id: number, error: string): Promise<void> {
  await db
    .update(webhookEvents)
    .set({ status: "failed", error })
    .where(eq(webhookEvents.id, id));
}

export async function incrementWebhookAttempts(id: number): Promise<void> {
  const [row] = await db
    .select({ attempts: webhookEvents.attempts })
    .from(webhookEvents)
    .where(eq(webhookEvents.id, id));
  await db
    .update(webhookEvents)
    .set({ attempts: (row?.attempts ?? 0) + 1 })
    .where(eq(webhookEvents.id, id));
}
