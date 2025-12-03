import { apiClient } from "./apiClient";
import { Car, CreateCarDto, UpdateCarDto } from "@/types/car.types";

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
