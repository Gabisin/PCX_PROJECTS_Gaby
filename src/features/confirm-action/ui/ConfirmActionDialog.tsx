import * as React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@shared/ui/dialog";
import { Button } from "@shared/ui/button";
import { Label } from "@shared/ui/label";
import { Textarea } from "@shared/ui/textarea";
import type { ConfirmActionDialogProps } from "@features/confirm-action/model/types";

/**
 * Generaliza os vários dialogs de confirmação repetidos nas 3 apps
 * (ApproveChangeRequestDialog, RejectChangeRequestDialog, StatusTransitionModal,
 * ConfirmDialog…): mesmo esqueleto - título, descrição, motivo opcional ou
 * obrigatório consoante a acção, cancelar ou confirmar.
 *
 * Regra replicada das 3 apps: uma aprovação pode ter comentário opcional; uma
 * rejeição/cancelamento **exige** motivo - passar `reason.required` liga essa
 * regra. À semelhança do `ConfirmDialog` do access_management_system, o botão
 * não fica pré-desactivado: ao clicar sem motivo, mostra o erro em vez de
 * ficar simplesmente inerte (heurística 9 - ajudar a reconhecer/recuperar de erros).
 */
export function ConfirmActionDialog({
  open,
  onOpenChange,
  title,
  description,
  tone = "default",
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  isLoading = false,
  reason,
  extraFields,
  onConfirm,
}: ConfirmActionDialogProps) {
  const [reasonValue, setReasonValue] = React.useState("");
  const [error, setError] = React.useState("");

  // Reinicia o formulário sempre que o dialog reabre - ajuste de estado a
  // partir de uma prop, feito durante o render em vez de num efeito.
  const [wasOpen, setWasOpen] = React.useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setReasonValue("");
      setError("");
    }
  }

  function handleConfirm() {
    if (reason?.required && !reasonValue.trim()) {
      setError(reason.requiredError ?? `${reason.label} é obrigatório.`);
      return;
    }
    setError("");
    onConfirm(reasonValue.trim() || undefined);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className={tone === "destructive" ? "text-destructive" : undefined}>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {extraFields}

        {reason && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirm-action-reason" className={tone === "destructive" ? "text-destructive" : undefined}>
              {reason.label} {reason.required && "*"}
            </Label>
            <Textarea
              id="confirm-action-reason"
              value={reasonValue}
              onChange={(e) => {
                setReasonValue(e.target.value);
                if (error) setError("");
              }}
              placeholder={reason.placeholder}
              rows={3}
              disabled={isLoading}
              invalid={!!error}
              autoFocus
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button variant={tone === "destructive" ? "destructive" : "default"} onClick={handleConfirm} isLoading={isLoading}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
