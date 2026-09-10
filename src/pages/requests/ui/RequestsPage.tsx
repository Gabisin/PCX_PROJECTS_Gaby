import * as React from "react";
import { Link } from "react-router-dom";
import { Search, ChevronDown, Plus, FolderOpen, User, Calendar, Eye } from "lucide-react";
import { MOCK_REQUESTS, REQUEST_STATUS_OPTIONS, RequestStatusBadge, type RequestStatus } from "@entities/request";
import { Input } from "@shared/ui/input";
import { Button } from "@shared/ui/button";
import { Card, CardContent } from "@shared/ui/card";
import { Skeleton } from "@shared/ui/skeleton";
import { Pagination } from "@shared/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@shared/ui/dropdown-menu";
import { formatTimeAgo } from "@shared/lib/formatTimeAgo";

const PAGE_SIZE = 6;

/**
 * Grelha de pedidos — reproduz à risca `RequestsListView` do
 * legal_request_management_platform: barra de pesquisa + filtro de status
 * em dropdown + botão de criar, grelha de cards (não tabela), estado vazio
 * ilustrado, e paginação centrada por baixo com a contagem "a mostrar X–Y de Z".
 */
export function RequestsPage() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<RequestStatus | "all">("all");
  const [page, setPage] = React.useState(1);
  // Simula o "loading" inicial que as 3 apps têm ao ir buscar dados a uma API real.
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return MOCK_REQUESTS.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!q) return true;
      return [r.number, r.title, r.type, r.requesterName, r.department].filter(Boolean).join(" ").toLowerCase().includes(q);
    }).sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  }, [search, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleStatusFilter(value: RequestStatus | "all") {
    setStatusFilter(value);
    setPage(1);
  }

  return (
    <div className="space-y-6">
        {/* Barra de ferramentas */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              placeholder="Pesquisar por número, título, requerente…"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-full shrink-0 gap-2 sm:w-auto">
                <span className="truncate">
                  {statusFilter === "all" ? "Todos os status" : REQUEST_STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label}
                </span>
                <ChevronDown className="size-3.5 opacity-60" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => handleStatusFilter("all")}>Todos os status</DropdownMenuItem>
              <DropdownMenuSeparator />
              {REQUEST_STATUS_OPTIONS.map((option) => (
                <DropdownMenuItem key={option.value} onClick={() => handleStatusFilter(option.value)}>
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button asChild className="w-full shrink-0 gap-2 sm:w-auto">
            <Link to="#">
              <Plus aria-hidden="true" />
              Novo Pedido
            </Link>
          </Button>
        </div>

        {/* Grelha */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="space-y-3 p-4">
                  <div className="flex justify-between gap-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {paginated.length === 0 ? (
              <Card className="col-span-full border-2 border-dashed">
                <CardContent className="flex flex-col items-center py-16 text-center">
                  <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-primary/10">
                    <FolderOpen className="size-8 text-primary/50" aria-hidden="true" />
                  </div>
                  <p className="mb-1 font-medium text-foreground">Sem pedidos</p>
                  <p className="text-sm text-muted-foreground">
                    {search || statusFilter !== "all" ? "Nenhum pedido corresponde aos filtros." : "Ainda não há pedidos criados."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              paginated.map((req) => (
                <Link key={req.id} to={`/requests/${req.id}`} className="group block h-full">
                  <Card className="flex h-full flex-col border-border transition-all duration-200 hover:border-primary/40 hover:shadow-md">
                    <CardContent className="flex flex-1 flex-col p-4">
                      <div className="mb-3 flex items-start justify-between gap-2">
                        <span className="inline-flex rounded border border-border bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                          {req.type}
                        </span>
                        <RequestStatusBadge status={req.status} />
                      </div>

                      <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                        {req.title}
                      </h3>
                      {req.description && <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">{req.description}</p>}

                      <div className="mt-auto flex items-end justify-between gap-2 border-t border-border pt-3">
                        <div className="min-w-0 space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <User className="size-3 shrink-0" aria-hidden="true" />
                            <span className="truncate">{req.requesterName}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="size-3 shrink-0" aria-hidden="true" />
                            <span>{formatTimeAgo(req.submittedAt)}</span>
                          </div>
                        </div>
                        <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors group-hover:text-primary">
                          <Eye className="size-3.5" aria-hidden="true" />
                          Ver
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        )}

        {!isLoading && filtered.length > 0 && (
          <>
            <p className="text-center text-sm text-muted-foreground">
              A mostrar {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length} pedidos
            </p>
            <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
          </>
        )}
    </div>
  );
}
