import type { Repository } from "../../shared/types";
import type { BusFactorResult } from "../../shared/api/endpoints";

export interface RepositoryViewState {
  repository: Repository | null;
  contributors: BusFactorResult["contributions"];
  loading: boolean;
  error: string | null;
}

export type { Repository };
