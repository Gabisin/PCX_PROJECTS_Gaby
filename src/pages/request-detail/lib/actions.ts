import type { ConfirmActionReasonConfig, ConfirmActionTone } from "@features/confirm-action";
import type { RequestStatus } from "@entities/request";

export interface RequestAction {
  key: string;
  label: string;
  targetStatus: RequestStatus;
  tone: ConfirmActionTone;
  dialogTitle: string;
  dialogDescription: string;
  reason?: ConfirmActionReasonConfig;
}

/**
 * Que acções estão disponíveis a partir de cada status, e a regra de cada
 * uma (motivo opcional/obrigatório) - a mesma lógica de `getActionConfig`
 * em `legal_request_management_platform/StatusTransitionModal.tsx`,
 * simplificada para o fluxo genérico deste kit.
 */
export function getAvailableActions(status: RequestStatus): RequestAction[] {
  switch (status) {
    case "draft":
      return [
        {
          key: "submit",
          label: "Submeter",
          targetStatus: "submitted",
          tone: "default",
          dialogTitle: "Submeter este pedido?",
          dialogDescription: "O pedido passa a estar visível para análise.",
        },
      ];
    case "submitted":
    case "in_review":
    case "awaiting_info":
      return [
        {
          key: "approve",
          label: "Aprovar",
          targetStatus: "approved",
          tone: "default",
          dialogTitle: "Aprovar este pedido?",
          dialogDescription: "O requerente é notificado da aprovação.",
          reason: { label: "Comentário de aprovação", placeholder: "Opcional, visível para o requerente" },
        },
        {
          key: "request_info",
          label: "Pedir informação",
          targetStatus: "awaiting_info",
          tone: "default",
          dialogTitle: "Pedir mais informação ao requerente?",
          dialogDescription: "O pedido fica pendente até o requerente responder.",
          reason: { label: "O que falta esclarecer", placeholder: "Ex.: falta o orçamento actualizado", required: true, requiredError: "Descreve o que precisas que o requerente esclareça." },
        },
        {
          key: "reject",
          label: "Rejeitar",
          targetStatus: "rejected",
          tone: "destructive",
          dialogTitle: "Rejeitar este pedido?",
          dialogDescription: "Esta acção não pode ser desfeita. O requerente é notificado da rejeição.",
          reason: { label: "Motivo da rejeição", placeholder: "Explica porque o pedido está a ser rejeitado", required: true, requiredError: "O motivo da rejeição é obrigatório." },
        },
        {
          key: "cancel",
          label: "Cancelar pedido",
          targetStatus: "cancelled",
          tone: "destructive",
          dialogTitle: "Cancelar este pedido?",
          dialogDescription: "Esta acção não pode ser desfeita.",
          reason: { label: "Motivo do cancelamento", placeholder: "Explica porque o pedido está a ser cancelado", required: true, requiredError: "O motivo do cancelamento é obrigatório." },
        },
      ];
    case "approved":
      return [
        {
          key: "complete",
          label: "Concluir",
          targetStatus: "completed",
          tone: "default",
          dialogTitle: "Marcar este pedido como concluído?",
          dialogDescription: "Confirma que o pedido foi totalmente executado.",
          reason: { label: "Nota de conclusão", placeholder: "Opcional" },
        },
        {
          key: "cancel",
          label: "Cancelar pedido",
          targetStatus: "cancelled",
          tone: "destructive",
          dialogTitle: "Cancelar este pedido?",
          dialogDescription: "Esta acção não pode ser desfeita.",
          reason: { label: "Motivo do cancelamento", placeholder: "Explica porque o pedido está a ser cancelado", required: true, requiredError: "O motivo do cancelamento é obrigatório." },
        },
      ];
    default:
      // completed / rejected / cancelled - estados terminais, sem transições de avanço.
      return [];
  }
}
