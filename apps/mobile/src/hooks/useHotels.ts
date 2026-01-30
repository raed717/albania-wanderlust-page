import { useState, useEffect, useCallback } from "react";
import { getAllHotels, getHotelById } from "@albania/api-client";
import type { Hotel } from "@albania/shared-types";

export function useHotels(filters?: {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
}) {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHotels = useCallback(async () => {
    try {
      setError(null);
      const data = await getAllHotels();
      setHotels(data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch hotels"),
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters?.location, filters?.minPrice, filters?.maxPrice]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    fetchHotels();
  }, [fetchHotels]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  return {
    hotels,
    loading,
    error,
    refreshing,
    refresh,
  };
}

export function useHotel(id: string) {
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchHotel() {
      try {
        setError(null);
        const data = await getHotelById(Number(id));
        setHotel(data);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch hotel"),
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchHotel();
    }
  }, [id]);

  return { hotel, loading, error };
}
