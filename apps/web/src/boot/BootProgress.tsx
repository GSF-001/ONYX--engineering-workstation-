import type { BootStepState } from "./BootState";

interface BootProgressProps {
  steps: BootStepState[];
}

const STATUS_LABEL: Record<BootStepState["status"], string> = {
  pending: "",
  loading: "...",
  ok: "[ OK ]",
  fail: "[FAIL]",
};

export function BootProgress({ steps }: BootProgressProps) {
  return (
    <div style={{ fontFamily: "var(--win-font-mono, monospace)", fontSize: 13 }}>
      {steps.map((step) => (
        <div
          key={step.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            color: step.status === "pending" ? "var(--win-text-dim, #555)" : "var(--win-text, #fff)",
            padding: "2px 0",
          }}
        >
          <span>{step.label}...</span>
          <span
            style={{
              color:
                step.status === "ok"
                  ? "var(--win-success, #33FF66)"
                  : step.status === "fail"
                    ? "var(--win-danger, #E5534B)"
                    : "var(--win-text-dim, #555)",
              fontWeight: 700,
            }}
          >
            {STATUS_LABEL[step.status]}
          </span>
        </div>
      ))}
    </div>
  );
}
