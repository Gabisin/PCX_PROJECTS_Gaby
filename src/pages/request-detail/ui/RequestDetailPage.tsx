import * as React from "react";
import { Link, useParams } from "react-router-dom";
import {
  ChevronDown,
  FileText,
  MessageCircle,
  BookOpen,
  Target,
  ArrowLeft,
  Download,
  Send,
  Circle,
} from "lucide-react";
import { getMockRequestById, RequestStatusBadge, type RequestHistoryEntry } from "@entities/request";
import { getAvailableActions, type RequestAction } from "@pages/request-detail/lib/actions";
import { ConfirmActionDialog } from "@features/confirm-action";
import { Avatar, AvatarFallback } from "@shared/ui/avatar";
import { Button } from "@shared/ui/button";
import { Card, CardContent } from "@shared/ui/card";
import { Textarea } from "@shared/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@shared/ui/dropdown-menu";
import { notify } from "@shared/ui/toast";
import { formatTimeAgo } from "@shared/lib/formatTimeAgo";
import { cn } from "@shared/lib/cn";

function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
}

function StatBlock({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <div>
        <p className="text-sm font-bold leading-none text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate font-medium text-foreground">{value}</span>
    </div>
  );
}

/**
 * Ecrã de detalhe — reproduz `RequestDetailView` (legal) /
 * `RequestDetailPage` (access_management_system): cartão de cabeçalho com
 * requerente + estatísticas + menu de acções, tabs (Detalhes/Histórico/
 * Documentos/Comentários), e o layout 2+1 colunas na tab de Detalhes.
 * As acções de aprovar/rejeitar/cancelar abrem sempre o mesmo
 * `ConfirmActionDialog`, configurado com a regra certa por
 * `pages/request-detail/lib/actions.ts`.
 */
