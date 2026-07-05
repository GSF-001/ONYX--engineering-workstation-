/**
 * Tracks focus order for Alt+Tab-style cycling — separate from zIndex
 * because zIndex only tells you *current* stacking, not the sequence
 * windows were visited in.
 */
export class WindowHistory {
  private order: string[] = [];

  recordFocus(id: string): void {
    this.order = [id, ...this.order.filter((existing) => existing !== id)];
  }

  remove(id: string): void {
    this.order = this.order.filter((existing) => existing !== id);
  }

  /** Returns the window id that should receive focus next when cycling
   * forward from the currently focused id (wraps around). */
  next(currentId: string | null): string | null {
    if (this.order.length === 0) return null;
    if (!currentId) return this.order[0];
    const index = this.order.indexOf(currentId);
    if (index === -1) return this.order[0];
    return this.order[(index + 1) % this.order.length];
  }
}
