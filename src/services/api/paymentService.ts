import { apiClient } from "./apiClient";

export interface CreateCheckoutSessionRequest {
  bookingId: string;
  amount: number;
  currency: string;
}

export interface CreateCheckoutSessionResponse {
  url: string;
}

/**
 * Create a Stripe Checkout Session for a booking
 */
export const createCheckoutSession = async (
  payload: CreateCheckoutSessionRequest
): Promise<CreateCheckoutSessionResponse> => {
  const { data, error } = await apiClient.functions.invoke(
    "create-checkout-session",
    {
      body: payload,
    }
  );

  if (error) {
    console.error("[Payment Service] Error creating checkout session:", error);
    throw error;
  }

  return data as CreateCheckoutSessionResponse;
};

const paymentService = {
  createCheckoutSession,
};

export default paymentService;
