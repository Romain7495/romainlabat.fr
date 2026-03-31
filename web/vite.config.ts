import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

/** GitHub project pages: /<repo>/ ; user/org site (*.github.io repo): / */
const viteBase = (process.env.VITE_BASE ?? "/").replace(/\/?$/, "/");

export default defineConfig({
  base: viteBase,
  plugins: [react()],
  resolve: {
    alias: {
      "@content": path.join(repoRoot, "content"),
      "@assets": path.join(repoRoot, "assets"),
    },
  },
  server: {
    fs: {
      allow: [repoRoot],
    },
  },
});
