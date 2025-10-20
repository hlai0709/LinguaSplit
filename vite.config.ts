import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";  // Replit-only, disabled for production

export default defineConfig({
  plugins: [
    react(),
    // runtimeErrorOverlay(),  // Disabled for non-Replit deploy
    ...(process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined ? [
      // (await import("@replit/vite-plugin-cartographer")).cartographer(),  // Replit-only
      // (await import("@replit/vite-plugin-dev-banner")).devBanner(),  // Replit-only
    ] : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,  // Suppresses large chunk warning
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
