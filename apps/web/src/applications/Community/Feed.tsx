import { useState } from "react";
import { CommunityAPI } from "./CommunityAPI";
import { useCommunityFeed } from "./CommunityHooks";
import { ProjectCard } from "./Widgets/ProjectCard";
import { getLikedPostIds, toggleLikedPostId } from "./CommunityStore";
import { EmptyState, LoadingSpinner } from "../../shared/components";

export function Feed() {
  const { feed, loading, error, reload } = useCommunityFeed();
  const [liked, setLiked] = useState(getLikedPostIds());

  const handleLike = async (postId: number) => {
    const nowLiked = toggleLikedPostId(postId);
    setLiked(new Set(getLikedPostIds()));
    try {
      if (nowLiked) await CommunityAPI.likePost(postId);
      else await CommunityAPI.unlikePost(postId);
    } catch {
      toggleLikedPostId(postId); // revert on failure
      setLiked(new Set(getLikedPostIds()));
    }
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 32 }}><LoadingSpinner label="Loading feed..." /></div>;
  if (error) return <EmptyState title="Couldn't load feed" description={error} action={<button onClick={reload}>Retry</button>} />;
  if (feed.length === 0) return <EmptyState title="No posts yet" description="Be the first to share a project, discussion, or showcase." />;

  return (
    <div style={{ padding: 12 }}>
      {feed.map((post) => (
        <ProjectCard key={post.id} post={post} liked={liked.has(post.id)} onLike={() => handleLike(post.id)} />
      ))}
    </div>
  );
}
