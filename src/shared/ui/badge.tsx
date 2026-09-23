import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@shared/lib/cn";

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      tone: {
        neutral: "border-transparent bg-muted text-muted-foreground",
        primary: "border-transparent bg-primary/10 text-primary",
        success: "border-transparent bg-success/10 text-success",
        warning: "border-transparent bg-warning/10 text-warning",
        destructive: "border-transparent bg-destructive/10 text-destructive",
        info: "border-transparent bg-info/10 text-info",
        outline: "border-border text-foreground",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * Badge genérico por "tone" semântico. As 3 apps de origem tinham um
 * StatusBadge por domínio (change-request, access-request, approval) que
 * mapeava um status de negócio para uma cor - esse mapeamento fica para a
 * camada `entities` de cada projecto (ex.: entities/request/lib/statusTone.ts),
 * que traduz o status para um destes `tone` antes de renderizar <Badge>.
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, tone, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ tone }), className)} {...props} />
  )
);
Badge.displayName = "Badge";
