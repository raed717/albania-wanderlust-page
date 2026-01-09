export interface Car {
    id: number;
    name: string;
    brand: string;
    type: "Sedan" | "SUV" | "Sports";
    year: number;
    transmission: "Manual" | "Automatic";
    fuelType: "Petrol" | "Diesel" | "Hybrid" | "Electric";
    seats: number;
    mileage: number;
    pricePerDay: number;
    status: "available" | "rented" | "maintenance";
    providerId: string;
    color: string;
    plateNumber: string;
    features: string[];
    image: string;
    pickUpLocation: string;
    lat?: number;
    lng?: number;
}

export interface CreateCarDto {
    name: string;
    brand: string;
    type: "Sedan" | "SUV" | "Sports";
    year: number;
    transmission: "Manual" | "Automatic";
    fuelType: "Petrol" | "Diesel" | "Hybrid" | "Electric";
    seats: number;
    mileage: number;
    pricePerDay: number;
    status: "available" | "rented" | "maintenance";
    providerId?: string;
    color: string;
    plateNumber: string;
    features: string[];
    image: string;
    pickUpLocation: string;
    lat: number;
    lng: number;
}

export interface UpdateCarDto {
    name?: string;
    brand?: string;
    type?: "Sedan" | "SUV" | "Sports";
    year?: number;
    transmission?: "Manual" | "Automatic";
    fuelType?: "Petrol" | "Diesel" | "Hybrid" | "Electric";
    seats?: number;
    mileage?: number;
    pricePerDay?: number;
    status?: "available" | "rented" | "maintenance";
    color?: string;
    plateNumber?: string;
    features?: string[];
    image?: string;
    pickUpLocation?: string;
    lat?: number;
    lng?: number;
}

export interface CarFilters {
    searchTerm?: string;
    status?: "all" | "available" | "rented" | "maintenance";
    type?: "all" | "Sedan" | "SUV" | "Sports";
    transmission?: "all" | "Automatic" | "Manual";
    fuelType?: "all" | "Petrol" | "Diesel" | "Hybrid" | "Electric";
}

export interface PaginationParams {
    page: number;
    limit: number;
}