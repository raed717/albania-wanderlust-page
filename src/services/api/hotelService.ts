import { apiClient } from "./apiClient";
import { Hotel, CreateHotelDto, UpdateHotelDto } from "@/types/hotel.types";

/**
 * Fetch all hotels
 */
export const getAllHotels = async (): Promise<Hotel[]> => {
  console.log("[Hotel Service] Fetching all hotels...");
  const { data, error } = await apiClient.from("hotel").select("*");
  if (error) {
    console.error("[Hotel Service] Error fetching hotels:", error);
    throw error;
  }
  console.log("[Hotel Service] Successfully fetched hotels:", data);
  return data;
};

/**
 * Fetch a single hotel by ID
 */
export const getHotelById = async (id: number): Promise<Hotel | null> => {
  console.log(`[Hotel Service] Fetching hotel with ID: ${id}`);

  const { data, error } = await apiClient
    .from("hotel")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`[Hotel Service] Error fetching hotel ID ${id}:`, error);
    throw error;
  }

  console.log(`[Hotel Service] Successfully fetched hotel ID: ${id}`, data);
  return data;
};

/**
 * Create a new hotel
 */
export const createHotel = async (data: CreateHotelDto): Promise<Hotel> => {
  console.log("[Hotel Service] Creating new hotel:", data);

  const { data: newHotel, error } = await apiClient
    .from("hotel")
    .insert([data])
    .select()
    .single();

  if (error) {
    console.error("[Hotel Service] Error creating hotel:", error);
    throw error;
  }

  console.log("[Hotel Service] Successfully created hotel:", newHotel);
  return newHotel;
};

/**
 * Update an existing hotel
 */
export const updateHotel = async (
  id: number,
  data: UpdateHotelDto
): Promise<Hotel> => {
  console.log(`[Hotel Service] Updating hotel ID: ${id}`, data);

  // Remove system fields that shouldn't be updated
  const updateData = { ...data };
  delete (updateData as any).id;
  delete (updateData as any).created_at;

  const { data: updatedHotel, error } = await apiClient
    .from("hotel")
    .update(updateData)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error(`[Hotel Service] Error updating hotel ID ${id}:`, error);
    throw error;
  }

  console.log("[Hotel Service] Successfully updated hotel:", updatedHotel);
  return updatedHotel;
};

/**
 * Delete a hotel
 */
export const deleteHotel = async (id: number): Promise<void> => {
  console.log(`[Hotel Service] Deleting hotel ID: ${id}`);

  const { error } = await apiClient.from("hotel").delete().eq("id", id);

  if (error) {
    console.error(`[Hotel Service] Error deleting hotel ID ${id}:`, error);
    throw error;
  }

  console.log(`[Hotel Service] Successfully deleted hotel ID: ${id}`);
};

// Export all services as a single object for easier imports
const hotelService = {
  getAllHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
};

export default hotelService;
