import { useState, useEffect, useCallback } from "react";
import { getAllCars, getCarById } from "@albania/api-client";
import type { Car } from "@albania/shared-types";

export function useCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCars = useCallback(async () => {
    try {
      setError(null);
      const data = await getAllCars();
      setCars(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch cars"));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const refresh = useCallback(() => {
    setRefreshing(true);
    fetchCars();
  }, [fetchCars]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  return {
    cars,
    loading,
    error,
    refreshing,
    refresh,
  };
}

export function useCar(id: string) {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchCar() {
      try {
        setError(null);
        const data = await getCarById(Number(id));
        setCar(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch car"));
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchCar();
    }
  }, [id]);

  return { car, loading, error };
}
