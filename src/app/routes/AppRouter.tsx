import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "@app/routes/AppShell";
import { RequestsPage } from "@pages/requests";
import { RequestDetailPage } from "@pages/request-detail";
import { NotificationsPage } from "@pages/notifications";
import { KitShowcasePage } from "@pages/kit-showcase";

/** Único sítio (além do `Sidebar`/`nav.tsx`) que conhece a topologia das rotas. */
export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Alvo do VITE_MSAL_REDIRECT_URI (igual ao access_management_system) - o MSAL
            devolve o browser aqui depois do login, isto só reencaminha para a home. */}
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route element={<AppShell />}>
          <Route path="/" element={<RequestsPage />} />
          <Route path="/requests/:id" element={<RequestDetailPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/kit-showcase" element={<KitShowcasePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
