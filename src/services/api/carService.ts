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

/**
 * add a new car
 */
export const addCar = async (car: CreateCarDto): Promise<Car> => {
    console.log("[Car Service] Adding new car...");

    const { data, error } = await apiClient.from("car").insert(car).select().single();

    if (error) {
        console.error("[Car Service] Error adding car:", error);
        throw error;
    }

    console.log("[Car Service] Successfully added car:", data);
    return data;
};


/**
 * update car by id
 */
export const updateCar = async (id: number, car: UpdateCarDto): Promise<Car> => {
    console.log(`[Car Service] Updating car with ID: ${id}`);

    const { data, error } = await apiClient
        .from("car")
        .update(car)
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