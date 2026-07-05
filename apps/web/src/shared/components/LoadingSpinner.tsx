import { cn } from "../utils/classNames";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

const SIZE_PX: Record<NonNullable<LoadingSpinnerProps["size"]>, number> = {
  sm: 14,
  md: 20,
  lg: 32,
};

export function LoadingSpinner({ size = "md", label, className }: LoadingSpinnerProps) {
  const px = SIZE_PX[size];

  return (
    <div className={cn("loading-spinner", className)} role="status" aria-live="polite">
      <svg
        width={px}
        height={px}
        viewBox="0 0 24 24"
        style={{ animation: "spin 0.8s linear infinite" }}
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="none"
          stroke="var(--color-border-bright)"
          strokeWidth="2.5"
        />
        <path
          d="M12 3a9 9 0 0 1 9 9"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      {label && <span style={{ color: "var(--color-text-dim)", fontSize: 13 }}>{label}</span>}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .loading-spinner { display: inline-flex; align-items: center; gap: 8px; }
      `}</style>
    </div>
  );
}
