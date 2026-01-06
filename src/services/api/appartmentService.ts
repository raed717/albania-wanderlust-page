import { apiClient } from "./apiClient";
import {
  Appartment,
  CreateAppartmentDto,
  UpdateAppartmentDto,
  AppartmentFilters,
} from "@/types/appartment.type";

/**
 * fetch all appatments
 */
export const getAllAppartments = async (): Promise<Appartment[]> => {
  const { data, error } = await apiClient.from("appartment").select("*");
  if (error) throw error;
  return data || [];
};

/**
 * fetch appartments by provider ID
 */
export const getAppartmentsByProviderId = async (
  providerId: string
): Promise<Appartment[]> => {
  const { data, error } = await apiClient
    .from("appartment")
    .select("*")
    .eq("providerId", providerId);
  if (error) throw error;
  return data;
};

/**
 * fetch a single appartment by ID
 */
export const getAppartmentById = async (
  id: number
): Promise<Appartment | null> => {
  const { data, error } = await apiClient
    .from("appartment")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};
/*
 * create a new appartment
 */
export const createAppartment = async (
  data: CreateAppartmentDto
): Promise<Appartment> => {
  const { data: newAppartment, error } = await apiClient
    .from("appartment")
    .insert([data])
    .select()
    .single();
  if (error) throw error;
  return newAppartment;
};

/**
 * update an existing appartment
 */
export const updateAppartment = async (
  id: number,
  updates: UpdateAppartmentDto
): Promise<Appartment> => {
  const { data, error } = await apiClient
    .from("appartment")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

/**
 * delete an appartment
 */
export const deleteAppartment = async (id: number): Promise<void> => {
  const { error } = await apiClient.from("appartment").delete().eq("id", id);
  if (error) throw error;
};

/**
 * Search apartments with filters (client-side filtering)
 */
export const searchAppartments = async (
  filters?: AppartmentFilters
): Promise<Appartment[]> => {
  try {
    const apartments = await getAllAppartments();

    if (!filters) {
      return apartments;
    }

    return apartments.filter((apt) => {
      // Search term filter
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        const matchesSearch =
          apt.name.toLowerCase().includes(term) ||
          apt.address?.toLowerCase().includes(term);
        if (!matchesSearch) return false;
      }

      // Price range filter
      if (filters.priceRange) {
        if (
          apt.price < filters.priceRange.min ||
          apt.price > filters.priceRange.max
        ) {
          return false;
        }
      }

      // Rating filter
      if (filters.rating && filters.rating !== "all") {
        const threshold = parseFloat(filters.rating);
        if (apt.rating < threshold) return false;
      }

      // Status filter
      if (filters.status && filters.status !== "all") {
        if (apt.status !== filters.status) return false;
      }

      // Rooms filter
      if (filters.rooms) {
        if (filters.rooms.min && apt.rooms < filters.rooms.min) return false;
        if (filters.rooms.max && apt.rooms > filters.rooms.max) return false;
      }

      // Beds filter
      if (filters.beds && apt.beds) {
        if (filters.beds.min && apt.beds < filters.beds.min) return false;
        if (filters.beds.max && apt.beds > filters.beds.max) return false;
      }

      // Bathrooms filter
      if (filters.bathrooms && apt.bathrooms) {
        if (filters.bathrooms.min && apt.bathrooms < filters.bathrooms.min)
          return false;
        if (filters.bathrooms.max && apt.bathrooms > filters.bathrooms.max)
          return false;
      }

      // Amenities filter
      if (filters.amenities && filters.amenities.length > 0) {
        if (!apt.amenities) return false;
        const hasAllAmenities = filters.amenities.every((amenity) =>
          apt.amenities?.some((a) =>
            a.toLowerCase().includes(amenity.toLowerCase())
          )
        );
        if (!hasAllAmenities) return false;
      }

      return true;
    });
  } catch (err) {
    console.error("[Apartment Service] Error searching apartments:", err);
    throw err;
  }
};

const appartmentService = {
  getAllAppartments,
  getAppartmentById,
  createAppartment,
  updateAppartment,
  deleteAppartment,
  searchAppartments,
};

export default appartmentService;
