const LIKED_KEY = "onyx.likedPosts";

/** Local optimistic like-state cache — server is the source of truth for
 * counts, but there's no GET-my-likes endpoint, so this remembers which
 * posts *this browser* has liked to render filled vs outline heart icons. */
export function getLikedPostIds(): Set<number> {
  try {
    return new Set(JSON.parse(localStorage.getItem(LIKED_KEY) ?? "[]") as number[]);
  } catch {
    return new Set();
  }
}

export function toggleLikedPostId(postId: number): boolean {
  const liked = getLikedPostIds();
  const nowLiked = !liked.has(postId);
  if (nowLiked) liked.add(postId);
  else liked.delete(postId);
  localStorage.setItem(LIKED_KEY, JSON.stringify(Array.from(liked)));
  return nowLiked;
}
