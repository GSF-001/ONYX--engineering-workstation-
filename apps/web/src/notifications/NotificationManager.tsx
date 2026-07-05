import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type NotificationTone = "info" | "success" | "warning" | "error";

export interface AppNotification {
  id: string;
  tone: NotificationTone;
  title: string;
  body?: ReactNode;
  createdAt: number;
  read: boolean;
  autoDismissMs?: number;
}

interface NotificationContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  add: (input: Omit<AppNotification, "id" | "createdAt" | "read">) => string;
  dismiss: (id: string) => void;
  markAllRead: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within a <NotificationManager>");
  return ctx;
}

let counter = 0;

/**
 * Root notification store. Mount once near the top of the desktop; Toast
 * rendering lives in Popup.tsx (which reads from this same context) so the
 * store and its visual stack are decoupled — other consumers (taskbar's
 * NotificationCounter) only need the count, not the rendering.
 */
export function NotificationManager({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const add = useCallback((input: Omit<AppNotification, "id" | "createdAt" | "read">) => {
    counter += 1;
    const id = `notif-${counter}`;
    const notification: AppNotification = { ...input, id, createdAt: Date.now(), read: false };
    setNotifications((prev) => [notification, ...prev].slice(0, 50));

    if (input.autoDismissMs) {
      setTimeout(() => dismiss(id), input.autoDismissMs);
    }
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const value = useMemo(
    () => ({ notifications, unreadCount, add, dismiss, markAllRead }),
    [notifications, unreadCount, add, dismiss, markAllRead]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}
