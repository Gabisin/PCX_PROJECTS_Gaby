import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Para contadores (ex.: pedidos pendentes) - reforça visibilidade do estado do sistema. */
  badgeCount?: number;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}
