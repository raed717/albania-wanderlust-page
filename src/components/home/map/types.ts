// Hotel types for the map feature
export interface Hotel {
  id: number;
  name: string;
  location: string;
  rating: number;
  rooms?: number;
  lat: number;
  lon: number;
  image?: string;
  price?: number;
  type?: string;
}

export interface Apartment {
  id: number;
  name: string;
  location: string;
  rating: number;
  rooms?: number;
  lat: number;
  lon: number;
  image?: string;
  price?: number;
  type?: string;
}
