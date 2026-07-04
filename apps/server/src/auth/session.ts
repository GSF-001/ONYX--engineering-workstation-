import { randomUUID } from "node:crypto";
import { eq, lt } from "drizzle-orm";
import { db } from "../db/client.js";
import { sessions } from "../db/schema.js";

const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

export interface CreateSessionInput {
  userId: number;
  userAgent?: string;
  ip?: string;
}

export async function createSession(input: CreateSessionInput) {
  const id = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);

  const [session] = await db
    .insert(sessions)
    .values({
      id,
      userId: input.userId,
      userAgent: input.userAgent,
      ip: input.ip,
      expiresAt,
    })
    .returning();

  return { session, ttlSeconds: SESSION_TTL_SECONDS };
}

export async function getSession(sessionId: string) {
  const [session] = await db.select().from(sessions).where(eq(sessions.id, sessionId));
  if (!session) return null;
  if (session.expiresAt.getTime() < Date.now()) {
    await destroySession(sessionId);
    return null;
  }
  return session;
}

export async function destroySession(sessionId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export async function destroyExpiredSessions(): Promise<void> {
  await db.delete(sessions).where(lt(sessions.expiresAt, new Date()));
}
