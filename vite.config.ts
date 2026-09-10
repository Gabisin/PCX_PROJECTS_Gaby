import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

const root = import.meta.dirname;

// FSD layer aliases — keep in sync with tsconfig.app.json "paths"
export default defineConfig({
  plugins: [react(), tailwindcss()],
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
