import * as React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutGrid, ShieldCheck } from "lucide-react";
import { PageShell } from "@widgets/page-shell";
import { useNotifications, type AppNotification } from "@entities/notification";
import { DropdownMenuItem } from "@shared/ui/dropdown-menu";
import { PermissionsDialog } from "@features/permissions-consent";
import { LanguageSwitcher } from "@features/language-switcher";
import { NAV_SECTIONS } from "@app/routes/nav";
import { resolveRouteTitle } from "@app/routes/routeTitles";
import { CURRENT_USER, MOCK_PERMISSION_SCOPES } from "@app/config/mockData";

function RouterLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  );
}

/** Logo — nas 3 apps de origem é sempre a imagem da Africell, centrada com borda inferior. Troca `public/africell_logo2.jpeg` pela tua marca para reaproveitar o layout noutro projecto. */
function BrandLogo() {
  return <img src="/africell_logo2.jpeg" alt="Africell" className="h-14 w-auto rounded object-contain" />;
}

/**
 * Layout route (app layer): monta o `PageShell` uma única vez — navegação,
 * utilizador, notificações, permissões MS 365 — e renderiza a página da
 * rota actual via `<Outlet/>`. As `pages/*` nunca importam isto directamente
 * (isso violaria a hierarquia de import do FSD, pages não pode depender de
 * app); é o router, aqui em `app/routes`, que as envolve.
 */
export function AppShell() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { notifications, markAsRead } = useNotifications();
  const [permissionsOpen, setPermissionsOpen] = React.useState(false);

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
        user={CURRENT_USER}
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
        onViewAllNotifications={() => navigate("/notifications")}
        accountMenuExtra={
          <DropdownMenuItem onClick={() => setPermissionsOpen(true)}>
            <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
            Permissões MS 365
          </DropdownMenuItem>
        }
        headerActions={
          <>
            <LanguageSwitcher />
            <Link
              to="/kit-showcase"
              className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex"
              title="Vitrine de componentes do UI kit"
            >
              <LayoutGrid className="size-4" aria-hidden="true" />
            </Link>
          </>
        }
        headerTitle={resolveRouteTitle(pathname)}
      >
        <Outlet />
      </PageShell>

      <PermissionsDialog open={permissionsOpen} onOpenChange={setPermissionsOpen} scopes={MOCK_PERMISSION_SCOPES} />
    </>
  );
}
