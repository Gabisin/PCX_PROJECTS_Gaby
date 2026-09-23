interface RouteTitle {
  pattern: RegExp;
  title: string;
}

/** Mapeia rota → título do header - mesmo padrão de `resolvePageTitle`/`ROUTE_TITLES` no Header do access_management_system e do legal_request_management_platform. */
const ROUTE_TITLES: RouteTitle[] = [
  { pattern: /^\/requests\/[^/]+$/, title: "Detalhe do pedido" },
  { pattern: /^\/notifications$/, title: "Notificações" },
  { pattern: /^\/kit-showcase$/, title: "Componentes UI" },
  { pattern: /^\/$/, title: "Pedidos" },
];

export function resolveRouteTitle(pathname: string): string {
  return ROUTE_TITLES.find((r) => r.pattern.test(pathname))?.title ?? "";
}
