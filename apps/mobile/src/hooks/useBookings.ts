import { useState, useEffect, useCallback } from "react";
import { getCurrentUserBookings } from "@albania/api-client";
import type { Booking } from "@albania/shared-types";

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = useCallback(async () => {
    try {
      setError(null);
      const data = await getCurrentUserBookings();
      setBookings(data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch bookings"),
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const refresh = useCallback(() => {
    setRefreshing(true);
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return {
    bookings,
    loading,
    error,
    refreshing,
    refresh,
  };
}

export function useBooking(id: string) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchBooking() {
      try {
        setError(null);
        // Find the booking from user's bookings list
        const bookings = await getCurrentUserBookings();
        const data = bookings.find((b) => b.id === id) || null;
        setBooking(data);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch booking"),
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchBooking();
    }
  }, [id]);

  return { booking, loading, error };
}
