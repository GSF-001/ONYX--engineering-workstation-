const ACTIVE_GROUP_KEY = "onyx.activeGroupId";

export function getActiveGroupId(): number | null {
  const raw = localStorage.getItem(ACTIVE_GROUP_KEY);
  return raw ? Number(raw) : null;
}

export function setActiveGroupId(id: number): void {
  localStorage.setItem(ACTIVE_GROUP_KEY, String(id));
}
