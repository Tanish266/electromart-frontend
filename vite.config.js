import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    proxy: {
      "/api": {
        target: `${process.env.REACT_APP_API_URL}`,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
// target: `${process.env.REACT_APP_API_URL}`,
// target: "http://localhost:5000",
