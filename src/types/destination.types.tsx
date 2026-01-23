import { User } from "./user.types";

export interface Destination {
  id: string;
  name: string;
  description: string;
  imageUrls: string[];
  category: string;
  lat?: number;
  lng?: number;
}

export interface DestinationDto {
  name: string;
  description: string;
  imageUrls: string[];
  category: string;
  lat?: number;
  lng?: number;
}

export interface Wishlist {
  id: string;
  destinations: Destination[];
  user: User;
}

export interface WishlistDto {
  destinations: Destination[];
  user: User;
}