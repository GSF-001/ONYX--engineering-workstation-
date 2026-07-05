export type TeamRole = "owner" | "admin" | "member";

export interface TeamMember {
  id: number;
  teamId: number;
  userId: number;
  role: TeamRole;
  createdAt: string;
}

export interface Team {
  id: number;
  name: string;
  slug: string;
}
