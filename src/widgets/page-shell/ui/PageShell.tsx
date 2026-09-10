import * as React from "react";
import type { AppNotification } from "@entities/notification";
import { Sidebar, type NavSection } from "@widgets/sidebar";
import { Header, type HeaderUser } from "@widgets/header";

export interface PageShellProps {
  sections: NavSection[];
  activeHref: string;
  linkComponent?: React.ComponentProps<typeof Sidebar>["linkComponent"];
  brand?: React.ReactNode;
  user: HeaderUser;
  onLogout?: () => void;
  notifications?: AppNotification[];
  isLoadingNotifications?: boolean;
  onNotificationClick?: (notification: AppNotification) => void;
  onViewAllNotifications?: () => void;
  accountMenuExtra?: React.ReactNode;
  headerActions?: React.ReactNode;
  headerTitle?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Composição de página completa — reproduz à risca a estrutura do
 * DashboardLayout (req_portal) / AppLayout (access_management_system) /
 * layout com Sidebar+Header (legal_request_management_platform): sidebar
 * fixa de 256px, header fixo alinhado a partir dela (`lg:left-64` — mesmo
 * breakpoint da Sidebar), e o conteúdo compensado com padding para nunca
 * ficar por baixo de nenhum dos dois.
 *
 * Fica em `widgets` — não em `pages` — porque é reutilizada por todas as
 * páginas autenticadas; cada `pages/*` só lhe passa o conteúdo próprio.
 */
export function PageShell({
  sections,
  activeHref,
  linkComponent,
  brand,
  user,
  onLogout,
  notifications,
  isLoadingNotifications,
  onNotificationClick,
  onViewAllNotifications,
  accountMenuExtra,
  headerActions,
  headerTitle,
  children,
}: PageShellProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        sections={sections}
        activeHref={activeHref}
        linkComponent={linkComponent}
        brand={brand}
        isOpen={isMobileNavOpen}
        onOpenChange={setIsMobileNavOpen}
      />
      <Header
        user={user}
        onLogout={onLogout}
        notifications={notifications}
        isLoadingNotifications={isLoadingNotifications}
        onNotificationClick={onNotificationClick}
        onViewAllNotifications={onViewAllNotifications}
        accountMenuExtra={accountMenuExtra}
        onMenuClick={() => setIsMobileNavOpen(true)}
        actions={headerActions}
        title={headerTitle}
      />
      <main className="w-full pt-16 lg:pl-64">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
