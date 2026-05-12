import { resolve } from "node:path";
import { copyFile, mkdir } from "node:fs/promises";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-extension-manifest",
      async closeBundle() {
        await mkdir(resolve(__dirname, "dist"), { recursive: true });
        await copyFile(resolve(__dirname, "manifest.json"), resolve(__dirname, "dist/manifest.json"));
      }
    }
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "src/popup/index.html"),
        wizard: resolve(__dirname, "src/wizard/index.html"),
        options: resolve(__dirname, "src/options/index.html"),
        serviceWorker: resolve(__dirname, "src/background/service-worker.ts")
      },
      output: {
        entryFileNames: (chunk) =>
          chunk.name === "serviceWorker" ? "background/service-worker.js" : "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name][extname]"
      }
    }
  }
});
