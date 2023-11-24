import { defineConfig, normalizePath } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

function resolvePath(...args) {
  return normalizePath(path.resolve(...args));
}

const rootDir = resolvePath(__dirname);
const distDir = resolvePath(rootDir, "dist");

export default defineConfig({
  build: {
    outDir: distDir,
    sourcemap: true
  },
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolvePath(rootDir, "src")
    }
  },
  server: {
    port: 8080,
    proxy: {
      "/api": {
        target: "your https address",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      }
    }
  }
});
