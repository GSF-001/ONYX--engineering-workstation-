import { ReviewerLoadWidget } from "../../shared/components";
import type { ReviewerLoadEntry } from "./TeamTypes";

/** Same pattern as Reviews/ReviewerLoad.tsx — thin wrapper, one shared
 * implementation, so both pages read identically. */
export function ReviewerLoad({ entries }: { entries: ReviewerLoadEntry[] }) {
  return <ReviewerLoadWidget entries={entries} />;
}
