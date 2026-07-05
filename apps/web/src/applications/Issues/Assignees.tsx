// Issues/Assignees.tsx
import { EmptyState } from "../../shared/components";

/** The issues table stores authorLogin but not assignees — GitHub issues
 * can have multiple assignees, which would need its own join table. */
export function Assignees() {
  return (
    <EmptyState
      title="Assignees aren't tracked yet"
      description="The issues table stores the author but not assignees — needs a schema addition."
    />
  );
}
