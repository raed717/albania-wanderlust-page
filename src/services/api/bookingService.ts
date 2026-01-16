import { apiClient } from "./apiClient";
import { authService } from "./authService";
import { Booking } from "@/types/booking.type";
import { CreateBookingDto } from "@/types/booking.type";
import { getCarById } from "@/services/api/carService";
import { getAppartmentById } from "@/services/api/appartmentService";
import { getHotelById } from "@/services/api/hotelService";

/**
 * Create a new booking for the currently authenticated user
 */
export const createBooking = async (
  payload: CreateBookingDto
): Promise<Booking> => {
  const userId = await authService.getCurrentUserId();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await apiClient
    .from("booking")
    .insert({
      ...payload,
      userId,
      status: "pending",
      payment_status: "pending",
    })
    .select("*")
    .single();

  if (error) {
    console.error("[Booking Service] Error creating booking:", error);
    throw error;
  }

  return data as Booking;
};

/**
 * Get all bookings for the currently authenticated user (customer bookings)
 */
export const getCurrentUserBookings = async (): Promise<Booking[]> => {
  const userId = await authService.getCurrentUserId();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await apiClient
    .from("booking")
    .select("*")
    .eq("userId", userId)
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("[Booking Service] Error fetching user bookings:", error);
    throw error;
  }
  // get properties data for each booking
  for (const booking of data || []) {
    if (booking.propertyType === "car") {
      booking.propertyData = await getCarById(booking.propertyId);
    } else if (booking.propertyType === "apartment") {
      booking.propertyData = await getAppartmentById(booking.propertyId);
    } else if (booking.propertyType === "hotel") {
      booking.propertyData = await getHotelById(booking.propertyId);
    }
  }
  return data || [];
};

/*
 * Get all bookings for a specific provider (provider bookings)
 */
export const getBookingsByProviderId = async (): Promise<Booking[]> => {
  const providerId = await authService.getCurrentUserId();
  const { data, error } = await apiClient
    .from("booking")
    .select("*")
    .eq("providerId", providerId)
    .order("createdAt", { ascending: false });
  if (error) {
    console.error(
      "[Booking Service] Error fetching bookings for provider:",
      error
    );
    throw error;
  }
  return data || [];
};

/**
 * Update booking status
 */
export const updateBookingStatus = async (
  bookingId: string,
  status: Booking["status"]
): Promise<Booking> => {
  const { data, error } = await apiClient
    .from("booking")
    .update({
      status,
      updatedAt: new Date().toISOString(),
    })
    .eq("id", bookingId)
    .select("*")
    .single();

  if (error) {
    console.error("[Booking Service] Error updating booking status:", error);
    throw error;
  }

  return data as Booking;
};

/**
 * Get Booking by property id and type
 */
export const getBookingsByPropertyIdAndType = async (
  propertyId: string,
  propertyType: Booking["propertyType"]
): Promise<Booking[] | null> => {
  const { data, error } = await apiClient
    .from("booking")
    .select("*")
    .in("status", ["confirmed", "pending"])
    .eq("propertyId", propertyId)
    .eq("propertyType", propertyType);

  if (error) {
    console.error(
      "[Booking Service] Error fetching booking by property id and type:",
      error
    );
    throw error;
  }

  return data as Booking[] | null;
};

const bookingService = {
  createBooking,
  getCurrentUserBookings,
  getBookingsByProviderId,
  updateBookingStatus,
  getBookingsByPropertyIdAndType,
};

export default bookingService;
