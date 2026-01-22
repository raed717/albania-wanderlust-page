import React, { useState } from "react";
import PrimarySearchAppBar from "@/components/home/AppBar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import bookingService from "@/services/api/bookingService";
import paymentService from "@/services/api/paymentService";
import { Booking } from "@/types/booking.type";
import {
  Loader2,
  Calendar,
  Car,
  Building2,
  Home,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router";
import { updateBookingStatus } from "@/services/api/bookingService";
import Swal from "sweetalert2";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

const getPropertyIcon = (type: Booking["propertyType"]) => {
  switch (type) {
    case "car":
      return Car;
    case "apartment":
      return Building2;
    case "hotel":
    default:
      return Home;
  }
};

// PayPal Button Component for individual booking
function PayPalPaymentButton({ booking }: { booking: Booking }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [{ isPending }] = usePayPalScriptReducer();
  const [isProcessing, setIsProcessing] = useState(false);

  const createOrder = async (): Promise<string> => {
    try {
      console.log("[PayPal] Creating order for booking:", booking.id);
      const response = await paymentService.createPayPalOrder({
        bookingId: booking.id,
      });
      console.log("[PayPal] Order created successfully:", response);

      if (!response.orderId) {
        throw new Error("No orderId returned from server");
      }

      return response.orderId;
    } catch (error: any) {
      console.error("[PayPal] Error creating order:", error);
      console.error("[PayPal] Error details:", JSON.stringify(error, null, 2));
      console.error("[PayPal] Error response:", error?.response);
      toast({
        title: "Payment Error",
        description:
          error?.message || "Failed to create payment order. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const onApprove = async (data: { orderID: string }): Promise<void> => {
    try {
      setIsProcessing(true);
      console.log("[PayPal] Approving order with ID:", data.orderID);
      console.log("[PayPal] Booking ID:", booking.id);

      const response = await paymentService.capturePayPalOrder({
        orderId: data.orderID,
        bookingId: booking.id,
      });

      console.log("[PayPal] Capture response:", response);

      if (!response.success) {
        throw new Error(response.message || "Payment capture failed");
      }

      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully.",
      });

      // Invalidate and refetch bookings
      await queryClient.invalidateQueries({
        queryKey: ["bookings", "currentUser"],
      });
    } catch (error: any) {
      console.error("[PayPal] Error capturing payment:", error);
      console.error("[PayPal] Error details:", JSON.stringify(error, null, 2));
      console.error("[PayPal] Error response:", error?.response);
      toast({
        title: "Payment Error",
        description:
          error?.message || "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const onError = (err: Record<string, unknown>) => {
    console.error("[PayPal] Payment error:", err);
    console.error(
      "[PayPal] Payment error details:",
      JSON.stringify(err, null, 2)
    );
    toast({
      title: "Payment Error",
      description: "An error occurred during payment. Please try again.",
      variant: "destructive",
    });
    setIsProcessing(false);
  };

  const onCancel = () => {
    console.log("[PayPal] User cancelled payment");
    setIsProcessing(false);
    toast({
      title: "Payment Cancelled",
      description: "You cancelled the payment process.",
    });
  };

  if (isPending || isProcessing) {
    return (
      <div className="flex items-center justify-center p-2">
        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[200px]">
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onError}
        onCancel={onCancel}
        style={{
          layout: "vertical",
          color: "gold",
          shape: "rect",
          label: "paypal",
        }}
      />
    </div>
  );
}

export default function BookingsSummary() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const {
    data: bookings,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["bookings", "currentUser"],
    queryFn: bookingService.getCurrentUserBookings,
  });

  const getPropertyRoute = (booking: Booking) => {
    const id = booking.propertyId;
    switch (booking.propertyType) {
      case "apartment":
        return `/appartmentReservation/${id}`;
      case "hotel":
        return `/hotelReservation/${id}`;
      case "car":
        return `/carReservation/${id}`;
      default:
        return "";
    }
  };

  const handlePendingBookingCancel = async (booking: Booking) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, cancel it!",
      }).then((result) => {
        if (result.isConfirmed) {
          updateBookingStatus(booking.id, "canceled");
          toast({
            title: "Booking Cancelled",
            description: "Your booking has been cancelled.",
          });
        }
      });
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast({
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <PrimarySearchAppBar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Calendar className="w-7 h-7 text-blue-600" />
              My Bookings
            </h1>
            <p className="mt-2 text-slate-600">
              Review all your bookings across cars, hotels, and apartments in
              one place.
            </p>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          )}

          {isError && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span>
                {(error as any)?.message ||
                  "We couldn't load your bookings right now. Please try again later."}
              </span>
            </div>
          )}

          {!isLoading && !isError && (!bookings || bookings.length === 0) && (
            <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center shadow-sm">
              <p className="text-slate-700 font-medium mb-2">
                You don't have any bookings yet.
              </p>
              <p className="text-slate-500 text-sm">
                Start exploring properties and cars to create your first
                booking.
              </p>
            </div>
          )}

          {!isLoading && !isError && bookings && bookings.length > 0 && (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const Icon = getPropertyIcon(booking.propertyType);
                const start = new Date(booking.startDate);
                const end = new Date(booking.endDate);

                return (
                  <div
                    key={booking.id}
                    className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div
                      className="flex items-start gap-4 hover:bg-red-50 transition-colors cursor-pointer"
                      onClick={() => navigate(getPropertyRoute(booking))}
                    >
                      <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <img
                          src={
                            booking.propertyData?.imageUrls?.[0] ||
                            "/images/placeholder.png"
                          }
                          alt={booking.propertyData?.name || "Property Image"}
                          className="w-11 h-11 rounded-full object-cover"
                        />
                      </div>
                      <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm uppercase tracking-wide text-slate-500 font-semibold">
                            {booking.propertyType} ,{" "}
                            {booking.propertyData?.name}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                            Ref: {booking.id}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">
                          {start.toLocaleDateString()} –{" "}
                          {end.toLocaleDateString()}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Contact: {booking.requesterName} •{" "}
                          {booking.contactMail}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-semibold text-slate-900">
                        Total: ${booking.totalPrice.toFixed(2)}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-semibold capitalize ${
                            booking.status === "confirmed"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : booking.status === "pending"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : booking.status === "canceled"
                                  ? "bg-red-50 text-red-700 border border-red-200"
                                  : "bg-slate-50 text-slate-700 border border-slate-200"
                          }`}
                        >
                          Booking status: {booking.status}
                        </span>
                        {booking.payment_status && (
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-semibold capitalize ${
                              booking.payment_status === "paid"
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : booking.payment_status === "pending"
                                  ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                                  : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                          >
                            Payment status: {booking.payment_status}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {/* CASE 1: Booking Confirmed + Payment Pending - Show Payment Button */}
                        {booking.status === "confirmed" &&
                          booking.payment_status === "pending" && (
                            <>
                              <div className="flex items-center gap-1 text-xs text-amber-600 mb-1">
                                <CreditCard className="w-3 h-3" />
                                <span>Payment Required</span>
                              </div>
                              <PayPalPaymentButton booking={booking} />
                              <Button
                                onClick={() =>
                                  handlePendingBookingCancel(booking)
                                }
                                size="sm"
                                variant="outline"
                                className="mt-2"
                              >
                                Cancel Booking
                              </Button>
                            </>
                          )}

                        {/* CASE 2: Booking Pending - Only Cancel Button (Awaiting Confirmation) */}
                        {booking.status === "pending" &&
                          booking.payment_status === "pending" && (
                            <>
                              <div className="text-xs text-slate-500 mb-1">
                                Awaiting confirmation
                              </div>
                              <Button
                                onClick={() =>
                                  handlePendingBookingCancel(booking)
                                }
                                size="sm"
                                variant="outline"
                              >
                                Cancel Booking
                              </Button>
                            </>
                          )}

                        {/* CASE 3: Payment Completed - Show Success Message */}
                        {booking.payment_status === "paid" &&
                          booking.status !== "canceled" && (
                            <div className="flex flex-col items-end gap-1">
                              <div className="flex items-center gap-1 text-xs text-green-600">
                                <CreditCard className="w-3 h-3" />
                                <span className="font-semibold">
                                  Payment Completed ✓
                                </span>
                              </div>
                              {booking.status === "confirmed" && (
                                <div className="text-xs text-slate-500">
                                  Booking confirmed
                                </div>
                              )}
                            </div>
                          )}

                        {/* CASE 4: Booking Canceled - Show Info */}
                        {booking.status === "canceled" && (
                          <div className="flex flex-col items-end gap-1">
                            <div className="text-xs text-red-600 font-semibold">
                              Booking Canceled
                            </div>
                            {booking.payment_status === "paid" && (
                              <div className="text-xs text-slate-500">
                                Refund will be processed
                              </div>
                            )}
                          </div>
                        )}

                        {/* CASE 5: Payment Failed - Show Retry Option */}
                        {booking.payment_status === "failed" &&
                          booking.status === "confirmed" && (
                            <>
                              <div className="flex items-center gap-1 text-xs text-red-600 mb-1">
                                <AlertCircle className="w-3 h-3" />
                                <span>Payment Failed</span>
                              </div>
                              <PayPalPaymentButton booking={booking} />
                              <Button
                                onClick={() =>
                                  handlePendingBookingCancel(booking)
                                }
                                size="sm"
                                variant="outline"
                                className="mt-2"
                              >
                                Cancel Booking
                              </Button>
                            </>
                          )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
