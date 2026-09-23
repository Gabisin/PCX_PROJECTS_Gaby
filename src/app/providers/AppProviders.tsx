import * as React from "react";
import { I18nProvider } from "@shared/i18n";
import { TooltipProvider } from "@shared/ui/tooltip";
import { Toaster } from "@shared/ui/toast";
import { NotificationsProvider } from "@entities/notification";

/** Composition root dos providers globais. Sem modo escuro/claro - as 3 apps de origem também não têm, o kit segue um único tema. */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <NotificationsProvider>
        <TooltipProvider delayDuration={200}>
          {children}
          <Toaster />
        </TooltipProvider>
      </NotificationsProvider>
    </I18nProvider>
  );
}
