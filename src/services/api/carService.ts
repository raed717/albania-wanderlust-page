import { apiClient } from "./apiClient";
import { Car, CreateCarDto, UpdateCarDto } from "@/types/car.types";
import { authService } from "./authService";
import { uploadCarImages } from "./storageService";
import { getBookingsByPropertyIdAndType } from "./bookingService";
import { getMonthlyPrices, setMonthlyPrices } from "./monthlyPriceService";
import { MonthlyPriceInput } from "@/types/price.type";

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
      error,
    );
    throw error;
  }
  console.log(
    `[Car Service] Successfully fetched cars for owner ID: ${providerId}`,
    data,
  );
  return data;
};

/**
 * Fetch car by id (includes monthly prices)
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

  // Fetch monthly prices for this car
  let monthlyPrices: MonthlyPriceInput[] = [];
  try {
    const prices = await getMonthlyPrices(id, "car");
    monthlyPrices = prices.map((p) => ({
      month: p.month,
      pricePerDay: p.pricePerDay,
    }));
  } catch (priceError) {
    console.warn(
      `[Car Service] Could not fetch monthly prices for car ${id}:`,
      priceError,
    );
  }

  console.log(`[Car Service] Successfully fetched car ID: ${id}`, data);
  return { ...data, monthlyPrices };
};

/*
 * Get car unavailability dates by car id using booking service getBookingByPropertyIdAndType
 */
export const getCarUnavailabilityDates = async (
  carId: number,
): Promise<string[]> => {
  const bookings = await getBookingsByPropertyIdAndType(
    carId.toString(),
    "car",
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
 * add a new car with optional image uploads and monthly pricing
 */
export const addCar = async (
  car: CreateCarDto,
  imageFiles?: File[],
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
        `Failed to upload images: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    }
  }

  // Extract monthly prices from payload (they go to a separate table)
  const { monthlyPrices, ...carData } = car;

  const payload = {
    ...carData,
    providerId: providerId,
    imageUrls: imageUrls.length > 0 ? imageUrls : car.imageUrls,
  };

  const { data, error } = await apiClient
    .from("car")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("[Car Service] Error adding car:", error);
    throw error;
  }

  // Save monthly prices if provided
  if (monthlyPrices && monthlyPrices.length > 0 && data?.id) {
    try {
      console.log("[Car Service] Saving monthly prices...");
      await setMonthlyPrices(data.id, "car", monthlyPrices);
      console.log("[Car Service] Monthly prices saved successfully");
    } catch (priceError) {
      console.error("[Car Service] Error saving monthly prices:", priceError);
      // Don't throw - car was created successfully, just log the error
    }
  }

  console.log("[Car Service] Successfully added car:", data);
  return { ...data, monthlyPrices: monthlyPrices || [] };
};

/**
 * update car by id with optional new image uploads and monthly pricing
 */
export const updateCar = async (
  id: number,
  car: UpdateCarDto,
  newImageFiles?: File[],
): Promise<Car> => {
  console.log(`[Car Service] Updating car with ID: ${id}`);

  // Remove system fields that shouldn't be updated
  const { monthlyPrices, ...updateData } = car;
  delete (updateData as any).id;
  delete (updateData as any).created_at;

  // Handle new image uploads
  if (newImageFiles && newImageFiles.length > 0) {
    try {
      console.log("[Car Service] Uploading new images...");
      const uploadResults = await uploadCarImages(newImageFiles, id);
      const newImageUrls = uploadResults.map((result) => result.publicUrl);

      // Append new images to existing ones
      updateData.imageUrls = [...(updateData.imageUrls || []), ...newImageUrls];

      console.log("[Car Service] New images uploaded successfully");
    } catch (err) {
      console.error("[Car Service] Error uploading images:", err);
      throw new Error(
        `Failed to upload images: ${err instanceof Error ? err.message : "Unknown error"}`,
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

  // Update monthly prices if provided
  if (monthlyPrices && monthlyPrices.length > 0) {
    try {
      console.log("[Car Service] Updating monthly prices...");
      await setMonthlyPrices(id, "car", monthlyPrices);
      console.log("[Car Service] Monthly prices updated successfully");
    } catch (priceError) {
      console.error("[Car Service] Error updating monthly prices:", priceError);
      // Don't throw - car was updated successfully, just log the error
    }
  }

  console.log(`[Car Service] Successfully updated car ID: ${id}`, data);
  return { ...data, monthlyPrices: monthlyPrices || [] };
};

/**
 * delete car by id
 */
export const deleteCar = async (id: number): Promise<void> => {
  console.log(`[Car Service] Deleting car with ID: ${id}`);

  const { error } = await apiClient.from("car").delete().eq("id", id);

  if (error) {
    console.error(`[Car Service] Error deleting car ID ${id}:`, error);
    throw error;
  }

  console.log(`[Car Service] Successfully deleted car ID: ${id}`);
};
