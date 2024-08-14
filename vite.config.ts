import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { ManifestV3Export, crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";

const createManifest = (): ManifestV3Export => {
  return {
    ...manifest,
    background: {
      ...manifest.background,
      type: "module",
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest: createManifest() })],
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
      protocol: "http",
      host: "localhost",
    },
    host: "localhost",
  },
});
