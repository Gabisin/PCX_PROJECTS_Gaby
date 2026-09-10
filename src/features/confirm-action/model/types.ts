export type ConfirmActionTone = "default" | "destructive";

export interface ConfirmActionReasonConfig {
  label: string;
  placeholder?: string;
  /** Quando true, o botão de confirmação não avança sem texto — regra usada em rejeições/cancelamentos. */
  required?: boolean;
  requiredError?: string;
}

export interface ConfirmActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  /** "destructive" para eliminar/rejeitar/revogar; "default" para aprovar/confirmar. */
  tone?: ConfirmActionTone;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  /** Presença = mostra um campo de motivo/comentário; `required` decide se é obrigatório para avançar. */
  reason?: ConfirmActionReasonConfig;
  /** Campos extra específicos do domínio (ex.: "dias de impacto" numa aprovação) — injectados entre a descrição e o motivo. */
  extraFields?: React.ReactNode;
  onConfirm: (reason?: string) => void | Promise<void>;
}
