/**
 * Appartment Type Definitions
 * 
 * TypeScript interfaces for appartment data models and API operations
 */

export interface Appartment {
    id: number;
    name: string;
    location: string;
    rating: number;
    rooms: number;
    occupancy: number;
    price: number;
    status: "active" | "maintenance";
    image: string;
    description?: string;
    amenities?: string[];
    contactEmail?: string;
    contactPhone?: string;
    address?: string;
    lat?: number;
    lng?: number;
}

export interface CreateAppartmentDto {
    name: string;
    location: string;
    rating: number;
    rooms: number;
    occupancy: number;
    price: number;
    status: "active" | "maintenance";
    image: string;
    description?: string;
    amenities?: string[];
    contactEmail?: string;
    contactPhone?: string;
    address?: string;
    lat?: number;
    lng?: number;
}

export interface UpdateAppartmentDto {
    name?: string;
    location?: string;
    rating?: number;
    rooms?: number;
    occupancy?: number;
    price?: number;
    status?: "active" | "maintenance";
    image?: string;
    description?: string;
    amenities?: string[];
    contactEmail?: string;
    contactPhone?: string;
    lat?: number;
    lng?: number;
    address?: string;
}

export interface AppartmentFilters {
    searchTerm?: string;
    status?: "all" | "active" | "maintenance";
    rating?: "all" | "4+" | "4.5+";
}

export interface PaginationParams {
    page: number;
    limit: number;
}
