import { apiClient } from './apiClient';
import { UserProfile, UpdateUserProfileData } from '@/types/user.types';

class UserService {
    /**
     * Get current user profile
     */
    async getCurrentUser(): Promise<UserProfile> {
        const { data, error } = await apiClient.auth.getUser();
        if (error) throw error;
        return data.user as UserProfile;
    }

    /**
     * Update user profile
     */
    async updateProfile(updates: UpdateUserProfileData): Promise<UserProfile> {
        const { data, error } = await apiClient.auth.updateUser({
            data: updates,
        });
        if (error) throw error;
        return data.user as UserProfile;
    }

    /**
     * Upload user avatar
     */
    async uploadAvatar(file: File): Promise<string> {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await apiClient.storage
            .from('avatars')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = apiClient.storage
            .from('avatars')
            .getPublicUrl(filePath);

        return data.publicUrl;
    }

    /**
     * Delete user avatar
     */
    async deleteAvatar(avatarPath: string): Promise<void> {
        const path = avatarPath.split('/avatars/')[1];
        if (!path) return;

        const { error } = await apiClient.storage
            .from('avatars')
            .remove([`avatars/${path}`]);

        if (error) throw error;
    }
}

export const userService = new UserService();