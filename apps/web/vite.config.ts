import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import checker from "vite-plugin-checker";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env from monorepo root directory
  const env = loadEnv(mode, path.resolve(__dirname, "../.."), "");

  return {
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
          replacement: path.resolve(
            __dirname,
            "../../packages/shared-types/src",
          ),
        },
        {
          find: "@",
          replacement: path.resolve(__dirname, "./src"),
        },
        {
          find: "@albania/shared-types",
          replacement: path.resolve(
            __dirname,
            "../../packages/shared-types/src",
          ),
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
    // Expose VITE_ prefixed env vars to the client
    define: {
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(
        env.VITE_SUPABASE_URL,
      ),
      "import.meta.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(
        env.VITE_SUPABASE_ANON_KEY,
      ),
      "import.meta.env.VITE_PAYPAL_CLIENT_ID": JSON.stringify(
        env.VITE_PAYPAL_CLIENT_ID,
      ),
      "import.meta.env.VITE_PAYPAL_BASE_URL": JSON.stringify(
        env.VITE_PAYPAL_BASE_URL,
      ),
      "import.meta.env.VITE_PAYPAL_CLIENT_SECRET": JSON.stringify(
        env.VITE_PAYPAL_CLIENT_SECRET,
      ),
      "import.meta.env.VITE_FRONTEND_URL": JSON.stringify(
        env.VITE_FRONTEND_URL,
      ),
    },
  };
});
