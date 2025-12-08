import { defineConfig } from "vite";
import pkg from "./package.json";

export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "hexo-renderer-markdown-exit",
      formats: ["cjs"],
      fileName: () => "index.js",
    },
    rollupOptions: {
      external: [
        ...Object.keys(pkg.dependencies || {}),
        /^node:/,
        "hexo",
      ],
    },
  },
});
