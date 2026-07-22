// GitGraphApp.tsx
// Entry point for the GitGraph application. Seeds the store with the
// sample repository on first mount, then renders the window.

import { useEffect, useRef } from "react";
import GitGraphWindow from "./GitGraphWindow";
import { useGitGraphState } from "./GitGraphHooks";
import { loadRepository } from "./GitGraphCommands";

export default function GitGraphApp() {
  const { commits } = useGitGraphState();
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (hasLoaded.current || commits.length > 0) return;
    hasLoaded.current = true;
    loadRepository();
  }, [commits.length]);

  return <GitGraphWindow />;
}
