import { useState, useEffect, useCallback } from "react";
import { getAllDestinations } from "@albania/api-client";
import type { Destination } from "@albania/shared-types";

export function useDestinations() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDestinations = useCallback(async () => {
    try {
      setError(null);
      const data = await getAllDestinations();
      setDestinations(data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch destinations"),
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const refresh = useCallback(() => {
    setRefreshing(true);
    fetchDestinations();
  }, [fetchDestinations]);

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  return {
    destinations,
    loading,
    error,
    refreshing,
    refresh,
  };
}

export function useDestination(id: string) {
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchDestination() {
      try {
        setError(null);
        const destinations = await getAllDestinations();
        const data = destinations.find((d) => String(d.id) === id) || null;
        setDestination(data);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch destination"),
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchDestination();
    }
  }, [id]);

  return { destination, loading, error };
}
