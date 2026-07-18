interface ConfirmIdentityProps {
  disabled: boolean;
  loading: boolean;
  onConfirm: () => void;
}

export function ConfirmIdentity({ disabled, loading, onConfirm }: ConfirmIdentityProps) {
  return (
    <button
      className="win-button"
      style={{ width: "auto", padding: "6px 16px", background: "var(--win-accent)", color: "#06110d" }}
      disabled={disabled || loading}
      onClick={onConfirm}
    >
      {loading ? "Confirming..." : "Confirm Identity"}
    </button>
  );
}
