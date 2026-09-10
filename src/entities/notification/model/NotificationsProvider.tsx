import * as React from "react";
import type { AppNotification } from "@entities/notification/model/types";
import { MOCK_NOTIFICATIONS } from "@entities/notification/model/mock";

interface NotificationsContextValue {
  notifications: AppNotification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationsContext = React.createContext<NotificationsContextValue | null>(null);

/**
 * Estado partilhado das notificações — para o dropdown do Header e a
 * página `/notifications` mostrarem sempre a mesma lista (marcar como lida
 * num sítio reflecte-se no outro). Fica em `entities` (não em `app`) porque
 * tanto `app/routes/AppShell` como `pages/notifications` precisam de o
 * consumir, e uma `page` não pode importar de `app` — só o inverso.
 * Semeado com dados mock; troca por um hook de fetching real
 * (`entities/notification/api`) num projecto a sério.
 */
export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = React.useState<AppNotification[]>(MOCK_NOTIFICATIONS);

  const markAsRead = React.useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  }, []);

  const markAllAsRead = React.useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const value = React.useMemo(() => ({ notifications, markAsRead, markAllAsRead }), [notifications, markAsRead, markAllAsRead]);

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  const ctx = React.useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications deve ser usado dentro de <NotificationsProvider>");
  return ctx;
}
