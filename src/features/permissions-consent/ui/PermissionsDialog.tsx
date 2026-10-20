import { ShieldCheck, CircleCheck, CircleAlert, Lock } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@shared/ui/dialog";
import { Button } from "@shared/ui/button";
import { Badge } from "@shared/ui/badge";
import type { PermissionScope } from "@features/permissions-consent/model/types";

export interface PermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scopes: PermissionScope[];
  isRequesting?: boolean;
  onRequestConsent?: () => void;
}

const STATUS_ICON = {
  granted: <CircleCheck className="size-4 text-success" aria-hidden="true" />,
  required: <CircleAlert className="size-4 text-warning" aria-hidden="true" />,
  unknown: <Lock className="size-4 text-muted-foreground" aria-hidden="true" />,
};

/**
 * "Permissões MS 365" - reproduz o `ScopeConsentModal` do req_portal e do
 * legal_request_management_platform: lista os scopes pedidos pela app
 * agrupados, cada um com o estado de consentimento. Aqui é genérico
 * (`scopes` vem de fora) porque a verificação real depende do provedor de
 * auth de cada projecto (MSAL/NextAuth) - o kit só trata da apresentação.
 */
export function PermissionsDialog({ open, onOpenChange, scopes, isRequesting = false, onRequestConsent }: PermissionsDialogProps) {
  const groups = Array.from(new Set(scopes.map((s) => s.group)));
  const allGranted = scopes.length > 0 && scopes.every((s) => s.status === "granted");
  const hasPending = scopes.some((s) => s.status !== "granted");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
            Permissões Microsoft 365
          </DialogTitle>
          <DialogDescription>
            Permissões que esta aplicação pede para aceder aos serviços Microsoft 365 em teu nome. As já consentidas aparecem marcadas.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[400px] space-y-4 overflow-y-auto py-1 pr-1">
          {groups.map((group) => (
            <div key={group}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{group}</p>
              <div className="space-y-2">
                {scopes
                  .filter((s) => s.group === group)
                  .map((scope) => (
                    <div key={scope.label} className="flex items-start gap-3 rounded-lg border border-border bg-muted/40 p-3">
                      <div className="mt-0.5 flex w-5 shrink-0 justify-center">{STATUS_ICON[scope.status]}</div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium text-foreground">{scope.label}</p>
                          {scope.status === "granted" && <Badge tone="success">Consentido</Badge>}
                          {scope.status === "required" && <Badge tone="warning">Necessário</Badge>}
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">{scope.description}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 sm:flex-none">
            Fechar
          </Button>
          {allGranted ? (
            <Button disabled className="flex-1 bg-success text-success-foreground hover:bg-success sm:flex-none">
              <CircleCheck aria-hidden="true" />
              Todas as permissões concedidas
            </Button>
          ) : (
            <Button onClick={onRequestConsent} disabled={!hasPending} isLoading={isRequesting} className="flex-1 sm:flex-none">
              <ShieldCheck aria-hidden="true" />
              Conceder permissões em falta
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
