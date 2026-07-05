import type { ReactNode } from "react";

interface ScreenshotFrameProps {
  title: string;
  children: ReactNode;
}

/**
 * Wraps a preview image/mock in a miniature window-chrome frame so the
 * landing page's screenshots read as "a window from the product" rather
 * than a plain <img>.
 */
export function ScreenshotFrame({ title, children }: ScreenshotFrameProps) {
  return (
    <div
      style={{
        border: "1px solid var(--color-border-bright)",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        background: "var(--color-bg-inset)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 10px",
          background: "var(--color-bg-raised)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#e0685f" }} />
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#e0a747" }} />
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4fd1ae" }} />
        <span
          style={{
            marginLeft: 8,
            fontSize: 11,
            fontFamily: "var(--font-display)",
            color: "var(--color-text-faint)",
          }}
        >
          {title}
        </span>
      </div>
      <div style={{ aspectRatio: "16/10", overflow: "hidden" }}>{children}</div>
    </div>
  );
}
