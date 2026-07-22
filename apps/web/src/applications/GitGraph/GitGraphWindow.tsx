// GitGraphWindow.tsx
// Composes the full GitGraph layout inside a single window, matching
// ONYX's per-application Window convention.

import GitGraphHeader from "./GitGraphHeader";
import Toolbar from "./Toolbar";
import BranchSidebar from "./BranchSidebar";
import RepositoryTopology from "./RepositoryTopology";
import MiniMap from "./MiniMap";
import CommitInspector from "./CommitInspector";
import DiffPreview from "./DiffPreview";
import StatusBar from "./StatusBar";
import "./GitGraphStyles.css";

export default function GitGraphWindow() {
  return (
    <div className="git-graph-window">
      <GitGraphHeader />
      <Toolbar />
      <div className="git-graph-window-body">
        <BranchSidebar />
        <div className="git-graph-window-canvas">
          <RepositoryTopology />
          <MiniMap />
        </div>
        <div className="git-graph-window-details">
          <CommitInspector />
          <DiffPreview />
        </div>
      </div>
      <StatusBar />
    </div>
  );
}
