import { BrowserRouter, Routes, Route } from "react-router-dom";
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
