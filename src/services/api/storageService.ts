import { apiClient } from "./apiClient";

/**
 * Supabase Storage Service
 * Handles file uploads and management for hotel images
 */

const BUCKET_NAME = "hotel-images";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export interface UploadResult {
  path: string;
  publicUrl: string;
  fileName: string;
}

/**
 * Upload a single image file to Supabase Storage
 * @param file - File object to upload
 * @param hotelId - Hotel ID (optional for folder organization)
 * @returns Upload result with public URL
 */
export const uploadHotelImage = async (
  file: File,
  hotelId?: string | number
): Promise<UploadResult> => {
  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(
      `Invalid file type. Allowed types: ${ALLOWED_TYPES.join(", ")}`
    );
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds 5MB limit`);
  }

  try {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const sanitizedFileName = file.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-\.]/g, "");

    // Create folder structure: hotel-images/{hotelId}/{timestamp}-{fileName}
    const folderPath = hotelId ? `hotel-${hotelId}` : "temp";
    const filePath = `${folderPath}/${timestamp}-${randomString}-${sanitizedFileName}`;

    console.log("[Storage Service] Uploading file:", filePath);
    console.log("[Storage Service] Bucket name:", BUCKET_NAME);
    console.log("[Storage Service] File size:", file.size, "bytes");
    console.log("[Storage Service] File type:", file.type);

    // Upload to Supabase Storage
    const { data, error } = await apiClient.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("[Storage Service] Upload error details:", {
        message: error.message,
        status: (error as any).status,
        statusText: (error as any).statusText,
      });

      // Provide helpful error messages
      if ((error as any).status === 400) {
        throw new Error(
          `Bad Request: The storage bucket may not exist or RLS policies are not configured. Make sure 'hotel-images' bucket exists and has proper RLS policies. Details: ${error.message}`
        );
      } else if ((error as any).status === 403) {
        throw new Error(
          `Access Denied: RLS policies are blocking the upload. Verify bucket permissions. Details: ${error.message}`
        );
      } else if ((error as any).status === 404) {
        throw new Error(
          `Storage bucket 'hotel-images' not found. Please create it in Supabase Dashboard > Storage. Details: ${error.message}`
        );
      }

      throw error;
    }

    if (!data) {
      throw new Error("Upload failed: No data returned from server");
    }

    // Get public URL
    const { data: publicUrlData } = apiClient.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    console.log("[Storage Service] File uploaded successfully:", data.path);
    console.log("[Storage Service] Public URL:", publicUrlData.publicUrl);

    return {
      path: data.path,
      publicUrl: publicUrlData.publicUrl,
      fileName: file.name,
    };
  } catch (err) {
    console.error("[Storage Service] Error uploading file:", err);
    throw err;
  }
};

/**
 * Upload multiple image files to Supabase Storage
 * @param files - Array of File objects to upload
 * @param hotelId - Hotel ID (optional for folder organization)
 * @returns Array of upload results
 */
export const uploadHotelImages = async (
  files: File[],
  hotelId?: string | number
): Promise<UploadResult[]> => {
  try {
    const uploadPromises = files.map((file) => uploadHotelImage(file, hotelId));
    const results = await Promise.all(uploadPromises);
    console.log("[Storage Service] Batch upload completed:", results.length);
    return results;
  } catch (err) {
    console.error("[Storage Service] Error during batch upload:", err);
    throw err;
  }
};

/**
 * Delete an image from Supabase Storage
 * @param filePath - Full path of the file to delete
 */
export const deleteHotelImage = async (filePath: string): Promise<void> => {
  try {
    console.log("[Storage Service] Deleting file:", filePath);

    const { error } = await apiClient.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error("[Storage Service] Delete error:", error);
      throw error;
    }

    console.log("[Storage Service] File deleted successfully:", filePath);
  } catch (err) {
    console.error("[Storage Service] Error deleting file:", err);
    throw err;
  }
};

/**
 * Delete multiple images from Supabase Storage
 * @param filePaths - Array of file paths to delete
 */
export const deleteHotelImages = async (filePaths: string[]): Promise<void> => {
  try {
    if (filePaths.length === 0) return;

    console.log("[Storage Service] Deleting files:", filePaths);

    const { error } = await apiClient.storage
      .from(BUCKET_NAME)
      .remove(filePaths);

    if (error) {
      console.error("[Storage Service] Batch delete error:", error);
      throw error;
    }

    console.log("[Storage Service] Files deleted successfully");
  } catch (err) {
    console.error("[Storage Service] Error during batch delete:", err);
    throw err;
  }
};

/**
 * Get public URL for a file
 * @param filePath - File path in storage
 * @returns Public URL
 */
export const getPublicUrl = (filePath: string): string => {
  const { data } = apiClient.storage.from(BUCKET_NAME).getPublicUrl(filePath);
  return data.publicUrl;
};

// Export all services
const storageService = {
  uploadHotelImage,
  uploadHotelImages,
  deleteHotelImage,
  deleteHotelImages,
  getPublicUrl,
};

export default storageService;
