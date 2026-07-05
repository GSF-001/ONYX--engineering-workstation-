import { apiClient } from "../../shared/api";
import type { ChatMessage, GroupMember, GroupSummary } from "./GroupsTypes";

export const GroupsAPI = {
  getPublic: () => apiClient.get<GroupSummary[]>("/api/groups/public"),
  getAnonymous: () => apiClient.get<GroupSummary[]>("/api/groups/anonymous"),
  getMine: () => apiClient.get<GroupSummary[]>("/api/groups/mine"),
  create: (input: { name: string; slug: string; visibility: "public" | "private" | "anonymous"; anonymousHandle?: string; description?: string }) =>
    apiClient.post<GroupSummary>("/api/groups", input),
  getMembers: (groupId: number) => apiClient.get<GroupMember[]>(`/api/groups/${groupId}/members`),
  join: (groupId: number) => apiClient.post<GroupMember>(`/api/groups/${groupId}/join`),
  leave: (groupId: number) => apiClient.post<{ ok: true }>(`/api/groups/${groupId}/leave`),
  createInvite: (groupId: number, opts: { maxUses?: number; expiresInHours?: number }) =>
    apiClient.post<{ code: string }>(`/api/groups/${groupId}/invites`, opts),
  redeemInvite: (code: string) => apiClient.post<GroupMember>("/api/groups/invites/redeem", { code }),
  getMessages: (groupId: number, before?: string) =>
    apiClient.get<ChatMessage[]>(`/api/groups/${groupId}/messages${before ? `?before=${before}` : ""}`),
  postMessage: (groupId: number, body: string) =>
    apiClient.post<ChatMessage>(`/api/groups/${groupId}/messages`, { body }),
  getFiles: (groupId: number) => apiClient.get<any[]>(`/api/groups/${groupId}/files`),
  getAnnouncements: (groupId: number) => apiClient.get<any[]>(`/api/groups/${groupId}/announcements`),
  postAnnouncement: (groupId: number, title: string, body: string) =>
    apiClient.post<any>(`/api/groups/${groupId}/announcements`, { title, body }),
  getActivity: (groupId: number) => apiClient.get<any[]>(`/api/groups/${groupId}/activity`),
};
