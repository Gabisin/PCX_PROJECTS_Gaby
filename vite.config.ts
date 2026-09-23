import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import path from "node:path";

const root = import.meta.dirname;

// FSD layer aliases — keep in sync with tsconfig.app.json "paths"
export default defineConfig({
  // basicSsl + porta 3000 → https://localhost:3000, para bater com VITE_MSAL_REDIRECT_URI
  // e o Redirect URI (SPA) registado no app registration do Azure.
  plugins: [react(), tailwindcss(), basicSsl()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@app": path.resolve(root, "src/app"),
      "@pages": path.resolve(root, "src/pages"),
      "@widgets": path.resolve(root, "src/widgets"),
      "@features": path.resolve(root, "src/features"),
      "@entities": path.resolve(root, "src/entities"),
      "@shared": path.resolve(root, "src/shared"),
    },
  },
});
