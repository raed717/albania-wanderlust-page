import { apiClient } from "./apiClient";
import { Car, CreateCarDto, UpdateCarDto } from "@/types/car.types";
import { authService } from "./authService";
import { uploadCarImages } from "./storageService";

/**
 * Fetch all cars
 */
export const getAllCars = async (): Promise<Car[]> => {
    console.log("[Car Service] Fetching all cars...");
    const { data, error } = await apiClient.from("car").select("*");
    if (error) {
        console.error("[Car Service] Error fetching cars:", error);
        throw error;
    }
    console.log("[Car Service] Successfully fetched cars:", data);
    return data;
};

/**
 * fetch cars by owner id
 */
export const getCarsByOwnerId = async (providerId: string): Promise<Car[]> => {
    console.log(`[Car Service] Fetching cars for owner ID: ${providerId}`);
    const { data, error } = await apiClient
        .from("car")
        .select("*")
        .eq("providerId", providerId);
    if (error) {
        console.error(
            `[Car Service] Error fetching cars for owner ID ${providerId}:`,
            error
        );
        throw error;
    }
    console.log(
        `[Car Service] Successfully fetched cars for owner ID: ${providerId}`,
        data
    );
    return data;
};

/**
 * Fetch car by id
 */
export const getCarById = async (id: number): Promise<Car | null> => {
    console.log(`[Car Service] Fetching car with ID: ${id}`);

    const { data, error } = await apiClient
        .from("car")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error(`[Car Service] Error fetching car ID ${id}:`, error);
        throw error;
    }

    console.log(`[Car Service] Successfully fetched car ID: ${id}`, data);
    return data;
};

/**
 * add a new car with optional image uploads
 */
export const addCar = async (
    car: CreateCarDto,
    imageFiles?: File[]
): Promise<Car> => {
    console.log("[Car Service] Adding new car...");

    const providerId = await authService.getCurrentUserId();

    if (!providerId) {
        throw new Error("User not authenticated");
    }

    // Upload images first if provided
    let imageUrls: string[] = [];
    if (imageFiles && imageFiles.length > 0) {
        try {
            console.log("[Car Service] Uploading images...");
            const uploadResults = await uploadCarImages(imageFiles);
            imageUrls = uploadResults.map((result) => result.publicUrl);
            console.log("[Car Service] Images uploaded successfully");
        } catch (err) {
            console.error("[Car Service] Error uploading images:", err);
            throw new Error(
                `Failed to upload images: ${err instanceof Error ? err.message : "Unknown error"}`
            );
        }
    }

    const payload = {
        ...car,
        providerId: providerId,
        imageUrls: imageUrls.length > 0 ? imageUrls : car.imageUrls,
    };

    const { data, error } = await apiClient.from("car").insert(payload).select().single();

    if (error) {
        console.error("[Car Service] Error adding car:", error);
        throw error;
    }

    console.log("[Car Service] Successfully added car:", data);
    return data;
};


/**
 * update car by id with optional new image uploads
 */
export const updateCar = async (
    id: number,
    car: UpdateCarDto,
    newImageFiles?: File[]
): Promise<Car> => {
    console.log(`[Car Service] Updating car with ID: ${id}`);

    // Remove system fields that shouldn't be updated
    const updateData = { ...car };
    delete (updateData as any).id;
    delete (updateData as any).created_at;

    // Handle new image uploads
    if (newImageFiles && newImageFiles.length > 0) {
        try {
            console.log("[Car Service] Uploading new images...");
            const uploadResults = await uploadCarImages(newImageFiles, id);
            const newImageUrls = uploadResults.map((result) => result.publicUrl);

            // Append new images to existing ones
            updateData.imageUrls = [
                ...(updateData.imageUrls || []),
                ...newImageUrls,
            ];

            console.log("[Car Service] New images uploaded successfully");
        } catch (err) {
            console.error("[Car Service] Error uploading images:", err);
            throw new Error(
                `Failed to upload images: ${err instanceof Error ? err.message : "Unknown error"}`
            );
        }
    }

    const { data, error } = await apiClient
        .from("car")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error(`[Car Service] Error updating car ID ${id}:`, error);
        throw error;
    }

    console.log(`[Car Service] Successfully updated car ID: ${id}`, data);
    return data;
};

/**
 * delete car by id
 */
export const deleteCar = async (id: number): Promise<void> => {
    console.log(`[Car Service] Deleting car with ID: ${id}`);

    const { error } = await apiClient
        .from("car")
        .delete()
        .eq("id", id);

    if (error) {
        console.error(`[Car Service] Error deleting car ID ${id}:`, error);
        throw error;
    }

    console.log(`[Car Service] Successfully deleted car ID: ${id}`);
};