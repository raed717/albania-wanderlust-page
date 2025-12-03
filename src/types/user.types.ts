export interface UserProfile {
    id: string;
    email: string;
    user_metadata: {
        full_name?: string;
        avatar_url?: string;
        phone?: string;
        bio?: string;
        location?: string;
        role?: "user" | "admin";
    };
    created_at: string;
    updated_at: string;
}

export interface UpdateUserProfileData {
    full_name?: string;
    avatar_url?: string;
    phone?: string;
    bio?: string;
    location?: string;
    role?: "user" | "admin";
}