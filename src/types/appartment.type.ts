/**
 * Appartment Type Definitions
 *
 * TypeScript interfaces for appartment data models and API operations
 */

export interface Appartment {
  id: number;
  providerId: string;
  name: string;
  rating: number;
  rooms: number;
  beds?: number;
  kitchens?: number;
  bathrooms?: number;
  livingRooms?: number;
  price: number;
  status: "available" | "rented" | "maintenance";
  imageUrls?: string[];
  description?: string;
  amenities?: string[];
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  location?: string;
  lat?: number;
  lng?: number;
}

export interface CreateAppartmentDto {
  name: string;
  rating: number;
  rooms: number;
  beds?: number;
  kitchens?: number;
  bathrooms?: number;
  livingRooms?: number;
  price: number;
  providerId?: string;
  status: "available" | "rented" | "maintenance";
  imageUrls?: string[];
  description?: string;
  amenities?: string[];
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  location?: string;
  lat?: number;
  lng?: number;
}

export interface UpdateAppartmentDto {
  name?: string;
  rating?: number;
  rooms?: number;
  beds?: number;
  kitchens?: number;
  bathrooms?: number;
  livingRooms?: number;
  price?: number;
  status?: "available" | "rented" | "maintenance";
  imageUrls?: string[];
  description?: string;
  amenities?: string[];
  contactEmail?: string;
  contactPhone?: string;
  lat?: number;
  lng?: number;
  address?: string;
  location?: string;
}

export interface AppartmentFilters {
  searchTerm?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: "all" | "3+" | "3.5+" | "4+" | "4.5+";
  status?: "all" | "available" | "rented" | "maintenance";
  rooms?: {
    min?: number;
    max?: number;
  };
  beds?: {
    min?: number;
    max?: number;
  };
  bathrooms?: {
    min?: number;
    max?: number;
  };
  amenities?: string[];
}

export interface PaginationParams {
  page: number;
  limit: number;
}
