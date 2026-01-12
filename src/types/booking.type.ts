export interface Booking {
  id: string;
  userId: string;
  propertyId: string;
  providerId: string;
  propertyType: "hotel" | "apartment" | "car";
  startDate: string;
  endDate: string;
  pickUpLocation?: string;
  dropOffLocation?: string;
  pickUpTime?: string;
  dropOffTime?: string;
  totalPrice: number;
  contactMail: string;
  contactPhone: string;
  requesterName: string;
  status: "pending" | "confirmed" | "canceled" | "completed";
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingDto {
  propertyId: string;
  providerId: string;
  propertyType: "hotel" | "apartment" | "car";
  startDate: string;
  endDate: string;
  pickUpLocation?: string;
  dropOffLocation?: string;
  pickUpTime?: string;
  dropOffTime?: string;
  totalPrice: number;
  contactMail: string;
  contactPhone: string;
  requesterName: string;
}