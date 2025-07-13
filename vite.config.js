import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    port: 5179,
    host: true,
    hmr: {
      port: 5179,
    },
  },
});
