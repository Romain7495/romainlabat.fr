import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

/**
 * Relative base so one build works for:
 * - https://user.github.io/repo/ (project Pages)
 * - https://custom-domain/ (same artifact at site root)
 * Optional: VITE_BASE=/foo/ for a fixed absolute base.
 */
const viteBase =
  process.env.VITE_BASE != null && process.env.VITE_BASE !== ""
    ? process.env.VITE_BASE.endsWith("/")
      ? process.env.VITE_BASE
      : `${process.env.VITE_BASE}/`
    : "./";

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
