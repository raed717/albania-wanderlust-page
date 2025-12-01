/**
 * Hotel Service
 * 
 * Service layer for hotel CRUD operations.
 * Currently using mock data with console logging.
 * Ready to integrate with real backend by uncommenting API calls.
 */

import { Hotel, CreateHotelDto, UpdateHotelDto } from "@/types/hotel.types";
// import apiClient from "./apiClient";

/**
 * Fetch all hotels
 */
export const getAllHotels = async (): Promise<Hotel[]> => {
  console.log("[Hotel Service] Fetching all hotels");
  
  // TODO: Replace with real API call when backend is ready
  // const response = await apiClient.get<Hotel[]>("/hotels");
  // return response.data;
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("[Hotel Service] Successfully fetched hotels (mock data)");
      resolve([]);
    }, 300);
  });
};

/**
 * Fetch a single hotel by ID
 */
export const getHotelById = async (id: number): Promise<Hotel | null> => {
  console.log(`[Hotel Service] Fetching hotel with ID: ${id}`);
  
  // TODO: Replace with real API call when backend is ready
  // const response = await apiClient.get<Hotel>(`/hotels/${id}`);
  // return response.data;
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`[Hotel Service] Successfully fetched hotel ID: ${id} (mock data)`);
      resolve(null);
    }, 300);
  });
};

/**
 * Create a new hotel
 */
export const createHotel = async (data: CreateHotelDto): Promise<Hotel> => {
  console.log("[Hotel Service] Creating new hotel:", data);
  
  // TODO: Replace with real API call when backend is ready
  // const response = await apiClient.post<Hotel>("/hotels", data);
  // return response.data;
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const newHotel: Hotel = {
        ...data,
        id: Date.now(), // Generate temporary ID
      };
      console.log("[Hotel Service] Successfully created hotel:", newHotel);
      resolve(newHotel);
    }, 300);
  });
};

/**
 * Update an existing hotel
 */
export const updateHotel = async (
  id: number,
  data: UpdateHotelDto
): Promise<Hotel> => {
  console.log(`[Hotel Service] Updating hotel ID: ${id}`, data);
  
  // TODO: Replace with real API call when backend is ready
  // const response = await apiClient.put<Hotel>(`/hotels/${id}`, data);
  // return response.data;
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedHotel: Hotel = {
        id,
        name: data.name || "",
        location: data.location || "",
        rating: data.rating || 0,
        rooms: data.rooms || 0,
        occupancy: data.occupancy || 0,
        price: data.price || 0,
        status: data.status || "active",
        image: data.image || "",
        ...data,
      } as Hotel;
      console.log("[Hotel Service] Successfully updated hotel:", updatedHotel);
      resolve(updatedHotel);
    }, 300);
  });
};

/**
 * Delete a hotel
 */
export const deleteHotel = async (id: number): Promise<void> => {
  console.log(`[Hotel Service] Deleting hotel ID: ${id}`);
  
  // TODO: Replace with real API call when backend is ready
  // await apiClient.delete(`/hotels/${id}`);
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`[Hotel Service] Successfully deleted hotel ID: ${id}`);
      resolve();
    }, 300);
  });
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
