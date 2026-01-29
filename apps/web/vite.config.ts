import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import checker from "vite-plugin-checker";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  base: "/",
  plugins: [
    react(),
    checker({
      typescript: true,
    }),
  ],
  resolve: {
    alias: [
      {
        find: "@/services/api",
        replacement: path.resolve(__dirname, "../../packages/api-client/src"),
      },
      {
        find: "@/types",
        replacement: path.resolve(__dirname, "../../packages/shared-types/src"),
      },
      {
        find: "@",
        replacement: path.resolve(__dirname, "./src"),
      },
      {
        find: "@albania/shared-types",
        replacement: path.resolve(__dirname, "../../packages/shared-types/src"),
      },
      {
        find: "@albania/api-client",
        replacement: path.resolve(__dirname, "../../packages/api-client/src"),
      },
      {
        find: "@albania/hooks",
        replacement: path.resolve(__dirname, "../../packages/hooks/src"),
      },
      {
        find: "@albania/utils",
        replacement: path.resolve(__dirname, "../../packages/utils/src"),
      },
    ],
  },
}));
