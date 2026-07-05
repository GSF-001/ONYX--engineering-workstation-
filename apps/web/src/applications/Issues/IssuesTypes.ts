import type { Issue, IssueState } from "../../shared/types";
import type { GraveyardIssue } from "../../shared/api/endpoints";

export interface IssuesViewState {
  graveyard: GraveyardIssue[];
  loading: boolean;
  error: string | null;
}

export type { Issue, IssueState, GraveyardIssue };
