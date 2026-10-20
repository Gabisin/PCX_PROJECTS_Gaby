import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@shared/lib/cn";
import type { NavSection } from "@widgets/sidebar/model/types";

export interface SidebarProps {
  sections: NavSection[];
  /** Caminho activo (ex.: vindo de `useLocation().pathname` do react-router) - o widget não depende do router directamente. */
  activeHref: string;
  /** Elemento de navegação a usar por item (por omissão um <a>; passar o <Link> do router do projecto). */
  linkComponent?: React.ElementType<{ href: string; className?: string; children: React.ReactNode }>;
  /** Logo - nas 3 apps de origem é sempre uma imagem centrada, numa secção com borda inferior. */
  brand?: React.ReactNode;
  /** Controla a drawer em ecrãs pequenos; ignorado em desktop (a sidebar fica sempre visível a partir de `lg`). */
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

/**
 * Sidebar fixa, 256px - reproduz à risca o padrão de
 * `access_management_system/components/layout/Sidebar.tsx`: fundo em
 * gradiente subtil, item activo com fundo branco + sombra e o ícone dentro
 * de uma caixa preenchida na cor de marca (em vez de uma barra lateral),
 * com um ponto à direita a marcar a rota activa.
 */
export function Sidebar({ sections, activeHref, linkComponent, brand, isOpen, onOpenChange, className }: SidebarProps) {
  const Link = linkComponent ?? "a";

  const nav = (
    <nav aria-label="Navegação principal" className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
      {sections.map((section, i) => (
        <div key={section.title ?? i} className={cn("space-y-1", i > 0 && "pt-3")}>
          {section.title && (
            <p className="px-4 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {section.title}
            </p>
          )}
          {section.items.map((item) => {
            const isActive = activeHref === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive ? "bg-card text-primary shadow-md" : "text-muted-foreground hover:bg-card/60 hover:text-foreground hover:shadow-sm"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <div
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors",
                    isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}
                >
                  <item.icon className="size-5" aria-hidden="true" />
                </div>
                <span className="font-medium">{item.label}</span>
                {typeof item.badgeCount === "number" && item.badgeCount > 0 ? (
                  <span className="ml-auto flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground">
                    {item.badgeCount}
                  </span>
                ) : (
                  isActive && <div className="ml-auto size-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop: coluna fixa, sempre visível a partir de `lg` */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-gradient-to-br from-muted/60 to-background lg:flex",
          className
        )}
      >
        {brand && <div className="flex shrink-0 items-center justify-center border-b border-border px-6 py-5">{brand}</div>}
        {nav}
      </aside>

      {/* Mobile: drawer sobreposta com overlay + slide-in */}
      <div className={cn("fixed inset-0 z-40 lg:hidden", !isOpen && "pointer-events-none")} aria-hidden={!isOpen}>
        <div
          className={cn("absolute inset-0 bg-black/40 transition-opacity", isOpen ? "opacity-100" : "opacity-0")}
          onClick={() => onOpenChange(false)}
          aria-hidden="true"
        />
        <aside
          className={cn(
            "absolute inset-y-0 left-0 flex w-64 flex-col border-r border-border bg-gradient-to-br from-muted/60 to-background shadow-2xl transition-transform duration-300 ease-in-out",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="relative flex shrink-0 items-center justify-center border-b border-border px-6 py-5">
            {brand}
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label="Fechar navegação"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
          {nav}
        </aside>
      </div>
    </>
  );
}
