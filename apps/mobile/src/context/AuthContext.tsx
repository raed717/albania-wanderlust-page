import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authService, apiClient } from "@albania/api-client";
import type { User } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { Platform } from "react-native";

// Required for expo-auth-session to work properly
WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  signUp: (
    email: string,
    password: string,
    userData?: { full_name?: string },
  ) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Handle deep link callbacks (for OAuth)
  const handleDeepLink = async (url: string) => {
    console.log("=== Handling Deep Link ===");
    console.log("URL:", url);

    if (!url.includes("access_token") && !url.includes("auth/callback")) {
      return;
    }

    try {
      const parsedUrl = new URL(url);
      let accessToken: string | null = null;
      let refreshToken: string | null = null;

      // Check hash fragment
      if (parsedUrl.hash) {
        const hashParams = new URLSearchParams(parsedUrl.hash.substring(1));
        accessToken = hashParams.get("access_token");
        refreshToken = hashParams.get("refresh_token");
      }

      // Check query params
      if (!accessToken) {
        accessToken = parsedUrl.searchParams.get("access_token");
        refreshToken = parsedUrl.searchParams.get("refresh_token");
      }

      if (accessToken) {
        console.log("Found access token in deep link, setting session...");
        const { data: sessionData, error: sessionError } =
          await apiClient.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || "",
          });

        if (!sessionError && sessionData.user) {
          await AsyncStorage.setItem("access_token", accessToken);
          setUser(sessionData.user);
          console.log("Session set from deep link:", sessionData.user.email);
        }
      }
    } catch (err) {
      console.error("Deep link handling error:", err);
    }
  };

  useEffect(() => {
    checkAuth();

    // Check for initial URL (app opened via deep link)
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log("Initial URL:", url);
        handleDeepLink(url);
      }
    });

    // Listen for deep links while app is running
    const linkSubscription = Linking.addEventListener("url", (event) => {
      handleDeepLink(event.url);
    });

    // Listen for auth state changes (important for OAuth callbacks)
    const {
      data: { subscription },
    } = apiClient.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      if (event === "SIGNED_IN" && session) {
        setUser(session.user);
        if (session.access_token) {
          await AsyncStorage.setItem("access_token", session.access_token);
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        await AsyncStorage.removeItem("access_token");
      }
    });

    return () => {
      linkSubscription.remove();
      subscription.unsubscribe();
    };
  }, []);

  async function checkAuth() {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const {
        user: newUser,
        session,
        error,
      } = await authService.signIn({
        email,
        password,
      });
      if (error) {
        return { success: false, error: error.message };
      }
      if (session?.access_token) {
        await AsyncStorage.setItem("access_token", session.access_token);
      }
      setUser(newUser);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Sign in failed",
      };
    }
  }

  async function signUp(
    email: string,
    password: string,
    userData?: { full_name?: string },
  ) {
    try {
      const {
        user: newUser,
        session,
        error,
      } = await authService.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });
      if (error) {
        return { success: false, error: error.message };
      }
      if (session?.access_token) {
        await AsyncStorage.setItem("access_token", session.access_token);
      }
      setUser(newUser);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Sign up failed",
      };
    }
  }

  async function signOut() {
    try {
      await authService.signOut();
      await AsyncStorage.removeItem("access_token");
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  }

  async function signInWithGoogle() {
    try {
      // Use Linking.createURL for Expo Go compatibility
      const redirectUri = Linking.createURL("auth/callback");

      console.log("=== Google Sign In Debug ===");
      console.log("Redirect URI:", redirectUri);
      console.log("Platform:", Platform.OS);

      // Start OAuth flow with Supabase
      const { data, error } = await apiClient.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUri,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        console.error("OAuth error:", error);
        return { success: false, error: error.message };
      }

      if (!data.url) {
        return { success: false, error: "No OAuth URL returned" };
      }

      console.log("OAuth URL:", data.url);

      // Warm up the browser for better performance on Android
      if (Platform.OS === "android") {
        await WebBrowser.warmUpAsync();
      }

      try {
        // Use openAuthSessionAsync which handles the redirect
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUri,
          {
            showInRecents: true,
            // On Android, don't create a new task - this helps with redirect
            createTask: false,
          },
        );

        console.log("=== Auth Session Result ===");
        console.log("Type:", result.type);

        if (result.type === "success" && result.url) {
          console.log("Success URL:", result.url);

          // Parse the URL to extract tokens
          const url = new URL(result.url);
          let accessToken: string | null = null;
          let refreshToken: string | null = null;

          // Check hash fragment first (OAuth implicit flow)
          if (url.hash) {
            const hashParams = new URLSearchParams(url.hash.substring(1));
            accessToken = hashParams.get("access_token");
            refreshToken = hashParams.get("refresh_token");
            console.log("Tokens from hash:", !!accessToken);
          }

          // Fall back to query params
          if (!accessToken) {
            accessToken = url.searchParams.get("access_token");
            refreshToken = url.searchParams.get("refresh_token");
            console.log("Tokens from query:", !!accessToken);
          }

          if (accessToken) {
            console.log("Setting session...");
            const { data: sessionData, error: sessionError } =
              await apiClient.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken || "",
              });

            if (sessionError) {
              console.error("Session error:", sessionError);
              return { success: false, error: sessionError.message };
            }

            await AsyncStorage.setItem("access_token", accessToken);
            setUser(sessionData.user);
            console.log("Sign in successful:", sessionData.user?.email);
            return { success: true };
          }

          return { success: false, error: "No access token in response" };
        }

        if (result.type === "cancel") {
          return { success: false, error: "Sign in was cancelled" };
        }

        if (result.type === "dismiss") {
          // Check if session was set via deep link handler
          const { data: sessionData } = await apiClient.auth.getSession();
          if (sessionData.session) {
            setUser(sessionData.session.user);
            return { success: true };
          }
          return { success: false, error: "Sign in was dismissed" };
        }

        return { success: false, error: "Authentication failed" };
      } finally {
        // Cool down browser on Android
        if (Platform.OS === "android") {
          await WebBrowser.coolDownAsync();
        }
      }
    } catch (error) {
      console.error("Google sign in error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Google sign in failed",
      };
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
