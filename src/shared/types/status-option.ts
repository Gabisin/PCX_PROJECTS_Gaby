import type { BadgeProps } from "@shared/ui/badge";

/**
 * Partilhado entre `features/status-selector` e qualquer `entities/*` que
 * precise de mapear o seu próprio enum de status para um `tone` do Badge -
 * fica em `shared` (não em `features`) precisamente para `entities` (camada
 * abaixo de `features`) lhe poder aceder sem violar a hierarquia de import.
 */
export interface StatusOption {
  value: string;
  label: string;
  tone: NonNullable<BadgeProps["tone"]>;
}
