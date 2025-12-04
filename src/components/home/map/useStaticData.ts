// useHotelData.ts
import { useQuery } from "@tanstack/react-query";
import { Apartment } from "./types";

import apartments from "./static-apartment.json";

export const useApartmentData = () => {
  return useQuery({
    queryKey: ["apartments"],
    queryFn: async () => apartments as Apartment[], // replace later with fetch("/api/apartments")
  });
};
