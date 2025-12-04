export interface Apartment {
  id: number;
  name: string;
  location: string;
  rating: number;
  rooms?: number;
  image?: string;
  price?: number;
  type?: string;
  occupancy?: number;
  status?: string;
  lat: number;
  lng: number;
}
