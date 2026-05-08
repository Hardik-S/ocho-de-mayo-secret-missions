import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Static deployment is deliberate: hash routing keeps every game route served by
// index.html on Vercel without server rewrites, backend functions, or a database.
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
  },
});
