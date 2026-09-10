import { FileText, Bell, LayoutGrid } from "lucide-react";
import type { NavSection } from "@widgets/sidebar";

export const NAV_SECTIONS: NavSection[] = [
  {
    items: [
      { label: "Pedidos", href: "/", icon: FileText },
      { label: "Notificações", href: "/notifications", icon: Bell },
    ],
  },
  {
    title: "Kit",
    items: [{ label: "Componentes UI", href: "/kit-showcase", icon: LayoutGrid }],
  },
];
