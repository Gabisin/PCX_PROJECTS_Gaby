import * as React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { PageShell } from "@widgets/page-shell";
import type { HeaderUser } from "@widgets/header";
import { useNotifications, type AppNotification } from "@entities/notification";
import { DropdownMenuItem } from "@shared/ui/dropdown-menu";
import { PermissionsDialog } from "@features/permissions-consent";
import { LanguageSwitcher } from "@features/language-switcher";
import { useAuth } from "@features/auth";
import { NAV_SECTIONS } from "@app/routes/nav";
import { resolveRouteTitle } from "@app/routes/routeTitles";
import { MOCK_PERMISSION_SCOPES } from "@app/config/mockData";

function RouterLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  );
}

/** Logo - nas 3 apps de origem é sempre a imagem da Africell, centrada com borda inferior. Troca `public/africell_logo2.jpeg` pela tua marca para reaproveitar o layout noutro projecto. */
function BrandLogo() {
  return <img src="/africell_logo2.jpeg" alt="Africell" className="h-14 w-auto rounded object-contain" />;
}

/**
 * Layout route (app layer): monta o `PageShell` uma única vez - navegação,
 * utilizador, notificações, permissões MS 365 - e renderiza a página da
 * rota actual via `<Outlet/>`. As `pages/*` nunca importam isto directamente
 * (isso violaria a hierarquia de import do FSD, pages não pode depender de
 * app); é o router, aqui em `app/routes`, que as envolve.
 */
export function AppShell() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { notifications, markAsRead } = useNotifications();
  const { user, logout } = useAuth();
  const [permissionsOpen, setPermissionsOpen] = React.useState(false);

  // AppShell só é montado dentro do AuthGuard já autenticado - user nunca é null aqui.
  const headerUser: HeaderUser = { name: user!.name, email: user!.email };

  function handleNotificationClick(notification: AppNotification) {
    markAsRead(notification.id);
    navigate("/notifications");
  }

  return (
    <>
      <PageShell
        sections={NAV_SECTIONS}
        activeHref={pathname}
        linkComponent={RouterLink}
        brand={<BrandLogo />}
        user={headerUser}
        onLogout={() => {
          void logout();
        }}
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
        onViewAllNotifications={() => navigate("/notifications")}
        accountMenuExtra={
          <DropdownMenuItem onClick={() => setPermissionsOpen(true)}>
            <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
            Permissões MS 365
          </DropdownMenuItem>
        }
        headerActions={<LanguageSwitcher />}
        headerTitle={resolveRouteTitle(pathname)}
      >
        <Outlet />
      </PageShell>

      <PermissionsDialog open={permissionsOpen} onOpenChange={setPermissionsOpen} scopes={MOCK_PERMISSION_SCOPES} />
    </>
  );
}
