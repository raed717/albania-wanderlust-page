export interface UserProfile {
  id: string;
  email: string;
  role?: "user" | "admin";
  phone?: string;
  created_at: string;
  updated_at: string;
  raw_user_meta_data?: {
    full_name?: string;
    avatar_url?: string;
    bio?: string;
    location?: string;
    role?: "user" | "admin";
  };
}

export interface UpdateUserProfileData {
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  bio?: string;
  location?: string;
  role?: "user" | "admin";
}
