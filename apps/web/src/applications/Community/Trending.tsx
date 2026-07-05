// Community/Trending.tsx
import { CommunityAPI } from "./CommunityAPI";
import { useCommunityList } from "./CommunityHooks";
import { ProjectCard } from "./Widgets/ProjectCard";
import { EmptyState, LoadingSpinner } from "../../shared/components";
import { getLikedPostIds } from "./CommunityStore";

export function Trending() {
  const { items, loading, error } = useCommunityList(CommunityAPI.getTrending);
  const liked = getLikedPostIds();

  if (loading) return <LoadingSpinner label="Loading trending..." />;
  if (error) return <EmptyState title="Couldn't load trending" description={error} />;
  if (items.length === 0) return <EmptyState title="Nothing trending yet" description="Check back once there's more activity this week." />;

  return (
    <div style={{ padding: 12 }}>
      {items.map((post) => <ProjectCard key={post.id} post={post} liked={liked.has(post.id)} onLike={() => undefined} />)}
    </div>
  );
}
