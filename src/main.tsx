import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Composition root. Once app/providers and app/routes are populated,
// replace this with <AppProviders><AppRouter /></AppProviders>.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>structure</h1>
      <p>Base FSD scaffold — see README.md.</p>
    </div>
  </StrictMode>
);