export function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const initial = id ? getMockRequestById(id) : undefined;

  const [status, setStatus] = React.useState(initial?.status);
  const [history, setHistory] = React.useState<RequestHistoryEntry[]>(initial?.history ?? []);
  const [comments, setComments] = React.useState(initial?.comments ?? []);
  const [commentDraft, setCommentDraft] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("details");
  const [pendingAction, setPendingAction] = React.useState<RequestAction | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  if (!initial || !status) {
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="font-medium text-foreground">Este pedido não existe.</p>
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft aria-hidden="true" />
              Voltar aos pedidos
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const req = initial;
  const actions = getAvailableActions(status);

  function handleConfirmAction(reason?: string) {
    if (!pendingAction) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setHistory((prev) => [
        ...prev,
        { id: `h-${prev.length + 1}`, fromStatus: status, toStatus: pendingAction.targetStatus, actorName: "Ângela Amaro", comment: reason, createdAt: new Date().toISOString() },
      ]);
      setStatus(pendingAction.targetStatus);
      setIsSubmitting(false);
      setPendingAction(null);
      notify.success(`${req.number} → ${pendingAction.label}`);
    }, 500);
  }

  function handleAddComment() {
    if (!commentDraft.trim()) return;
    setComments((prev) => [...prev, { id: `c-${prev.length + 1}`, authorName: "Ângela Amaro", message: commentDraft.trim(), createdAt: new Date().toISOString() }]);
    setCommentDraft("");
    notify.success("Comentário adicionado.");
  }

  return (
    <>
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <Link to="/" className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Pedidos
        </Link>

        {/* Cartão de cabeçalho */}
        <Card>
          <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-3">
              <div className="sm:border-r sm:border-border sm:pr-6">
                <h1 className="mb-1.5 max-w-xs text-lg font-bold leading-tight text-foreground sm:text-xl">{req.title}</h1>
                <RequestStatusBadge status={status} />
              </div>

              <div className="flex items-center gap-3 sm:border-r sm:border-border sm:pr-6">
                <Avatar className="size-11 sm:size-12">
                  <AvatarFallback className="bg-primary text-base font-bold text-primary-foreground">{initials(req.requesterName)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold leading-tight text-foreground">{req.requesterName}</p>
                  <p className="truncate text-xs text-muted-foreground">{req.department}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <StatBlock icon={<FileText className="size-5 text-muted-foreground" aria-hidden="true" />} value={req.documents.length} label="Documentos" />
                <StatBlock icon={<MessageCircle className="size-5 text-muted-foreground" aria-hidden="true" />} value={comments.length} label="Comentários" />
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {actions.length > 0 ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      Acções
                      <ChevronDown className="size-3.5" aria-hidden="true" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {actions.map((action) => (
                      <DropdownMenuItem key={action.key} destructive={action.tone === "destructive"} onClick={() => setPendingAction(action)}>
                        {action.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setActiveTab("comments")}>
                  <MessageCircle aria-hidden="true" />
                  Comentar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Card className="overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="h-auto w-full justify-start rounded-none border-b border-border bg-transparent p-0">
              {[
                { value: "details", label: "Detalhes" },
                { value: "history", label: "Histórico" },
                { value: "documents", label: `Documentos (${req.documents.length})` },
                { value: "comments", label: `Comentários (${comments.length})` },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="shrink-0 whitespace-nowrap rounded-none border-b-2 border-transparent px-4 py-3 text-sm data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none sm:px-6"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="details" className="mt-0 p-6">
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <div className="space-y-6">
                    {req.description && (
                      <section>
                        <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                          <BookOpen className="size-4 text-primary" aria-hidden="true" />
                          Descrição
                        </h3>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{req.description}</p>
                      </section>
                    )}
                    {req.businessJustification && (
                      <section>
                        <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                          <Target className="size-4 text-primary" aria-hidden="true" />
                          Justificação de negócio
                        </h3>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{req.businessJustification}</p>
                      </section>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardContent className="space-y-3 p-4">
                      <h3 className="text-sm font-semibold text-foreground">Informações básicas</h3>
                      <InfoRow label="Número" value={req.number} />
                      <InfoRow label="Tipo" value={req.type} />
                      <InfoRow label="Departamento" value={req.department ?? "—"} />
                      <InfoRow label="Submetido" value={formatTimeAgo(req.submittedAt)} />
                      <InfoRow label="Email" value={req.requesterEmail ?? "—"} />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-0 p-6">
              {history.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">Sem histórico.</p>
              ) : (
                <ol className="space-y-6">
                  {history.map((entry, i) => (
                    <li key={entry.id} className="relative flex gap-4 pl-1">
                      {i < history.length - 1 && <span className="absolute left-[7px] top-5 h-full w-px bg-border" aria-hidden="true" />}
                      <Circle className="mt-1 size-3.5 shrink-0 fill-primary text-primary" aria-hidden="true" />
                      <div className="min-w-0 flex-1 pb-1">
                        <p className="text-sm font-medium text-foreground">
                          {entry.actorName} — <span className="text-muted-foreground">{formatTimeAgo(entry.createdAt)}</span>
                        </p>
                        {entry.comment && <p className="mt-1 text-sm text-muted-foreground">{entry.comment}</p>}
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </TabsContent>

            <TabsContent value="documents" className="mt-0 p-6">
              {req.documents.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">Sem documentos anexados.</p>
              ) : (
                <ul className="space-y-2">
                  {req.documents.map((doc) => (
                    <li key={doc.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <FileText className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{doc.sizeLabel}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" aria-label={`Descarregar ${doc.name}`}>
                        <Download className="size-4" aria-hidden="true" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>

            <TabsContent value="comments" className="mt-0 flex flex-col gap-4 p-6">
              {comments.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">Sem comentários ainda.</p>
              ) : (
                <ul className="space-y-4">
                  {comments.map((comment) => (
                    <li key={comment.id} className="flex gap-3">
                      <Avatar className="size-8 shrink-0">
                        <AvatarFallback className="text-xs">{initials(comment.authorName)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1 rounded-lg bg-muted/60 p-3">
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-foreground">{comment.authorName}</p>
                          <p className="text-xs text-muted-foreground">{formatTimeAgo(comment.createdAt)}</p>
                        </div>
                        <p className="text-sm text-foreground/90">{comment.message}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <div className={cn("flex gap-2", comments.length > 0 && "border-t border-border pt-4")}>
                <Textarea
                  value={commentDraft}
                  onChange={(e) => setCommentDraft(e.target.value)}
                  placeholder="Escreve um comentário…"
                  rows={2}
                  className="flex-1"
                />
                <Button onClick={handleAddComment} disabled={!commentDraft.trim()} className="self-end">
                  <Send aria-hidden="true" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {pendingAction && (
        <ConfirmActionDialog
          open={!!pendingAction}
          onOpenChange={(open) => !open && setPendingAction(null)}
          title={pendingAction.dialogTitle}
          description={pendingAction.dialogDescription}
          tone={pendingAction.tone}
          confirmLabel={pendingAction.label}
          reason={pendingAction.reason}
          isLoading={isSubmitting}
          onConfirm={handleConfirmAction}
        />
      )}
    </>
  );
}
