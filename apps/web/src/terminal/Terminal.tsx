import { useCallback, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Console, type ConsoleLine } from "./Console";
import { Prompt } from "./Prompt";
import { parseCommandLine } from "./CommandParser";
import { createTerminalRegistry, type TerminalContext } from "./CommandRegistry";
import { getAutocompleteSuggestions, longestCommonPrefix } from "./AutoComplete";
import { TerminalHistory } from "./TerminalHistory";
import { useWindowManager } from "../window-manager";
import { useAuthUser } from "../auth";

let lineCounter = 0;
function nextLineId(): string {
  lineCounter += 1;
  return `line-${lineCounter}`;
}

/**
 * The Terminal application window. Registered in WINDOW_REGISTRY under
 * "terminal" — wraps Console/Prompt with real command dispatch against the
 * actual window manager, so `open dashboard` here does the same thing as
 * double-clicking the Dashboard icon.
 */
export default function Terminal() {
  const navigate = useNavigate();
  const manager = useWindowManager();
  const { user } = useAuthUser();
  const registry = useMemo(() => createTerminalRegistry(), []);
  const historyRef = useRef(new TerminalHistory());

  const [lines, setLines] = useState<ConsoleLine[]>([
    { id: nextLineId(), text: "ONYX Terminal v1.0.0 — type `help` to get started." },
  ]);
  const [input, setInput] = useState("");

  const print = useCallback((newLines: string[]) => {
    setLines((prev) => [...prev, ...newLines.map((text) => ({ id: nextLineId(), text }))]);
  }, []);

  const ctx: TerminalContext = {
    openApp: manager.open,
    closeApp: manager.close,
    listOpenApps: () => manager.windows.map((w) => w.title),
    navigate,
    clear: () => setLines([]),
    print,
  };

  const runCommand = useCallback(
    async (raw: string) => {
      historyRef.current.push(raw);
      setLines((prev) => [...prev, { id: nextLineId(), text: `$ ${raw}`, tone: "echo" }]);

      const parsed = parseCommandLine(raw);
      if (!parsed) return;

      if (parsed.name === "whoami") {
        print([user?.login ?? "not signed in"]);
        return;
      }

      const handler = registry.get(parsed.name);
      if (!handler) {
        setLines((prev) => [
          ...prev,
          { id: nextLineId(), text: `Command not found: ${parsed.name}. Try \`help\`.`, tone: "error" },
        ]);
        return;
      }

      await handler(parsed.args, ctx);
    },
    [registry, ctx, print, user]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = input;
      setInput("");
      void runCommand(value);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = historyRef.current.previous();
      if (prev !== null) setInput(prev);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = historyRef.current.next();
      if (next !== null) setInput(next);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const suggestions = getAutocompleteSuggestions(input, registry.names());
      const prefix = longestCommonPrefix(suggestions);
      if (prefix) setInput(prefix);
    }
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{ padding: 10, height: "100%", background: "#000", color: "#33FF66" }}
    >
      <Console lines={lines} />
      <Prompt username={user?.login ?? "guest"} value={input} />
      {/* Invisible input capturing keystrokes without rendering a native box,
          keeping the retro fake-terminal look while staying accessible. */}
      <input
        autoFocus
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="Terminal input"
        style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
      />
    </div>
  );
}
