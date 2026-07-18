const STORAGE_KEY = "onyx.identityHandle";

export function getCachedHandle(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

export function setCachedHandle(handle: string): void {
  localStorage.setItem(STORAGE_KEY, handle);
}

export function clearCachedHandle(): void {
  localStorage.removeItem(STORAGE_KEY);
}
