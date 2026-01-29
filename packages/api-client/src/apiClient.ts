import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Platform-agnostic environment variable access
// Works with both Vite (web) and Expo (mobile)
function getEnvVar(key: string): string | undefined {
  // Vite environment (web)
  // @ts-ignore - import.meta.env exists in Vite
  if (typeof import.meta !== "undefined" && import.meta.env) {
    // @ts-ignore
    return (import.meta.env as Record<string, string>)[key];
  }
  // Node.js / React Native environment
  if (typeof process !== "undefined" && process.env) {
    return process.env[key];
  }
  return undefined;
}

const supabaseUrl =
  getEnvVar("VITE_SUPABASE_URL") || getEnvVar("EXPO_PUBLIC_SUPABASE_URL");
const supabaseAnonKey =
  getEnvVar("VITE_SUPABASE_ANON_KEY") ||
  getEnvVar("EXPO_PUBLIC_SUPABASE_ANON_KEY");

if (!supabaseUrl) throw new Error("Missing SUPABASE_URL environment variable");
if (!supabaseAnonKey)
  throw new Error("Missing SUPABASE_ANON_KEY environment variable");

export const apiClient: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey,
);
