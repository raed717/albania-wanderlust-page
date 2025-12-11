import { apiClient } from "./apiClient";
import {
  UserProfile,
  UpdateUserProfileData,
  User,
  UpdateUser,
} from "@/types/user.types";

class UserService {
  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    const { data, error } = await apiClient.auth.getUser();
    if (error) throw error;
    const response = await this.getUserById(data.user?.id!);
    return response as User;
  }

  async getUserById(userId: string): Promise<User> {
    const { data, error } = await apiClient
      .from("users")
      .select(
        "id, email, role, phone, created_at, updated_at, full_name, avatar_url, bio, location, status"
      )
      .eq("id", userId)
      .single();
    if (error) throw error;
    return {
      id: data.id,
      email: data.email,
      role: data.role,
      phone: data.phone,
      created_at: data.created_at,
      updated_at: data.updated_at,
      full_name: data.full_name,
      avatar_url: data.avatar_url,
      bio: data.bio,
      location: data.location,
      status: data.status,
    };
  }

  /**
   * get all users
   */
  async getAllUsers(): Promise<User[]> {
    const { data, error } = await apiClient
      .from("users")
      .select(
        "id, email, role, phone, created_at, updated_at, full_name, avatar_url, bio, location, status"
      );
    if (error) throw error;
    return data.map((user: any) => ({
      id: user.id,
      email: user.email,
      role: user.role,
      phone: user.phone,
      created_at: user.created_at,
      updated_at: user.updated_at,
      full_name: user.full_name,
      location: user.location,
      status: user.status,
      avatar_url: user.avatar_url,
      bio: user.bio,
    }));
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: UpdateUser): Promise<User> {
    // Update users table with new profile data
    const { data, error } = await apiClient
      .from("users")
      .update({
        full_name: updates.full_name,
        avatar_url: updates.avatar_url,
        phone: updates.phone,
        bio: updates.bio,
        location: updates.location,
        role: updates.role,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select(
        "id, email, role, phone, created_at, updated_at, full_name, avatar_url, bio, location, status"
      )
      .single();
    if (error) throw error;
    return {
      id: data.id,
      email: data.email,
      role: data.role,
      phone: data.phone,
      created_at: data.created_at,
      updated_at: data.updated_at,
      full_name: data.full_name,
      avatar_url: data.avatar_url,
      bio: data.bio,
      location: data.location,
      status: data.status,
    };
  }

  /**
   * Upload user avatar
   */
  async uploadAvatar(file: File): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await apiClient.storage
      .from("avatars")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = apiClient.storage.from("avatars").getPublicUrl(filePath);

    return data.publicUrl;
  }

  /**
   * Delete user avatar
   */
  async deleteAvatar(avatarPath: string): Promise<void> {
    const path = avatarPath.split("/avatars/")[1];
    if (!path) return;

    const { error } = await apiClient.storage
      .from("avatars")
      .remove([`avatars/${path}`]);

    if (error) throw error;
  }
}

export const userService = new UserService();
