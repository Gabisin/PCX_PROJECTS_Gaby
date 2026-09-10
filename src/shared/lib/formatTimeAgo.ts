/** "Há 5min" / "Ontem" / "Há 3 dias" — padrão de timestamp relativo repetido nas 3 apps de origem (notificações). */
export function formatTimeAgo(date: string | Date): string {
  const target = typeof date === "string" ? new Date(date) : date;
  const diffMs = Date.now() - target.getTime();

  if (diffMs < 60_000) return "Agora mesmo";

  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 60) return `Há ${minutes}min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Há ${hours}h`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "Ontem";
  return `Há ${days} dias`;
}
