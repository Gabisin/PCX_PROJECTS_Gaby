import * as React from "react";
import { Bell, CheckCheck, Clock, Filter } from "lucide-react";
import { useNotifications, type AppNotification } from "@entities/notification";
import { Card, CardContent } from "@shared/ui/card";
import { Button } from "@shared/ui/button";
import { cn } from "@shared/lib/cn";
import { formatTimeAgo } from "@shared/lib/formatTimeAgo";

type FilterType = "all" | "unread" | "read";

/**
 * Página de notificações completa - reproduz `app/notifications/page.tsx`
 * do req_portal: cabeçalho com ícone + contagem de não lidas + "marcar
 * todas como lidas", filtros all/unread/read, e a lista com o mesmo
 * tratamento visual do dropdown do Header (ícone circular, ponto de não
 * lida, timestamp) mas com a mensagem completa em vez de truncada.
 */
export function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const [filter, setFilter] = React.useState<FilterType>("all");

  const filtered = notifications.filter((n) => (filter === "unread" ? !n.isRead : filter === "read" ? n.isRead : true));
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  function handleClick(notification: AppNotification) {
    if (!notification.isRead) markAsRead(notification.id);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
              <Bell className="size-6 text-primary" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Notificações</h1>
              <p className="text-sm text-muted-foreground">
                {unreadCount > 0 ? `${unreadCount} não lida${unreadCount === 1 ? "" : "s"}` : "Tudo lido"}
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <CheckCheck aria-hidden="true" />
              Marcar todas como lidas
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Filter className="size-4 text-muted-foreground" aria-hidden="true" />
          <div className="flex gap-1">
            {(["all", "unread", "read"] as FilterType[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  filter === f ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                {f === "all" ? "Todas" : f === "unread" ? "Não lidas" : "Lidas"}
              </button>
            ))}
          </div>
        </div>
        
        {filtered.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-16 text-center">
              <Bell className="mx-auto mb-4 size-14 text-muted-foreground/50" aria-hidden="true" />
              <p className="mb-1 text-lg font-medium text-foreground">
                {filter === "unread" ? "Sem notificações por ler" : filter === "read" ? "Sem notificações lidas" : "Sem notificações"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {filtered.map((notification) => {
              const Icon = notification.icon ?? Bell;
              return (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => handleClick(notification)}
                  className={cn(
                    "w-full rounded-lg border border-border bg-card p-3 text-left transition-colors hover:bg-muted/60",
                    notification.isRead && "text-muted-foreground"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-full", notification.isRead ? "bg-muted" : "bg-primary/10")}>
                      <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-start justify-between gap-2">
                        <h3 className="line-clamp-1 text-sm font-semibold text-foreground">{notification.title}</h3>
                        {!notification.isRead && <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />}
                      </div>
                      <p className="mb-2 text-sm text-foreground/90">{notification.message}</p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="size-3" aria-hidden="true" />
                        {formatTimeAgo(notification.createdAt)}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
    </div>
  );
}
