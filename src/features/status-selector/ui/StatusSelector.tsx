import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/ui/select";
import type { StatusOption } from "@features/status-selector/model/types";

export interface StatusSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: StatusOption[];
  disabled?: boolean;
  placeholder?: string;
  "aria-label"?: string;
}

const DOT_CLASS: Record<StatusOption["tone"], string> = {
  neutral: "bg-muted-foreground",
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
  info: "bg-info",
  outline: "bg-foreground",
};

/**
 * Selector de status genérico - a lista de opções (com o `tone` de cada uma)
 * vem de fora, porque as transições válidas são regra de negócio de cada
 * domínio (ex.: um pedido "Em Aprovação" não pode saltar directo para
 * "Concluído" sem passar por "Aprovado" - essa regra fica em entities/*).
 * Restringir a um conjunto fixo de opções em vez de texto livre é
 * prevenção de erros (heurística 5) e reconhecimento em vez de memorização (6).
 */
export function StatusSelector({ value, onChange, options, disabled, placeholder = "Selecionar status", "aria-label": ariaLabel }: StatusSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger aria-label={ariaLabel ?? "Status"} className="w-auto min-w-40">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <span className="flex items-center gap-2">
              <span className={`size-2 rounded-full ${DOT_CLASS[option.tone]}`} aria-hidden="true" />
              {option.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
