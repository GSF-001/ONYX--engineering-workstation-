import { useNotifications } from "./NotificationManager";
import { Toast } from "./Toast";
import { TOKENS } from "../theme";

/**
 * Renders the live toast stack, top-right. Mount once alongside
 * NotificationManager — this is the only component that actually draws
 * notifications on screen.
 */
export function Popup() {
  const { notifications, dismiss } = useNotifications();
  const visible = notifications.slice(0, 4);

  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        zIndex: TOKENS.zIndex.toast,
      }}
    >
      {visible.map((n) => (
        <Toast key={n.id} tone={n.tone} title={n.title} body={n.body} onDismiss={() => dismiss(n.id)} />
      ))}
    </div>
  );
}
