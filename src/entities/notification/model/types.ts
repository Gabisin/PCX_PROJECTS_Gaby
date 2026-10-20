import type { LucideIcon } from "lucide-react";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  createdAt: string | Date;
  isRead: boolean;
  icon?: LucideIcon;
}
