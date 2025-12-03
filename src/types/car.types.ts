export interface Car {
    id: number;
    name: string;
    brand: string;
    type: string;
    year: number;
    transmission: string;
    fuelType: string;
    seats: number;
    mileage: string;
    pricePerDay: number;
    status: string;
    color: string;
    plateNumber: string;
    features: string[];
    image: string;
}

export interface CreateCarDto {
    name: string;
    brand: string;
    type: string;
    year: number;
    transmission: string;
    fuelType: string;
    seats: number;
    mileage: string;
    pricePerDay: number;
    status: string;
    color: string;
    plateNumber: string;
    features: string[];
    image: string;
}

export interface UpdateCarDto {
    name?: string;
    brand?: string;
    type?: string;
    year?: number;
    transmission?: string;
    fuelType?: string;
    seats?: number;
    mileage?: string;
    pricePerDay?: number;
    status?: string;
    color?: string;
    plateNumber?: string;
    features?: string[];
    image?: string;
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
