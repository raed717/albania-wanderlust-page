import { useState, useEffect, useCallback } from "react";
import { authService } from "@albania/api-client";
import type { User } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  const checkAuth = useCallback(async () => {
    try {
      const user = await authService.getCurrentUser();
      setAuthState({
        user,
        isAuthenticated: !!user,
        loading: false,
      });
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const signIn = async (email: string, password: string) => {
    try {
      const { user, session, error } = await authService.signIn({
        email,
        password,
      });
      if (error) {
        return { success: false, error: error.message };
      }
      if (session?.access_token) {
        await AsyncStorage.setItem("access_token", session.access_token);
      }
      setAuthState({
        user,
        isAuthenticated: true,
        loading: false,
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Sign in failed",
      };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    userData?: { full_name?: string },
  ) => {
    try {
      const { user, session, error } = await authService.signUp({
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
      setAuthState({
        user,
        isAuthenticated: true,
        loading: false,
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Sign up failed",
      };
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      await AsyncStorage.removeItem("access_token");
      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    refreshAuth: checkAuth,
  };
}
