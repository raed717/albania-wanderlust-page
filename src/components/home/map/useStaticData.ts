// useHotelData.ts
import { useQuery } from "@tanstack/react-query";
import { Hotel, Apartment } from "./types";
import hotels from "./static-hotels.json";
import apartments from "./static-apartment.json";

export const useHotelData = () => {
  return useQuery({
    queryKey: ["hotels"],
    queryFn: async () => hotels as Hotel[], // replace later with fetch("/api/hotels")
  });
};

export const useApartmentData = () => {
  return useQuery({
    queryKey: ["apartments"],
    queryFn: async () => apartments as Apartment[], // replace later with fetch("/api/apartments")
  });
};
