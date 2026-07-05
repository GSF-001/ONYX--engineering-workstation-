/** Up/down-navigable command history, like a real shell's. */
export class TerminalHistory {
  private entries: string[] = [];
  private cursor = 0;

  push(entry: string): void {
    if (entry.trim().length === 0) return;
    this.entries.push(entry);
    this.cursor = this.entries.length;
  }

  previous(): string | null {
    if (this.cursor === 0) return null;
    this.cursor -= 1;
    return this.entries[this.cursor];
  }

  next(): string | null {
    if (this.cursor >= this.entries.length - 1) {
      this.cursor = this.entries.length;
      return this.cursor === this.entries.length ? "" : this.entries[this.cursor];
    }
    this.cursor += 1;
    return this.entries[this.cursor];
  }

  resetCursor(): void {
    this.cursor = this.entries.length;
  }
}
