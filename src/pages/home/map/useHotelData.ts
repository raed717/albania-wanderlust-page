// useHotelData.ts
import { useQuery } from "@tanstack/react-query";
import { Hotel } from "./types";
import hotels from "./static-hotels.json";

export const useHotelData = () => {
  return useQuery({
    queryKey: ["hotels"],
    queryFn: async () => hotels as Hotel[], // replace later with fetch("/api/hotels")
  });
};
