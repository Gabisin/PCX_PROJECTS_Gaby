import * as React from "react";
import { Plus, Trash2 } from "lucide-react";

import { PeoplePicker, type Person } from "@features/people-picker";
import { StatusSelector, type StatusOption } from "@features/status-selector";
import { ConfirmActionDialog } from "@features/confirm-action";

import { Button } from "@shared/ui/button";
import { Badge } from "@shared/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@shared/ui/card";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import { Separator } from "@shared/ui/separator";
import { Skeleton } from "@shared/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@shared/ui/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableEmptyState } from "@shared/ui/table";
import { Pagination } from "@shared/ui/pagination";
import { notify } from "@shared/ui/toast";

const MOCK_PEOPLE: Person[] = [
  { id: "1", name: "Ana Silva", email: "ana.silva@example.com" },
  { id: "2", name: "Bruno Costa", email: "bruno.costa@example.com" },
  { id: "3", name: "Carla Mendes", email: "carla.mendes@example.com" },
];

async function mockSearch(query: string): Promise<Person[]> {
  await new Promise((r) => setTimeout(r, 300));
  return MOCK_PEOPLE.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
}

const STATUS_OPTIONS: StatusOption[] = [
  { value: "draft", label: "Rascunho", tone: "neutral" },
  { value: "pending", label: "Em Aprovação", tone: "warning" },
  { value: "approved", label: "Aprovado", tone: "success" },
  { value: "rejected", label: "Rejeitado", tone: "destructive" },
];

const MOCK_ROWS = [
  { id: "REQ-001", subject: "Acesso ao SharePoint - Financeiro", status: "pending" },
  { id: "REQ-002", subject: "Alteração de projecto - Portal Legal", status: "approved" },
  { id: "REQ-003", subject: "Revogação de acesso - Ex-colaborador", status: "rejected" },
];

/**
 * Vitrine de componentes - não é uma página de produto. Mostra cada peça
 * do UI kit para (1) provar que app/widgets/features/shared estão bem
 * ligados, e (2) servir de catálogo visual para escolheres o que
 * reaproveitar. É renderizada dentro do mesmo layout route (`AppShell`)
 * que as páginas reais (Pedidos, Detalhe, Notificações) - ver `app/routes/AppRouter.tsx`.
 */
export function KitShowcasePage() {
  const [people, setPeople] = React.useState<Person[]>([]);
  const [status, setStatus] = React.useState("pending");
  const [rejectOpen, setRejectOpen] = React.useState(false);
  const [approveOpen, setApproveOpen] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [isConfirming, setIsConfirming] = React.useState(false);

  return (
    <>
    <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <section>
          <h1 className="text-xl font-semibold">Componentes essenciais</h1>
          <p className="text-sm text-muted-foreground">
            Amostra viva de tudo o que está pronto nesta fase. Ver COMPONENTS.md para o catálogo completo.
          </p>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Botões, badges e confirmação com regras</CardTitle>
            <CardDescription>
              Aprovar pede comentário opcional; rejeitar exige motivo - tenta confirmar a rejeição sem escrever nada.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-2">
            <Button onClick={() => setApproveOpen(true)}>
              <Plus /> Aprovar
            </Button>
            <Button variant="outline">Secundário</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive" onClick={() => setRejectOpen(true)}>
              <Trash2 /> Rejeitar
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Badge tone="success">Aprovado</Badge>
            <Badge tone="warning">Em Aprovação</Badge>
            <Badge tone="destructive">Rejeitado</Badge>
            <Badge tone="info">Em Análise</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Formulário</CardTitle>
            <CardDescription>Input, Label, StatusSelector e PeoplePicker (pesquisa simulada com debounce).</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="subject">Assunto</Label>
              <Input id="subject" placeholder="Ex.: Acesso ao SharePoint - Financeiro" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Status</Label>
              <StatusSelector value={status} onChange={setStatus} options={STATUS_OPTIONS} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Aprovadores</Label>
              <PeoplePicker value={people} onChange={setPeople} search={mockSearch} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tabela e paginação</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Assunto</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_ROWS.length === 0 ? (
                  <TableEmptyState colSpan={3} message="Sem pedidos para mostrar." />
                ) : (
                  MOCK_ROWS.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-mono text-xs">{row.id}</TableCell>
                      <TableCell>{row.subject}</TableCell>
                      <TableCell>
                        <Badge tone={STATUS_OPTIONS.find((o) => o.value === row.status)?.tone}>
                          {STATUS_OPTIONS.find((o) => o.value === row.status)?.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <Pagination page={page} pageCount={5} onPageChange={setPage} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tabs, tooltip e loading</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">Detalhes</TabsTrigger>
                <TabsTrigger value="history">Histórico</TabsTrigger>
              </TabsList>
              <TabsContent value="details">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm">
                      Passar o rato aqui
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Tooltip de exemplo</TooltipContent>
                </Tooltip>
              </TabsContent>
              <TabsContent value="history">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <ConfirmActionDialog
        open={approveOpen}
        onOpenChange={setApproveOpen}
        title="Aprovar este pedido?"
        description="O requerente é notificado da aprovação."
        confirmLabel="Aprovar"
        reason={{ label: "Comentário de aprovação", placeholder: "Opcional" }}
        isLoading={isConfirming}
        onConfirm={async () => {
          setIsConfirming(true);
          await new Promise((r) => setTimeout(r, 600));
          setIsConfirming(false);
          setApproveOpen(false);
          notify.success("Pedido aprovado.");
        }}
      />

      <ConfirmActionDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        title="Rejeitar este pedido?"
        description="Esta acção não pode ser desfeita. O requerente é notificado da rejeição."
        tone="destructive"
        confirmLabel="Rejeitar"
        reason={{ label: "Motivo da rejeição", placeholder: "Obrigatório", required: true, requiredError: "O motivo da rejeição é obrigatório." }}
        isLoading={isConfirming}
        onConfirm={async () => {
          setIsConfirming(true);
          await new Promise((r) => setTimeout(r, 600));
          setIsConfirming(false);
          setRejectOpen(false);
          notify.error("Pedido rejeitado.");
        }}
      />
    </>
  );
}
