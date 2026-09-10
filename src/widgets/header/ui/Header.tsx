import * as React from "react";
import { Menu, Bell, LogOut, User as UserIcon } from "lucide-react";
import { formatTimeAgo } from "@shared/lib/formatTimeAgo";
import { Avatar, AvatarFallback, AvatarImage } from "@shared/ui/avatar";
import { Separator } from "@shared/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@shared/ui/dropdown-menu";
import { cn } from "@shared/lib/cn";
import type { AppNotification } from "@entities/notification";
import type { HeaderUser } from "@widgets/header/model/types";

export interface HeaderProps {
  user: HeaderUser;
  onLogout?: () => void;
  notifications?: AppNotification[];
  isLoadingNotifications?: boolean;
  onNotificationClick?: (notification: AppNotification) => void;
  onViewAllNotifications?: () => void;
  /** Botão de hambúrguer — só visível abaixo de `lg`, liga à Sidebar em modo drawer. */
  onMenuClick: () => void;
  /** Slot para ThemeSwitcher / LanguageSwitcher / outras features — o widget não as importa directamente. */
  actions?: React.ReactNode;
  /** Slot extra no menu de conta, entre o cabeçalho (nome/email) e "Terminar sessão" (ex.: link de definições/permissões). */
  accountMenuExtra?: React.ReactNode;
  title?: React.ReactNode;
}

function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
}

/**
 * Barra superior fixa — reproduz à risca o padrão de
 * req_portal/DashboardHeader, access_management_system/Header e
 * legal_request_management_platform/Header: título à esquerda, sino de
 * notificações com as 2 mais recentes + link "ver tudo", separador vertical,
 * e menu de conta com avatar + nome + cargo, terminando sempre em logout a vermelho.
 */
export function Header({
  user,
  onLogout,
  notifications = [],
  isLoadingNotifications = false,
  onNotificationClick,
  onViewAllNotifications,
  onMenuClick,
  actions,
  accountMenuExtra,
  title,
}: HeaderProps) {
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const recentNotifications = notifications.slice(0, 2);

  return (
    <header className="fixed inset-x-0 top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-card px-4 sm:px-6 lg:left-64">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Abrir navegação"
          className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
        {title && <h2 className="truncate text-lg font-bold tracking-tight text-foreground sm:text-xl">{title}</h2>}
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {actions}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Notificações"
              className="relative flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Bell className={cn("size-5", unreadCount > 0 && "text-primary")} aria-hidden="true" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 p-0 sm:w-80">
            <DropdownMenuLabel className="flex items-center justify-between p-3 sm:p-4">
              <span className="text-xs font-semibold sm:text-sm">Notificações</span>
              {unreadCount > 0 && <span className="text-[11px] font-medium text-primary">{unreadCount} não lidas</span>}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div>
              {isLoadingNotifications ? (
                <div className="p-4 text-center text-xs text-muted-foreground sm:text-sm">A carregar…</div>
              ) : recentNotifications.length > 0 ? (
                recentNotifications.map((notification) => {
                  const Icon = notification.icon ?? Bell;
                  return (
                    <DropdownMenuItem
                      key={notification.id}
                      className={cn("flex flex-col items-start gap-0 whitespace-normal p-2.5 sm:p-3", !notification.isRead && "bg-primary/5")}
                      onClick={() => onNotificationClick?.(notification)}
                    >
                      <div className="flex w-full items-start gap-2.5 sm:gap-3">
                        <div
                          className={cn(
                            "flex size-7 shrink-0 items-center justify-center rounded-full sm:size-8",
                            notification.isRead ? "bg-muted" : "bg-primary/10"
                          )}
                        >
                          <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-foreground sm:text-sm">{notification.title}</p>
                          <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground sm:text-xs">{notification.message}</p>
                          <p className="mt-1 text-[10px] text-muted-foreground sm:text-xs">{formatTimeAgo(notification.createdAt)}</p>
                        </div>
                        {!notification.isRead && <div className="mt-1 size-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />}
                      </div>
                    </DropdownMenuItem>
                  );
                })
              ) : (
                <div className="p-4 text-center text-xs text-muted-foreground sm:text-sm">Sem notificações novas</div>
              )}
            </div>
            {notifications.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="justify-center py-2.5 text-xs font-semibold text-primary"
                  onClick={onViewAllNotifications}
                >
                  {notifications.length > 2 ? `Ver todas (${notifications.length})` : "Ver todas"}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2.5 rounded-lg px-1.5 py-1 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:gap-3 sm:px-2"
              aria-label="Menu da conta"
            >
              <Avatar className="size-7 sm:size-8">
                <AvatarImage src={user.avatarUrl} alt="" />
                <AvatarFallback className="bg-primary text-[10px] text-primary-foreground sm:text-xs">
                  {user.name ? initials(user.name) : <UserIcon className="size-4" aria-hidden="true" />}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left lg:block">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                {user.role && <p className="text-xs text-muted-foreground">{user.role}</p>}
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">{user.name}</span>
                {user.email && <span className="text-xs font-normal text-muted-foreground">{user.email}</span>}
              </div>
            </DropdownMenuLabel>
            {accountMenuExtra && (
              <>
                <DropdownMenuSeparator />
                {accountMenuExtra}
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive onClick={onLogout}>
              <LogOut className="size-4" aria-hidden="true" />
              Terminar sessão
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
