export interface GroupSummary {
  id: number;
  name: string;
  slug: string;
  visibility: "public" | "private" | "anonymous";
  anonymousHandle: string | null;
  description: string | null;
}

export interface GroupMember {
  id: number;
  groupId: number;
  userId: number;
  role: "owner" | "admin" | "member";
}

export interface ChatMessage {
  id: number;
  userId: number;
  login: string;
  avatarUrl: string | null;
  body: string;
  createdAt: string;
}

export interface GroupsViewState {
  publicGroups: GroupSummary[];
  anonymousGroups: GroupSummary[];
  myGroups: GroupSummary[];
  loading: boolean;
  error: string | null;
}
