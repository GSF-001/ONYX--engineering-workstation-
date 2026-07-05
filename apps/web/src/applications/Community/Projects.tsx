// Community/Projects.tsx
import { CommunityAPI } from "./CommunityAPI";
import { useCommunityList } from "./CommunityHooks";
import { ProjectCard } from "./Widgets/ProjectCard";
import { EmptyState, LoadingSpinner } from "../../shared/components";
import { getLikedPostIds } from "./CommunityStore";

export function Projects() {
  const { items, loading, error } = useCommunityList(CommunityAPI.getProjects);
  const liked = getLikedPostIds();
  if (loading) return <LoadingSpinner label="Loading projects..." />;
  if (error) return <EmptyState title="Couldn't load projects" description={error} />;
  if (items.length === 0) return <EmptyState title="No projects shared yet" />;
  return <div style={{ padding: 12 }}>{items.map((p) => <ProjectCard key={p.id} post={p} liked={liked.has(p.id)} onLike={() => undefined} />)}</div>;
}
