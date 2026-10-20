import { CheckCircle2, UserPlus, MessageCircle } from "lucide-react";
import type { AppNotification } from "@entities/notification/model/types";

/** Dados de demonstração - troca por uma chamada real em `shared/api` quando ligares o teu backend. */
export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    title: "Pedido aprovado",
    message: "O pedido REQ-2026-002 - Alteração de âmbito foi aprovado.",
    createdAt: new Date(Date.now() - 5 * 60_000),
    isRead: false,
    icon: CheckCircle2,
  },
  {
    id: "n2",
    title: "Novo comentário",
    message: "Bruno Costa comentou no pedido REQ-2026-001.",
    createdAt: new Date(Date.now() - 90 * 60_000),
    isRead: false,
    icon: MessageCircle,
  },
  {
    id: "n3",
    title: "Novo membro na equipa",
    message: "Gonçalo Pires foi adicionado à equipa de Engenharia.",
    createdAt: new Date(Date.now() - 3 * 60 * 60_000),
    isRead: true,
    icon: UserPlus,
  },
];
