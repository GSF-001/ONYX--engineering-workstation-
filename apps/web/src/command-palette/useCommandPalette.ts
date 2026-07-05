import { useCallback, useEffect, useMemo, useState } from "react";
import { buildCommandList, type Command, type CommandContext } from "./CommandList";

function matches(command: Command, query: string): boolean {
  if (!query) return true;
  const haystack = [command.label, command.hint, ...(command.keywords ?? [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
}

/**
 * Owns the palette's open/closed state, search query, filtered results,
 * and keyboard navigation (Up/Down/Enter/Escape). Ctrl/Cmd+K toggles it
 * globally regardless of what's focused.
 */
export function useCommandPalette(ctx: CommandContext) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const allCommands = useMemo(() => buildCommandList(ctx), [ctx]);
  const results = useMemo(
    () => allCommands.filter((command) => matches(command, query)),
    [allCommands, query]
  );

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  const open = useCallback(() => setIsOpen(true), []);

  const runActive = useCallback(() => {
    const command = results[activeIndex];
    if (command) {
      command.run();
      close();
    }
  }, [results, activeIndex, close]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        runActive();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, results.length, runActive, close]);

  useEffect(() => setActiveIndex(0), [query]);

  return { isOpen, open, close, query, setQuery, results, activeIndex, setActiveIndex, runActive };
}
