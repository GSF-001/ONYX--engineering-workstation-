// BranchLane.tsx
// Renders one edge of the commit graph (a connector between a commit and
// one of its parents). Named for what it visually represents: the lane a
// branch's history travels through.

import type { GitGraphEdge } from "./GitGraphTypes";

interface BranchLaneProps {
  edge: GitGraphEdge;
}

export default function BranchLane({ edge }: BranchLaneProps) {
  return (
    <path
      d={edge.path}
      stroke={edge.color}
      strokeWidth={edge.isMerge ? 2 : 2.5}
      strokeDasharray={edge.isMerge ? "1 0" : undefined}
      fill="none"
      className={edge.isMerge ? "git-branch-lane git-branch-lane-merge" : "git-branch-lane"}
      opacity={edge.fromLane === edge.toLane ? 0.9 : 0.75}
    />
  );
}
