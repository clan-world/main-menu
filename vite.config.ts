import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// `base` is intentionally left to the CLI (`--base=/main-menu/fable-v2/` in
// `npm run build:pages`). Every asset URL in the app goes through
// `import.meta.env.BASE_URL`, so the same bundle works at "/" and under a
// GitHub Pages sub-path.
export default defineConfig({
  plugins: [react()],
  build: {
    assetsInlineLimit: 0,
    target: "es2020",
  },
});
