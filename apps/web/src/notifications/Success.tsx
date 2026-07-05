// notifications/Success.tsx
import { useNotifications } from "./NotificationManager";
import { playSuccess } from "../audio";

export function useSuccessToast() {
  const { add } = useNotifications();
  return (title: string, body?: string) => {
    playSuccess();
    return add({ tone: "success", title, body, autoDismissMs: 4000 });
  };
}
