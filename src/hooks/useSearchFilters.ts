import { useState, useCallback, useMemo } from "react";
import { Hotel } from "@/types/hotel.types";
import { Appartment } from "@/types/appartment.type";
import {
  SearchFiltersState,
  HotelFiltersInput,
  AppartmentFiltersInput,
  defaultSearchFilters,
} from "@/types/search.types";
import { getAllHotels } from "@/services/api/hotelService";
import {
  getAllAppartments,
  getApartmentUnavailabilityDates,
} from "@/services/api/appartmentService";

interface UseSearchFiltersReturn {
  filters: SearchFiltersState;
  results: {
    hotels: Hotel[];
    apartments: Appartment[];
    combined: (Hotel | Appartment)[];
  };
  loading: boolean;
  error: string | null;
  setFilters: (filters: Partial<SearchFiltersState>) => void;
  setPropertyType: (type: "hotel" | "apartment" | "both") => void;
  setHotelFilters: (filters: Partial<HotelFiltersInput>) => void;
  setAppartmentFilters: (filters: Partial<AppartmentFiltersInput>) => void;
  resetFilters: () => void;
  applyFilters: () => Promise<void>;
}

/**
 * Custom hook to manage search filters and property results
 */
export const useSearchFilters = (
  initialFilters?: Partial<SearchFiltersState>
): UseSearchFiltersReturn => {
  const [filters, setFiltersState] = useState<SearchFiltersState>({
    ...defaultSearchFilters,
    ...initialFilters,
  });
  const [allHotels, setAllHotels] = useState<Hotel[]>([]);
  const [allApartments, setAllApartments] = useState<Appartment[]>([]);
  const [availableApartments, setAvailableApartments] = useState<Appartment[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Check if a hotel matches the current filters
   */
  const filterHotel = (hotel: Hotel): boolean => {
    const f = filters.hotelFilters;

    // Search term filter
    if (f.searchTerm && f.searchTerm.trim()) {
      const term = f.searchTerm.toLowerCase();
      if (
        !hotel.name.toLowerCase().includes(term) &&
        !hotel.location?.toLowerCase().includes(term) &&
        !hotel.address?.toLowerCase().includes(term)
      ) {
        return false;
      }
    }

    // Price range filter
    if (f.priceRange) {
      if (hotel.price < f.priceRange.min || hotel.price > f.priceRange.max) {
        return false;
      }
    }

    // Rating filter
    if (f.rating && f.rating !== "all") {
      const ratingThreshold = parseFloat(f.rating);
      if (hotel.rating < ratingThreshold) {
        return false;
      }
    }

    // Status filter - only apply if not "all"
    if (f.status && f.status !== "all" && hotel.status) {
      if (hotel.status.toLowerCase() !== f.status.toLowerCase()) {
        return false;
      }
    }

    // Rooms filter
    if (f.rooms) {
      if (f.rooms.min && hotel.rooms < f.rooms.min) return false;
      if (f.rooms.max && hotel.rooms > f.rooms.max) return false;
    }

    // Amenities filter
    if (f.amenities) {
      if (f.amenities.wifi && !hotel.wifi) return false;
      if (f.amenities.parking && !hotel.parking) return false;
      if (f.amenities.pool && !hotel.pool) return false;
      if (f.amenities.gym && !hotel.gym) return false;
      if (f.amenities.spa && !hotel.spa) return false;
      if (f.amenities.restaurant && !hotel.restaurant) return false;
      if (f.amenities.bar && !hotel.bar) return false;
    }

    return true;
  };

  /**
   * Check if an apartment matches the current filters
   */
  const filterAppartment = (apartment: Appartment): boolean => {
    const f = filters.appartmentFilters;

    // If dates are provided, check beds requirement
    if (
      filters.checkInDate &&
      filters.checkOutDate &&
      (filters.adults || filters.children)
    ) {
      const requiredBeds = (filters.adults || 0) + (filters.children || 0);
      if (apartment.beds < requiredBeds) {
        return false;
      }
    }

    // Search term filter - use destination if provided
    const searchTerm = f.searchTerm || filters.destination || "";
    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      if (
        !apartment.name.toLowerCase().includes(term) &&
        !apartment.address?.toLowerCase().includes(term)
      ) {
        return false;
      }
    }

    // Price range filter
    if (f.priceRange) {
      if (
        apartment.price < f.priceRange.min ||
        apartment.price > f.priceRange.max
      ) {
        return false;
      }
    }

    // Rating filter
    if (f.rating && f.rating !== "all") {
      const ratingThreshold = parseFloat(f.rating);
      if (apartment.rating < ratingThreshold) {
        return false;
      }
    }

    // Status filter - only apply if not "all"
    if (f.status && f.status !== "all" && apartment.status) {
      if (apartment.status.toLowerCase() !== f.status.toLowerCase()) {
        return false;
      }
    }

    // Rooms filter
    if (f.rooms) {
      if (f.rooms.min && apartment.rooms < f.rooms.min) return false;
      if (f.rooms.max && apartment.rooms > f.rooms.max) return false;
    }

    // Beds filter
    if (f.beds && apartment.beds) {
      if (f.beds.min && apartment.beds < f.beds.min) return false;
      if (f.beds.max && apartment.beds > f.beds.max) return false;
    }

    // Bathrooms filter
    if (f.bathrooms && apartment.bathrooms) {
      if (f.bathrooms.min && apartment.bathrooms < f.bathrooms.min)
        return false;
      if (f.bathrooms.max && apartment.bathrooms > f.bathrooms.max)
        return false;
    }

    // Amenities filter
    if (f.amenities && f.amenities.length > 0) {
      if (!apartment.amenities) return false;
      const hasAllAmenities = f.amenities.every((amenity) =>
        apartment.amenities?.some((a) =>
          a.toLowerCase().includes(amenity.toLowerCase())
        )
      );
      if (!hasAllAmenities) return false;
    }

    return true;
  };

  /**
   * Get filtered results based on property type and current filters
   */
  const results = useMemo(() => {
    const filteredHotels =
      filters.propertyType === "hotel" || filters.propertyType === "both"
        ? allHotels.filter(filterHotel).map((hotel) => ({
            ...hotel,
            amenities: hotel.amenities || [],
            image: hotel.image || "",
          }))
        : [];

    // Use available apartments if dates are provided, otherwise all apartments
    const apartmentsToFilter =
      filters.checkInDate && filters.checkOutDate
        ? availableApartments
        : allApartments;

    const filteredApartments =
      filters.propertyType === "apartment" || filters.propertyType === "both"
        ? apartmentsToFilter.filter(filterAppartment).map((apt) => ({
            ...apt,
            amenities: apt.amenities || [],
            image: apt.image || "",
          }))
        : [];

    console.log("[useSearchFilters] Filtered hotels:", filteredHotels);
    console.log("[useSearchFilters] Filtered apartments:", filteredApartments);

    return {
      hotels: filteredHotels,
      apartments: filteredApartments,
      combined: [...filteredHotels, ...filteredApartments],
    };
  }, [
    filters,
    allHotels,
    allApartments,
    availableApartments,
    filterHotel,
    filterAppartment,
  ]);

  /**
   * Filter apartments by availability based on dates
   */
  const filterApartmentsByAvailability = useCallback(
    async (apartments: Appartment[]): Promise<Appartment[]> => {
      if (!filters.checkInDate || !filters.checkOutDate) {
        return apartments;
      }

      const checkIn = new Date(filters.checkInDate);
      const checkOut = new Date(filters.checkOutDate);

      const availableApartmentsPromises = apartments.map(async (apartment) => {
        try {
          const unavailableDates = await getApartmentUnavailabilityDates(
            apartment.id
          );

          // Check if any date in the range is unavailable
          const currentDate = new Date(checkIn);
          while (currentDate <= checkOut) {
            const dateStr = currentDate.toISOString().split("T")[0];
            if (unavailableDates.includes(dateStr)) {
              return null; // Not available
            }
            currentDate.setDate(currentDate.getDate() + 1);
          }

          return apartment; // Available
        } catch (error) {
          console.error(
            `Error checking availability for apartment ${apartment.id}:`,
            error
          );
          return null; // On error, consider unavailable
        }
      });

      const results = await Promise.all(availableApartmentsPromises);
      return results.filter((apt): apt is Appartment => apt !== null);
    },
    [filters.checkInDate, filters.checkOutDate]
  );

  /**
   * Fetch all properties
   */
  const applyFilters = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const shouldFetchHotels =
        filters.propertyType === "hotel" || filters.propertyType === "both";
      const shouldFetchApartments =
        filters.propertyType === "apartment" || filters.propertyType === "both";

      const [hotelsData, apartmentsData] = await Promise.all([
        shouldFetchHotels ? getAllHotels() : Promise.resolve([]),
        shouldFetchApartments ? getAllAppartments() : Promise.resolve([]),
      ]);

      console.log("[useSearchFilters] Fetched hotels:", hotelsData);
      console.log("[useSearchFilters] Fetched apartments:", apartmentsData);

      setAllHotels(hotelsData);
      setAllApartments(apartmentsData);

      // Filter apartments by availability if dates are provided
      if (
        shouldFetchApartments &&
        filters.checkInDate &&
        filters.checkOutDate
      ) {
        const available = await filterApartmentsByAvailability(apartmentsData);
        setAvailableApartments(available);
      } else {
        setAvailableApartments(apartmentsData);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch properties";
      setError(message);
      console.error("[useSearchFilters] Error:", err);
    } finally {
      setLoading(false);
    }
  }, [
    filters.propertyType,
    filters.checkInDate,
    filters.checkOutDate,
    filterApartmentsByAvailability,
  ]);

  /**
   * Update filters
   */
  const setFilters = useCallback((newFilters: Partial<SearchFiltersState>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  }, []);

  /**
   * Update property type
   */
  const setPropertyType = useCallback(
    (type: "hotel" | "apartment" | "both") => {
      setFiltersState((prev) => ({
        ...prev,
        propertyType: type,
      }));
    },
    []
  );

  /**
   * Update hotel filters
   */
  const setHotelFilters = useCallback(
    (newFilters: Partial<HotelFiltersInput>) => {
      setFiltersState((prev) => ({
        ...prev,
        hotelFilters: { ...prev.hotelFilters, ...newFilters },
      }));
    },
    []
  );

  /**
   * Update apartment filters
   */
  const setAppartmentFilters = useCallback(
    (newFilters: Partial<AppartmentFiltersInput>) => {
      setFiltersState((prev) => ({
        ...prev,
        appartmentFilters: { ...prev.appartmentFilters, ...newFilters },
      }));
    },
    []
  );

  /**
   * Reset all filters to default
   */
  const resetFilters = useCallback(() => {
    setFiltersState(defaultSearchFilters);
  }, []);

  return {
    filters,
    results,
    loading,
    error,
    setFilters,
    setPropertyType,
    setHotelFilters,
    setAppartmentFilters,
    resetFilters,
    applyFilters,
  };
};
