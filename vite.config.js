import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    proxy: {
      "/api": {
        // target: `${import.meta.env.VITE_API_URL}`,
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
// target: `${import.meta.env.VITE_API_URL}`,
// target: "http://localhost:5000",
