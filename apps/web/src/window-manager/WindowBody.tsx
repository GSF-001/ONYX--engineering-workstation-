import { Suspense, type ComponentType } from "react";
import { LoadingSpinner } from "../shared/components";

interface WindowBodyProps {
  Component: ComponentType;
}

export function WindowBody({ Component }: WindowBodyProps) {
  return (
    <div className="win-body">
      <Suspense
        fallback={
          <div style={{ display: "flex", justifyContent: "center", padding: 32 }}>
            <LoadingSpinner label="Loading..." />
          </div>
        }
      >
        <Component />
      </Suspense>
    </div>
  );
}
