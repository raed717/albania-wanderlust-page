import { apiClient } from "./apiClient";
import {
  Hotel,
  CreateHotelDto,
  UpdateHotelDto,
  HotelFilters,
} from "@/types/hotel.types";

/**
 * Fetch all hotels
 */
export const getAllHotels = async (): Promise<Hotel[]> => {
  //console.log("[Hotel Service] Fetching all hotels...");
  const { data, error } = await apiClient.from("hotel").select("*");
  if (error) {
    console.error("[Hotel Service] Error fetching hotels:", error);
    throw error;
  }
  return data || [];
};

/**
 * Fetch hotles by providerId
 */
export const getAllHotelsByProviderId = async (
  providerId: string
): Promise<Hotel[]> => {
  //console.log("[Hotel Service] Fetching all hotels...");
  const { data, error } = await apiClient
    .from("hotel")
    .select("*")
    .eq("providerId", providerId);
  if (error) {
    console.error("[Hotel Service] Error fetching hotels:", error);
    throw error;
  }
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
    .select("*");

  if (error) {
    console.error(`[Hotel Service] Error updating hotel ID ${id}:`, error);
    throw error;
  }

  if (!updatedHotel || updatedHotel.length === 0) {
    const error = new Error(
      "Update failed: Hotel not found or permission denied"
    );
    console.error(`[Hotel Service] Error updating hotel ID ${id}:`, error);
    throw error;
  }

  console.log("[Hotel Service] Successfully updated hotel:", updatedHotel[0]);
  return updatedHotel[0];
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

/**
 * Search hotels with filters (client-side filtering)
 */
export const searchHotels = async (
  filters?: HotelFilters
): Promise<Hotel[]> => {
  try {
    const hotels = await getAllHotels();

    if (!filters) {
      return hotels;
    }

    return hotels.filter((hotel) => {
      // Search term filter
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        const matchesSearch =
          hotel.name.toLowerCase().includes(term) ||
          hotel.location?.toLowerCase().includes(term) ||
          hotel.address?.toLowerCase().includes(term);
        if (!matchesSearch) return false;
      }

      // Price range filter
      if (filters.priceRange) {
        if (
          hotel.price < filters.priceRange.min ||
          hotel.price > filters.priceRange.max
        ) {
          return false;
        }
      }

      // Rating filter
      if (filters.rating && filters.rating !== "all") {
        const threshold = parseFloat(filters.rating);
        if (hotel.rating < threshold) return false;
      }

      // Status filter
      if (filters.status && filters.status !== "all") {
        if (hotel.status !== filters.status) return false;
      }

      // Rooms filter
      if (filters.rooms) {
        if (filters.rooms.min && hotel.rooms < filters.rooms.min) return false;
        if (filters.rooms.max && hotel.rooms > filters.rooms.max) return false;
      }

      // Amenities filter
      if (filters.amenities) {
        if (filters.amenities.wifi && !hotel.wifi) return false;
        if (filters.amenities.parking && !hotel.parking) return false;
        if (filters.amenities.pool && !hotel.pool) return false;
        if (filters.amenities.gym && !hotel.gym) return false;
        if (filters.amenities.spa && !hotel.spa) return false;
        if (filters.amenities.restaurant && !hotel.restaurant) return false;
        if (filters.amenities.bar && !hotel.bar) return false;
      }

      return true;
    });
  } catch (err) {
    console.error("[Hotel Service] Error searching hotels:", err);
    throw err;
  }
};

// Export all services as a single object for easier imports
const hotelService = {
  getAllHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
  searchHotels,
};

export default hotelService;
