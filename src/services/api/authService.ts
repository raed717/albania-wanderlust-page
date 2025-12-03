import { log } from "console";
import { apiClient } from "./apiClient";
import { AuthError, Session, User, SignUpWithPasswordCredentials, SignInWithPasswordCredentials } from "@supabase/supabase-js";

export interface AuthResponse {
    user: User | null;
    session: Session | null;
    error: AuthError | null;
}

export const authService = {
    /**
     * Sign up with email and password
     */
    async signUp(credentials: SignUpWithPasswordCredentials): Promise<AuthResponse> {
        const { data, error } = await apiClient.auth.signUp(credentials);
        return { user: data.user, session: data.session, error };
    },

    /**
     * Sign in with email and password
     */
    async signIn(credentials: SignInWithPasswordCredentials): Promise<AuthResponse> {
        const { data, error } = await apiClient.auth.signInWithPassword(credentials);
        return { user: data.user, session: data.session, error };
    },

    /**
     * Sign in with Google
     */
    async signInWithGoogle() {
        const { data, error } = await apiClient.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/dashboard/HotelsList`,
            },
        });
        return { data, error };
    },

    /**
     * Sign out
     */
    async signOut() {
        const { error } = await apiClient.auth.signOut();
        return { error };
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
        const { data: { user }, error } = await apiClient.auth.getUser();
        console.log(user, error);
        return { user, error };
    }
};
