import { apiClient } from "./apiClient";
import {
  Destination,
  DestinationDto,
  Wishlist,
  WishlistDto,
} from "@albania/shared-types";
import { uploadImages } from "./storageService";
import { authService } from "./authService";

/**
 * Get all destinations
 */
export const getAllDestinations = async (): Promise<Destination[]> => {
  console.log("[Destination Service] Fetching all destinations...");
  const { data, error } = await apiClient.from("destination").select("*");
  if (error) {
    console.error("[Destination Service] Error fetching destinations:", error);
    throw error;
  }
  //console.log("[Destination Service] Successfully fetched destinations:", data);
  return data;
};

/**
 * Create a new destination
 */
export const createDestination = async (
  data: DestinationDto,
): Promise<Destination> => {
  console.log("[Destination Service] Creating new destination:", data);
  const { data: newDestination, error } = await apiClient
    .from("destination")
    .insert([data])
    .select()
    .single();
  if (error) {
    console.error("[Destination Service] Error creating destination:", error);
    throw error;
  }
  console.log(
    "[Destination Service] Successfully created destination:",
    newDestination,
  );
  return newDestination;
};

/**
 * Update a destination
 */
export const updateDestination = async (
  id: number,
  data: DestinationDto,
): Promise<Destination> => {
  console.log("[Destination Service] Updating destination:", data);
  const { data: updatedDestination, error } = await apiClient
    .from("destination")
    .update(data)
    .eq("id", id)
    .select()
    .single();
  if (error) {
    console.error("[Destination Service] Error updating destination:", error);
    throw error;
  }
  console.log(
    "[Destination Service] Successfully updated destination:",
    updatedDestination,
  );
  return updatedDestination;
};

/**
 * Delete a destination
 */
export const deleteDestination = async (id: number): Promise<void> => {
  console.log("[Destination Service] Deleting destination:", id);
  const { error } = await apiClient.from("destination").delete().eq("id", id);
  if (error) {
    console.error("[Destination Service] Error deleting destination:", error);
    throw error;
  }
  console.log("[Destination Service] Successfully deleted destination:", id);
};

export const addDestinationToCurrentUserWishlist = async (
  destinationId: string,
): Promise<Wishlist> => {
  console.log(
    "[Destination Service] Adding destination to wishlist:",
    destinationId,
  );

  const userId = await authService.getCurrentUserId();
  if (!userId) throw new Error("User not authenticated");

  // 1️⃣ Check if wishlist exists
  const { data: existingWishlist, error: fetchError } = await apiClient
    .from("wishlist")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    throw fetchError; // real error
  }

  let wishlist = existingWishlist;

  // 2️⃣ If not exists → create wishlist
  if (!wishlist) {
    const { data: newWishlist, error: createError } = await apiClient
      .from("wishlist")
      .insert([{ user_id: userId }])
      .select()
      .single();

    if (createError) throw createError;
    wishlist = newWishlist;
  }

  // 3️⃣ Add destination to wishlist
  const { error: linkError } = await apiClient
    .from("wishlist_destinations")
    .insert([{ wishlist_id: wishlist.id, destination_id: destinationId }]);

  if (linkError) throw linkError;

  console.log(
    "[Destination Service] Destination added to wishlist:",
    wishlist.id,
  );
  return wishlist;
};

export const removeDestinationFromCurrentUserWishlist = async (
  destinationId: string,
): Promise<void> => {
  console.log(
    "[Wishlist Service] Removing destination from wishlist:",
    destinationId,
  );

  const userId = await authService.getCurrentUserId();
  if (!userId) throw new Error("User not authenticated");

  // 1️⃣ Get the user's wishlist ID
  const { data: wishlist, error: wishlistError } = await apiClient
    .from("wishlist")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (wishlistError || !wishlist) {
    throw wishlistError || new Error("Wishlist not found");
  }

  // 2️⃣ Delete the destination from join table
  const { error: deleteError } = await apiClient
    .from("wishlist_destinations")
    .delete()
    .eq("wishlist_id", wishlist.id)
    .eq("destination_id", destinationId);

  if (deleteError) throw deleteError;

  console.log(
    "[Wishlist Service] Destination removed from wishlist:",
    destinationId,
  );
};

export const getCurrentUserWishlist = async (): Promise<Wishlist | null> => {
  const userId = await authService.getCurrentUserId();
  if (!userId) return null;

  const { data, error } = await apiClient
    .from("wishlist")
    .select(
      `
      id,
      user_id,
      wishlist_destinations (
        destination:destination_id (
          id,
          name,
          description,
          imageUrls,
          category,
          lat,
          lng
        )
      )
    `,
    )
    .eq("user_id", userId)
    .single();

  // No wishlist yet → not an error
  if (error?.code === "PGRST116") {
    return null;
  }

  if (error) {
    console.error("[Wishlist] Failed to fetch wishlist:", error);
    throw error;
  }

  // Map nested join into clean Wishlist shape
  const destinations =
    data.wishlist_destinations?.map((w: any) => w.destination) ?? [];

  return {
    id: data.id,
    user: { id: userId } as any, // you can hydrate later if needed
    destinations,
  };
};
