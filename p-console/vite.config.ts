import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(appRoot, "..");

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(appRoot, "./src"),
    },
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
    fs: {
      allow: [repoRoot],
    },
    proxy: {
      "/api": "http://127.0.0.1:8787",
      "/health": "http://127.0.0.1:8787",
    },
  },
  preview: {
    host: "127.0.0.1",
    port: 4173,
  },
  build: {
    chunkSizeWarningLimit: 1000,
  },
});
