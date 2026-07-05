import { Outlet } from "react-router-dom";
import { ErrorBoundary } from "./shared/components";

/**
 * Root layout rendered for every route. Kept intentionally thin — the real
 * per-stage chrome (landing/auth/boot/desktop) lives in each route's own
 * page component. This just guarantees a shared error boundary around
 * whatever the router decides to render.
 */
export default function App() {
  return (
    <ErrorBoundary>
      <Outlet />
    </ErrorBoundary>
  );
}
