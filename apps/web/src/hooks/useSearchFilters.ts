import { useState, useCallback } from "react";
import {
  SearchFiltersState,
  HotelFiltersInput,
  ApartmentFiltersInput,
  defaultSearchFilters,
} from "@/types/search.types";

interface UseSearchFiltersReturn {
  filters: SearchFiltersState;
  setFilters: (filters: Partial<SearchFiltersState>) => void;
  setPropertyType: (type: "hotel" | "apartment" | "both") => void;
  setHotelFilters: (filters: Partial<HotelFiltersInput>) => void;
  setApartmentFilters: (filters: Partial<ApartmentFiltersInput>) => void;
  resetFilters: () => void;
}

/**
 * Custom hook to manage search filters state
 */
export const useSearchFilters = (
  initialFilters?: Partial<SearchFiltersState>,
): UseSearchFiltersReturn => {
  const [filters, setFiltersState] = useState<SearchFiltersState>({
    ...defaultSearchFilters,
    ...initialFilters,
  });

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
    [],
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
    [],
  );

  /**
   * Update apartment filters
   */
  const setApartmentFilters = useCallback(
    (newFilters: Partial<ApartmentFiltersInput>) => {
      setFiltersState((prev) => ({
        ...prev,
        apartmentFilters: { ...prev.apartmentFilters, ...newFilters },
      }));
    },
    [],
  );

  /**
   * Reset all filters to default
   */
  const resetFilters = useCallback(() => {
    setFiltersState(defaultSearchFilters);
  }, []);

  return {
    filters,
    setFilters,
    setPropertyType,
    setHotelFilters,
    setApartmentFilters,
    resetFilters,
  };
};
