import { apiClient } from "../shared/api";
import type { CooldownStatus, IdentityData } from "./IdentityTypes";

export const IdentityAPI = {
  getMe: () => apiClient.get<IdentityData>("/identity/me"),
  getCandidates: () => apiClient.get<string[]>("/identity/candidates"),
  getCooldown: () => apiClient.get<CooldownStatus>("/identity/cooldown"),
  confirm: (handle: string) =>
    apiClient.post<{ handle: string; developerId: string }>("/identity/confirm", { handle }),
};
