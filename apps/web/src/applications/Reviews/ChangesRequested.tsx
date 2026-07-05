// Reviews/ChangesRequested.tsx
import { EmptyState } from "../../shared/components";

export function ChangesRequested() {
  return (
    <EmptyState
      title="Per-review status list isn't exposed yet"
      description="Same backend gap as Pending — needs a raw reviews list endpoint."
    />
  );
}
