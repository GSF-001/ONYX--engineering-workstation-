interface PromptProps {
  username: string;
  value: string;
}

export function Prompt({ username, value }: PromptProps) {
  return (
    <div style={{ display: "flex", fontFamily: "var(--win-font-mono)", fontSize: 13 }}>
      <span style={{ color: "var(--win-success)", whiteSpace: "nowrap" }}>
        {username}@onyx-workstation:~$
      </span>
      <span style={{ marginLeft: 8, whiteSpace: "pre" }}>{value}</span>
      <span
        style={{
          display: "inline-block",
          width: 7,
          height: 14,
          background: "var(--win-text)",
          marginLeft: 1,
          animation: "term-caret 1s steps(1) infinite",
        }}
      />
      <style>{`@keyframes term-caret { 50% { opacity: 0; } }`}</style>
    </div>
  );
}
