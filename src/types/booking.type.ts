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
  payment_status: "pending" | "paid" | "failed";
  payment_intent_id?: string;
  paid_at?: string;
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
