import { cn } from "@shared/lib/cn";

/** Placeholder de carregamento - usar em vez de spinners para listas/cards, para reduzir "layout shift" (heurística 1: visibilidade do estado do sistema). */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}
