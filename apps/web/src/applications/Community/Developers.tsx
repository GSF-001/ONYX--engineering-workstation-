// Community/Developers.tsx
import { CommunityAPI } from "./CommunityAPI";
import { useCommunityList } from "./CommunityHooks";
import { DeveloperCard } from "./Widgets/DeveloperCard";
import { EmptyState, LoadingSpinner } from "../../shared/components";

export function Developers() {
  const { items, loading, error } = useCommunityList(CommunityAPI.getDevelopers);
  if (loading) return <LoadingSpinner label="Loading developers..." />;
  if (error) return <EmptyState title="Couldn't load developers" description={error} />;
  if (items.length === 0) return <EmptyState title="No active developers yet" />;
  return <div style={{ padding: 12 }}>{items.map((d) => <DeveloperCard key={d.userId} developer={d} />)}</div>;
}
