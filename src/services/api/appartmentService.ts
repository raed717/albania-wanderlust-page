import { apiClient } from "./apiClient";
import {
  Appartment,
  CreateAppartmentDto,
  UpdateAppartmentDto,
  AppartmentFilters,
} from "@/types/appartment.type";
import { uploadImages } from "./storageService";
import { authService } from "./authService";
import { getBookingsByPropertyIdAndType } from "./bookingService";

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
* Get appartment unavailability dates by appartment id using booking service getBookingByPropertyIdAndType
*/
export const getAppartmentUnavailabilityDates = async (apId: number): Promise<string[]> => {
  const bookings = await getBookingsByPropertyIdAndType(apId.toString(), "apartment");

  if (!bookings || bookings.length === 0) {
    return [];
  }

  const unavailabilityDates: string[] = []; // Declare outside the loop

  bookings.forEach(booking => {
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);

    while (startDate <= endDate) {
      unavailabilityDates.push(startDate.toISOString().split('T')[0]);
      startDate.setDate(startDate.getDate() + 1);
    }
  });

  return unavailabilityDates; // Return the accumulated dates
};

/**
 * create a new appartment with image uploads
 */
export const createAppartment = async (
  data: CreateAppartmentDto,
  imageFiles?: File[]
): Promise<Appartment> => {
  console.log("[Apartment Service] Creating new apartment:", data);

  const providerId = await authService.getCurrentUserId();

  if (!providerId) {
    throw new Error("User not authenticated");
  }

  // Upload images first if provided
  let imageUrls: string[] = [];
  if (imageFiles && imageFiles.length > 0) {
    try {
      console.log("[Apartment Service] Uploading images...");
      const uploadResults = await uploadImages(imageFiles, "apartment");
      imageUrls = uploadResults.map((result) => result.publicUrl);
      console.log("[Apartment Service] Images uploaded successfully");
    } catch (err) {
      console.error("[Apartment Service] Error uploading images:", err);
      throw new Error(
        `Failed to upload images: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  }

  const payload = {
    ...data,
    providerId: providerId,
    imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
  };

  const { data: newAppartment, error } = await apiClient
    .from("appartment")
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error("[Apartment Service] Error creating apartment:", error);
    throw error;
  }

  console.log(
    "[Apartment Service] Successfully created apartment:",
    newAppartment
  );
  return newAppartment;
};

/**
 * update an existing appartment with optional image uploads
 */
export const updateAppartment = async (
  id: number,
  updates: UpdateAppartmentDto,
  newImageFiles?: File[]
): Promise<Appartment> => {
  console.log(`[Apartment Service] Updating apartment ID: ${id}`, updates);

  // Remove system fields that shouldn't be updated
  const updateData = { ...updates };
  delete (updateData as any).id;
  delete (updateData as any).created_at;

  // Handle new image uploads
  if (newImageFiles && newImageFiles.length > 0) {
    try {
      console.log("[Apartment Service] Uploading new images...");
      const uploadResults = await uploadImages(newImageFiles, "apartment", id);
      const newImageUrls = uploadResults.map((result) => result.publicUrl);

      // Append new images to existing ones
      if (updateData.imageUrls) {
        updateData.imageUrls = [
          ...(updateData.imageUrls || []),
          ...newImageUrls,
        ];
      } else {
        updateData.imageUrls = newImageUrls;
      }

      console.log("[Apartment Service] New images uploaded successfully");
    } catch (err) {
      console.error("[Apartment Service] Error uploading images:", err);
      throw new Error(
        `Failed to upload images: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  }

  const { data, error } = await apiClient
    .from("appartment")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(
      `[Apartment Service] Error updating apartment ID ${id}:`,
      error
    );
    throw error;
  }

  console.log("[Apartment Service] Successfully updated apartment:", data);
  return data;
};

/**
 * delete an appartment
 */
export const deleteAppartment = async (id: number): Promise<void> => {
  const { error } = await apiClient.from("appartment").delete().eq("id", id);
  if (error) throw error;
};

/*
 * Get apartment unavailability dates by apartment id using booking service getBookingByPropertyIdAndType
 */
export const getApartmentUnavailabilityDates = async (
  apartmentId: number
): Promise<string[]> => {
  const bookings = await getBookingsByPropertyIdAndType(
    apartmentId.toString(),
    "apartment"
  );

  if (!bookings || bookings.length === 0) {
    return [];
  }

  const unavailabilityDates: string[] = []; // Declare outside the loop

  bookings.forEach((booking) => {
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);

    while (startDate <= endDate) {
      unavailabilityDates.push(startDate.toISOString().split("T")[0]);
      startDate.setDate(startDate.getDate() + 1);
    }
  });

  return unavailabilityDates; // Return the accumulated dates
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
  getApartmentUnavailabilityDates,
};

export default appartmentService;
