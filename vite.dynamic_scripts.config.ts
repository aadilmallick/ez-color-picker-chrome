import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "dist/public",
    copyPublicDir: false,
    lib: {
      entry: "public/eyedropper.js",
      name: "EyeDropper",
      formats: ["iife"],
      fileName(format, entryName) {
        return `${entryName}.${format}.js`;
      },
    },
    emptyOutDir: true,
  },
});
