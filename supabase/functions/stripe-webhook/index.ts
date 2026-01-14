import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0";

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2023-10-16",
    });

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        sig!,
        Deno.env.get("STRIPE_WEBHOOK_SECRET")!
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return new Response("Webhook signature verification failed", {
        status: 400,
      });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const bookingId = session.metadata.bookingId;

      if (!bookingId) {
        console.error("No bookingId in metadata");
        return new Response("No bookingId", { status: 400 });
      }

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      // Check if booking exists and is pending
      const { data: booking, error: bookingError } = await supabase
        .from("booking")
        .select("*")
        .eq("id", bookingId)
        .eq("payment_status", "pending")
        .single();

      if (bookingError || !booking) {
        console.error("Booking not found or not pending:", bookingError);
        return new Response("Booking not found or not pending", {
          status: 400,
        });
      }

      // Update booking
      const { error: updateError } = await supabase
        .from("booking")
        .update({
          payment_status: "paid",
          status: "confirmed",
          payment_intent_id: session.payment_intent,
          paid_at: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .eq("id", bookingId);

      if (updateError) {
        console.error("Error updating booking:", updateError);
        return new Response("Error updating booking", { status: 500 });
      }

      console.log("Booking updated successfully:", bookingId);
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new Response("Internal server error", { status: 500 });
  }
});
