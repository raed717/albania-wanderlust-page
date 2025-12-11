import { apiClient } from "./apiClient";
import {
  AuthError,
  Session,
  User,
  SignUpWithPasswordCredentials,
  SignInWithPasswordCredentials,
} from "@supabase/supabase-js";

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

export const authService = {
  /**
   * Sign up with email and password
   */
  async signUp(
    credentials: SignUpWithPasswordCredentials
  ): Promise<AuthResponse> {
    const { data, error } = await apiClient.auth.signUp(credentials);

    // Create user profile in public.users table with default role
    if (data.user && !error) {
      console.log("Creating user profile for new user:", data.user.id);
      console.log("Creating user data:", data);
      await this.ensureUserProfile(data.user.id, data.user.user_metadata || "");
    }

    return { user: data.user, session: data.session, error };
  },

  /**
   * Sign in with email and password
   */
  async signIn(
    credentials: SignInWithPasswordCredentials
  ): Promise<AuthResponse> {
    const { data, error } =
      await apiClient.auth.signInWithPassword(credentials);
    return { user: data.user, session: data.session, error };
  },

  /**
   * Sign in with Google
   */
  async signInWithGoogle() {
    const { data, error } = await apiClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}`,
      },
    });
    return { data, error };
  },

  /**
   * Sign out
   */
  async signOut() {
    try {
      const { error } = await apiClient.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        return { error, success: false };
      }
      console.log("User signed out successfully");
      return { error: null, success: true };
    } catch (err: any) {
      console.error("Unexpected error during sign out:", err);
      return { error: err, success: false };
    }
  },

  /**
   * Get current session
   */
  async getSession() {
    const { data, error } = await apiClient.auth.getSession();
    console.log(data, error);
    return { session: data.session, error };
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    const { data, error } = await apiClient.auth.getUser();
    if (error) throw error;
    console.log(data.user);

    return data.user;
  },

  /**
   * Get current user role from public.users table
   */
  async getCurrentUserRole() {
    const { data: authData, error: authError } = await apiClient.auth.getUser();
    if (authError) throw authError;

    // Fetch role from public.users table
    const { data: profile, error: profileError } = await apiClient
      .from("users")
      .select("role")
      .eq("id", authData.user.id)
      .single();

    if (profileError) {
      console.error("Error fetching user role:", profileError);
      return "user"; // Default role
    }

    console.log("current user role:", profile?.role);
    return profile?.role || "user";
  },

  /**
   * Ensure user profile exists in public.users table
   */
  async ensureUserProfile(userId: string, user_metadata: any) {
    try {
      const { error } = await apiClient.from("users").upsert(
        {
          id: userId,
          email: user_metadata.email,
          full_name: user_metadata.full_name || "",
          location: user_metadata.location || "",
          role: "user", // Set default role      
        },
        { onConflict: "id" }
      );

      if (error) {
        console.error("Error creating user profile:", error);
        throw error;
      }
      console.log("User profile created successfully with default role 'user'");
    } catch (err) {
      console.error("Error in ensureUserProfile:", err);
      // Don't throw - allow signup to complete even if profile creation fails
    }
  },
};
