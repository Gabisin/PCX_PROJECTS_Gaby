import type { StatusOption } from "@shared/types/status-option";
import type { RequestStatus } from "@entities/request/model/types";

/**
 * Único sítio que sabe o nome e a cor de cada status - exactamente o que
 * `COMPONENTS.md`/`USABILITY.md` prometiam: o `Badge`/`StatusSelector` do
 * kit são genéricos por `tone`, este mapeamento é que pertence ao domínio.
 */
export const REQUEST_STATUS_OPTIONS: (StatusOption & { value: RequestStatus })[] = [
  { value: "draft", label: "Rascunho", tone: "neutral" },
  { value: "submitted", label: "Submetido", tone: "info" },
  { value: "in_review", label: "Em Análise", tone: "warning" },
  { value: "awaiting_info", label: "Aguarda Informação", tone: "warning" },
  { value: "approved", label: "Aprovado", tone: "success" },
  { value: "completed", label: "Concluído", tone: "success" },
  { value: "rejected", label: "Rejeitado", tone: "destructive" },
  { value: "cancelled", label: "Cancelado", tone: "destructive" },
];

const BY_VALUE = new Map(REQUEST_STATUS_OPTIONS.map((o) => [o.value, o]));

export function getRequestStatusOption(status: RequestStatus) {
  return BY_VALUE.get(status) ?? REQUEST_STATUS_OPTIONS[0];
}
