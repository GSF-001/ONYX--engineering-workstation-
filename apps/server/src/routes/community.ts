import type { FastifyInstance } from "fastify";
import { eq, desc, sql, count } from "drizzle-orm";
import { db } from "../db/client.js";
import {
  communityPosts,
  communityPostLikes,
  communityPostComments,
  users,
  pullRequests,
  reviews,
} from "../db/schema.js";
import { requireAuth } from "../auth/index.js";

async function postsByType(type?: "project" | "discussion" | "showcase" | "event") {
  const rows = await db
    .select({
      id: communityPosts.id,
      type: communityPosts.type,
      title: communityPosts.title,
      body: communityPosts.body,
      url: communityPosts.url,
      eventAt: communityPosts.eventAt,
      createdAt: communityPosts.createdAt,
      authorLogin: users.login,
      authorAvatarUrl: users.avatarUrl,
      likeCount: sql<number>`(select count(*) from ${communityPostLikes} where ${communityPostLikes.postId} = ${communityPosts.id})`,
      commentCount: sql<number>`(select count(*) from ${communityPostComments} where ${communityPostComments.postId} = ${communityPosts.id})`,
    })
    .from(communityPosts)
    .innerJoin(users, eq(communityPosts.authorId, users.id))
    .where(type ? eq(communityPosts.type, type) : sql`true`)
    .orderBy(desc(communityPosts.createdAt));

  return rows;
}

export async function communityRoutes(app: FastifyInstance): Promise<void> {
  app.get("/community/feed", { preHandler: requireAuth }, async (_request, reply) => {
    reply.send(await postsByType());
  });

  app.get("/community/trending", { preHandler: requireAuth }, async (_request, reply) => {
    const rows = await postsByType();
    reply.send(rows.sort((a, b) => b.likeCount - a.likeCount).slice(0, 20));
  });

  app.get("/community/projects", { preHandler: requireAuth }, async (_request, reply) => {
    reply.send(await postsByType("project"));
  });

  app.get("/community/discussions", { preHandler: requireAuth }, async (_request, reply) => {
    reply.send(await postsByType("discussion"));
  });

  app.get("/community/showcase", { preHandler: requireAuth }, async (_request, reply) => {
    reply.send(await postsByType("showcase"));
  });

  app.get("/community/events", { preHandler: requireAuth }, async (_request, reply) => {
    reply.send(await postsByType("event"));
  });

  app.get("/community/developers", { preHandler: requireAuth }, async (_request, reply) => {
    const rows = await db
      .select({
        userId: users.id,
        login: users.login,
        avatarUrl: users.avatarUrl,
        pullRequestCount: sql<number>`(select count(*) from ${pullRequests} where ${pullRequests.authorLogin} = ${users.login})`,
        reviewCount: sql<number>`(select count(*) from ${reviews} where ${reviews.reviewerLogin} = ${users.login})`,
        postCount: sql<number>`(select count(*) from ${communityPosts} where ${communityPosts.authorId} = ${users.id})`,
      })
      .from(users);
    reply.send(rows);
  });

  app.get("/community/leaderboard", { preHandler: requireAuth }, async (_request, reply) => {
    const rows = await db
      .select({
        login: users.login,
        avatarUrl: users.avatarUrl,
        score: sql<number>`
          (select count(*) from ${pullRequests} where ${pullRequests.authorLogin} = ${users.login}) * 3 +
          (select count(*) from ${reviews} where ${reviews.reviewerLogin} = ${users.login}) * 2 +
          (select count(*) from ${communityPosts} where ${communityPosts.authorId} = ${users.id})
        `,
      })
      .from(users)
      .orderBy(desc(sql`score`));

    reply.send(rows.map((r, i) => ({ rank: i + 1, ...r })));
  });

  app.post<{
    Body: { type: "project" | "discussion" | "showcase" | "event"; title: string; body: string; url?: string; eventAt?: string };
  }>("/community/posts", { preHandler: requireAuth }, async (request, reply) => {
    const { type, title, body, url, eventAt } = request.body;
    const [post] = await db
      .insert(communityPosts)
      .values({
        authorId: request.currentUser!.id,
        type,
        title,
        body,
        url: url ?? null,
        eventAt: eventAt ? new Date(eventAt) : null,
      })
      .returning();
    reply.code(201).send(post);
  });

  app.post<{ Params: { postId: string } }>(
    "/community/posts/:postId/like",
    { preHandler: requireAuth },
    async (request, reply) => {
      const postId = Number(request.params.postId);
      await db
        .insert(communityPostLikes)
        .values({ postId, userId: request.currentUser!.id })
        .onConflictDoNothing();
      reply.send({ ok: true });
    }
  );

  app.delete<{ Params: { postId: string } }>(
    "/community/posts/:postId/like",
    { preHandler: requireAuth },
    async (request, reply) => {
      const postId = Number(request.params.postId);
      await db
        .delete(communityPostLikes)
        .where(
          sql`${communityPostLikes.postId} = ${postId} and ${communityPostLikes.userId} = ${request.currentUser!.id}`
        );
      reply.send({ ok: true });
    }
  );

  app.post<{ Params: { postId: string }; Body: { body: string } }>(
    "/community/posts/:postId/comments",
    { preHandler: requireAuth },
    async (request, reply) => {
      const postId = Number(request.params.postId);
      const [comment] = await db
        .insert(communityPostComments)
        .values({ postId, authorId: request.currentUser!.id, body: request.body.body })
        .returning({ id: communityPostComments.id });
      reply.code(201).send(comment);
    }
  );
}
