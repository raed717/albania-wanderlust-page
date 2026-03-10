import { useState } from "react";
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
  MapPin,
  Clock,
  FileText,
  Download,
  Star,
  Phone,
  Mail,
  ContactRound,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { userService } from "@/services/api/userService";
import { User } from "@/types/user.types";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router";
import { updateBookingStatus } from "@/services/api/bookingService";
import Swal from "sweetalert2";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import StripePaymentButton from "@/components/payments/StripePaymentButton";
import { jsPDF } from "jspdf";
import logoImage from "@/assets/logo/logoBOOKinAL.png";
import { useTranslation } from "react-i18next";
import ReviewModal from "@/components/reviews/ReviewModal";

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

const formatDate = (d: Date) => {
  const day = d.getDate();
  const month = d.toLocaleDateString("en-US", { month: "short" });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
};

// Invoice PDF Generator
const generateInvoicePDF = async (booking: Booking) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Add logo
  try {
    const img = new Image();
    img.src = logoImage;
    await new Promise((resolve) => {
      img.onload = resolve;
    });
    const logoWidth = 50;
    const logoHeight = (img.height / img.width) * logoWidth;
    doc.addImage(
      img,
      "PNG",
      (pageWidth - logoWidth) / 2,
      10,
      logoWidth,
      logoHeight,
    );
  } catch (error) {
    console.error("Failed to load logo:", error);
  }

  // Title
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 58, 138); // Blue color
  doc.text("INVOICE", pageWidth / 2, 55, { align: "center" });

  // Invoice details box
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, 65, pageWidth - 30, 25, 3, 3, "FD");

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Invoice Number: INV-${booking.id.slice(0, 8).toUpperCase()}`,
    20,
    75,
  );
  doc.text(`Date: ${formatDate(new Date())}`, 20, 82);
  doc.text(`Booking Reference: ${booking.id}`, pageWidth / 2 + 10, 75);
  doc.text(`Status: ${booking.status.toUpperCase()}`, pageWidth / 2 + 10, 82);

  // Customer Information
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text("Customer Information", 15, 105);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(`Name: ${booking.requesterName}`, 15, 115);
  doc.text(`Email: ${booking.contactMail}`, 15, 123);

  // Booking Details
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text("Booking Details", 15, 140);

  // Details table header
  doc.setFillColor(30, 58, 138);
  doc.rect(15, 145, pageWidth - 30, 10, "F");
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("Description", 20, 151);
  doc.text("Details", pageWidth - 60, 151);

  // Table content
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  let yPos = 165;

  const addTableRow = (label: string, value: string, highlight = false) => {
    if (highlight) {
      doc.setFillColor(248, 250, 252);
      doc.rect(15, yPos - 6, pageWidth - 30, 10, "F");
    }
    doc.setTextColor(71, 85, 105);
    doc.text(label, 20, yPos);
    doc.setTextColor(30, 41, 59);
    doc.text(value, pageWidth - 60, yPos);
    yPos += 12;
  };

  addTableRow(
    "Property Type",
    booking.propertyType.charAt(0).toUpperCase() +
      booking.propertyType.slice(1),
    true,
  );
  addTableRow("Property Name", booking.propertyData?.name || "N/A");
  addTableRow("Check-in Date", formatDate(new Date(booking.startDate)), true);
  addTableRow("Check-out Date", formatDate(new Date(booking.endDate)));
  addTableRow("Pick-up Location", booking.pickUpLocation || "N/A", true);
  addTableRow("Drop-off Location", booking.dropOffLocation || "N/A");
  addTableRow("Pick-up Time", booking.pickUpTime || "N/A", true);
  addTableRow("Drop-off Time", booking.dropOffTime || "N/A");

  // Total section
  yPos += 10;
  doc.setFillColor(16, 185, 129); // Green
  doc.roundedRect(pageWidth - 85, yPos, 70, 20, 3, 3, "F");
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("TOTAL", pageWidth - 80, yPos + 8);
  doc.setFontSize(14);
  doc.text(`$${booking.totalPrice.toFixed(2)}`, pageWidth - 80, yPos + 16);

  // Payment status
  yPos += 35;
  const paymentColor =
    booking.payment_status === "paid" ? [16, 185, 129] : [245, 158, 11];
  doc.setFillColor(paymentColor[0], paymentColor[1], paymentColor[2]);
  doc.roundedRect(15, yPos, 60, 8, 2, 2, "F");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(
    `Payment: ${(booking.payment_status || "pending").toUpperCase()}`,
    20,
    yPos + 5.5,
  );

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text("Thank you for booking with BOOKinAL!", pageWidth / 2, 270, {
    align: "center",
  });
  doc.text(
    "For any questions, please contact us at support@bookinal.com",
    pageWidth / 2,
    277,
    { align: "center" },
  );

  // Download the PDF
  const fileName = `Invoice-${booking.propertyType}-${booking.id.slice(0, 8)}.pdf`;
  doc.save(fileName);
};

// Provider Contact Button
function ProviderContactButton({ providerId }: { providerId: string }) {
  const { t } = useTranslation();
  const [provider, setProvider] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpen = async (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && !provider) {
      try {
        setLoading(true);
        const data = await userService.getUserById(providerId);
        setProvider(data);
      } catch {
        // silently fail — provider info unavailable
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <button className="mt-2 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-colors font-semibold">
          <ContactRound className="w-3.5 h-3.5" />
          {t("booking.contactProvider", "Contact Provider")}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-72 p-0 shadow-2xl rounded-2xl overflow-hidden border-0"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-700 via-red-900 to-black px-4 py-3.5">
          <p className="text-white font-bold text-sm tracking-tight">
            {t("booking.providerContact", "Provider Contact")}
          </p>
          {!loading && provider?.full_name && (
            <p className="text-red-200 text-xs mt-0.5">{provider.full_name}</p>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-2.5">
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <div className="w-5 h-5 rounded-full border-2 border-red-600 border-t-transparent animate-spin" />
            </div>
          ) : provider ? (
            <>
              {provider.phone ? (
                <a
                  href={`tel:${provider.phone}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-red-50 hover:border-red-100 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-red-600 font-medium">
                      {t("booking.callPhone", "Call Phone")}
                    </p>
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {provider.phone}
                    </p>
                  </div>
                </a>
              ) : (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-400">
                    {t("booking.noPhone", "No phone number available")}
                  </p>
                </div>
              )}

              <a
                href={`mailto:${provider.email}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-red-50 hover:border-red-100 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 font-medium">
                    {t("booking.sendEmail", "Send Email")}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {provider.email}
                  </p>
                </div>
              </a>
            </>
          ) : (
            <p className="text-sm text-gray-400 text-center py-3">
              {t("booking.providerInfoUnavailable", "Provider info unavailable")}
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

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
      JSON.stringify(err, null, 2),
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
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  const {
    data: bookingPage,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["bookings", "currentUser", page],
    queryFn: () => bookingService.getCurrentUserBookingsPaginated(page, PAGE_SIZE),
    placeholderData: (prev) => prev,
  });

  const bookings = bookingPage?.data;
  const totalPages = bookingPage?.totalPages ?? 1;
  const total = bookingPage?.total ?? 0;

  const getPropertyRoute = (booking: Booking) => {
    const id = booking.propertyId;
    switch (booking.propertyType) {
      case "apartment":
        return `/apartmentReservation/${id}`;
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
    <div className="min-h-screen bg-gray-50">
      <PrimarySearchAppBar />

      {/* ── Page Hero Header ── */}
      <div className="bg-gradient-to-r from-red-700 via-red-900 to-black px-4 pt-12 pb-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-red-300 text-xs font-bold uppercase tracking-widest mb-2">
            My Account
          </p>
          <h1 className="text-4xl font-black text-white tracking-tight">
            {t("booking.myBookings")}
          </h1>
          <p className="mt-2 text-red-200/60 text-sm max-w-lg">
            {t("booking.bookingSummaryDescription")}
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-5xl mx-auto px-4 -mt-6 pb-16">

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-red-600 border-t-transparent animate-spin" />
            <p className="text-sm text-gray-500">Loading your bookings…</p>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="flex items-center gap-3 p-5 bg-red-50 border-l-4 border-red-600 rounded-r-xl text-red-700 shadow-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">
              {(error as any)?.message ||
                "We couldn't load your bookings right now. Please try again later."}
            </span>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && (!bookings || bookings.length === 0) && (
          <div className="bg-white rounded-2xl shadow-sm p-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <Calendar className="w-7 h-7 text-red-400" />
            </div>
            <h3 className="font-black text-lg text-gray-900 mb-1">
              {t("booking.noBookings")}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {t("booking.startExploring")}
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2.5 bg-gradient-to-r from-red-700 to-black text-white text-sm font-bold rounded-full hover:opacity-90 transition-opacity"
            >
              Explore Albania
            </button>
          </div>
        )}

        {/* ── Booking Cards ── */}
        {!isLoading && !isError && bookings && bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const Icon = getPropertyIcon(booking.propertyType);
              const start = new Date(booking.startDate);
              const end = new Date(booking.endDate);

              const statusBorder =
                booking.status === "confirmed"
                  ? "border-l-emerald-500"
                  : booking.status === "pending"
                    ? "border-l-amber-400"
                    : booking.status === "canceled"
                      ? "border-l-red-500"
                      : "border-l-gray-300";

              const statusBadge =
                booking.status === "confirmed"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : booking.status === "pending"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : booking.status === "canceled"
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-gray-50 text-gray-600 border-gray-200";

              const paymentBadge =
                booking.payment_status === "paid"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : booking.payment_status === "pending"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-red-50 text-red-700 border-red-200";

              return (
                <div
                  key={booking.id}
                  className={`bg-white rounded-2xl shadow-sm border-l-4 ${statusBorder} overflow-hidden`}
                >
                  <div className="flex flex-col sm:flex-row">

                    {/* ── Property Image Strip ── */}
                    <div
                      className="relative w-full sm:w-40 h-36 sm:h-auto flex-shrink-0 cursor-pointer group overflow-hidden bg-gray-100"
                      onClick={() => navigate(getPropertyRoute(booking))}
                    >
                      <img
                        src={
                          booking.propertyData?.imageUrls?.[0] ||
                          "/images/placeholder.png"
                        }
                        alt={booking.propertyData?.name || "Property"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      {/* Property type icon */}
                      <div className="absolute bottom-2 left-2 w-7 h-7 rounded-full bg-white/95 flex items-center justify-center shadow">
                        <Icon className="w-3.5 h-3.5 text-red-600" />
                      </div>
                    </div>

                    {/* ── Card Body ── */}
                    <div className="flex flex-col sm:flex-row flex-1 p-5 gap-5">

                      {/* Left: Booking Info */}
                      <div
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => navigate(getPropertyRoute(booking))}
                      >
                        {/* Type + Reference */}
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] uppercase tracking-widest text-red-500 font-bold">
                            {booking.propertyType}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                            #{booking.id.slice(0, 8).toUpperCase()}
                          </span>
                        </div>

                        {/* Property Name */}
                        <h3 className="font-black text-lg text-gray-900 leading-tight truncate">
                          {booking.propertyData?.name || "Property"}
                        </h3>

                        {/* Details */}
                        <div className="mt-3 space-y-1.5">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-red-500 flex-shrink-0" />
                            <span className="font-semibold text-gray-900">
                              {formatDate(start)}
                            </span>
                            <span className="text-gray-400 text-xs">→</span>
                            <span className="font-semibold text-gray-900">
                              {formatDate(end)}
                            </span>
                          </div>

                          {(booking.pickUpLocation ||
                            booking.dropOffLocation) && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <MapPin className="w-4 h-4 text-red-400 flex-shrink-0" />
                              <span className="truncate">
                                {booking.pickUpLocation} →{" "}
                                {booking.dropOffLocation}
                              </span>
                            </div>
                          )}

                          {(booking.pickUpTime || booking.dropOffTime) && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock className="w-4 h-4 text-red-400 flex-shrink-0" />
                              <span>
                                {booking.pickUpTime} → {booking.dropOffTime}
                              </span>
                            </div>
                          )}

                          <p className="text-xs text-gray-400 pt-0.5">
                            {booking.requesterName} · {booking.contactMail}
                          </p>
                        </div>

                        {/* Combined status description — prominent, left-aligned */}
                        {(() => {
                          const key =
                            booking.status === "pending" && booking.payment_status === "pending"
                              ? "pendingPending"
                              : booking.status === "confirmed" && booking.payment_status === "pending"
                                ? "confirmedPending"
                                : booking.status === "confirmed" && booking.payment_status === "paid"
                                  ? "confirmedPaid"
                                  : booking.status === "canceled" && booking.payment_status === "paid"
                                    ? "canceledPaid"
                                    : booking.status === "canceled" && booking.payment_status === "pending"
                                      ? "canceledPending"
                                      : booking.status === "confirmed" && booking.payment_status === "failed"
                                        ? "confirmedFailed"
                                        : null;
                          if (!key) return null;
                          const isWarning = key === "confirmedPending" || key === "pendingPending" || key === "confirmedFailed";
                          const isSuccess = key === "confirmedPaid";
                          const isDanger = key === "canceledPaid" || key === "canceledPending";
                          return (
                            <div className={`mt-3 flex items-start gap-2 px-3 py-2 rounded-lg text-xs font-medium ${
                              isSuccess
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : isWarning
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : isDanger
                                    ? "bg-red-50 text-red-700 border border-red-200"
                                    : "bg-gray-50 text-gray-600 border border-gray-200"
                            }`}>
                              <span className="mt-0.5 flex-shrink-0 text-base leading-none">
                                {isSuccess ? "✓" : isWarning ? "⏳" : "✕"}
                              </span>
                              <span>{t(`booking.combinedStatus.${key}`)}</span>
                            </div>
                          );
                        })()}

                        {/* Invoice download link */}
                        {booking.payment_status === "paid" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              generateInvoicePDF(booking);
                            }}
                            className="mt-3 flex items-center gap-1.5 text-xs text-red-600 font-semibold hover:text-red-800 transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            {t("booking.downloadInvoice")}
                            <Download className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {/* Right: Price + Status + Actions */}
                      <div className="flex flex-col items-end justify-between gap-3 sm:min-w-[168px]">

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                            Total
                          </p>
                          <p className="text-2xl font-black text-gray-900 leading-none">
                            ${booking.totalPrice.toFixed(2)}
                          </p>
                        </div>

                        {/* Status Badges */}
                        <div className="flex flex-col items-end gap-2">
                          {/* Booking status row */}
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">
                              {t("booking.statusLabel")}
                            </span>
                            <span
                              title={t(`booking.statusHint.${booking.status}`, "")}
                              className={`cursor-help text-[11px] px-2.5 py-1 rounded-full font-bold capitalize border ${statusBadge}`}
                            >
                              {booking.status}
                            </span>
                          </div>

                          {/* Payment status row */}
                          {booking.payment_status && (
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">
                                {t("booking.paymentLabel")}
                              </span>
                              <span
                                title={t(`booking.paymentHint.${booking.payment_status}`, "")}
                                className={`cursor-help text-[11px] px-2.5 py-1 rounded-full font-bold capitalize border ${paymentBadge}`}
                              >
                                {booking.payment_status === "paid"
                                  ? "✓ Paid"
                                  : booking.payment_status}
                              </span>
                            </div>
                          )}

                        </div>

                        {/* ── Action Zone ── */}
                        <div className="flex flex-col items-end gap-2 w-full">

                          {/* CASE 1: Confirmed + Payment Pending */}
                          {booking.status === "confirmed" &&
                            booking.payment_status === "pending" && (
                              <>
                                <div className="flex items-center gap-1 text-xs text-amber-600">
                                  <CreditCard className="w-3 h-3" />
                                  <span>{t("booking.paymentRequired")}</span>
                                </div>
                                <StripePaymentButton booking={booking} />
                                <button
                                  onClick={() =>
                                    handlePendingBookingCancel(booking)
                                  }
                                  className="text-xs text-gray-400 hover:text-red-600 transition-colors hover:underline underline-offset-2"
                                >
                                  {t("booking.cancelBooking")}
                                </button>
                              </>
                            )}

                          {/* CASE 2: Pending (awaiting confirmation) */}
                          {booking.status === "pending" &&
                            booking.payment_status === "pending" && (
                              <>
                                <p className="text-xs text-amber-600 text-right">
                                  {t("booking.awaitingConfirmation")}
                                </p>
                                <button
                                  onClick={() =>
                                    handlePendingBookingCancel(booking)
                                  }
                                  className="text-xs text-gray-400 hover:text-red-600 transition-colors hover:underline underline-offset-2"
                                >
                                  {t("booking.cancelBooking")}
                                </button>
                              </>
                            )}

                          {/* CASE 3: Paid */}
                          {booking.payment_status === "paid" &&
                            booking.status !== "canceled" && (
                              <div className="flex flex-col items-end gap-1.5">
                                {(booking.propertyType === "car" ||
                                  booking.propertyType === "apartment") && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setReviewBooking(booking);
                                    }}
                                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-amber-300 text-amber-700 hover:bg-amber-50 transition-colors font-bold"
                                  >
                                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                    {t("review.addReview", "Add Review")}
                                  </button>
                                )}
                                <ProviderContactButton
                                  providerId={booking.providerId}
                                />
                              </div>
                            )}

                          {/* CASE 4: Canceled */}
                          {booking.status === "canceled" && (
                            <div className="text-right">
                              <p className="text-xs font-bold text-red-600">
                                {t("booking.cancelled")}
                              </p>
                              {booking.payment_status === "paid" && (
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {t("booking.refundWillBeProcessed")}
                                </p>
                              )}
                            </div>
                          )}

                          {/* CASE 5: Payment Failed */}
                          {booking.payment_status === "failed" &&
                            booking.status === "confirmed" && (
                              <>
                                <div className="flex items-center gap-1 text-xs text-red-600">
                                  <AlertCircle className="w-3 h-3" />
                                  <span>{t("booking.paymentFailed")}</span>
                                </div>
                                <StripePaymentButton booking={booking} />
                                <PayPalPaymentButton booking={booking} />
                                <button
                                  onClick={() =>
                                    handlePendingBookingCancel(booking)
                                  }
                                  className="text-xs text-gray-400 hover:text-red-600 transition-colors hover:underline underline-offset-2"
                                >
                                  {t("booking.cancelBooking")}
                                </button>
                              </>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Pagination ── */}
        {!isLoading && !isError && total > 0 && totalPages > 1 && (
          <div className="mt-8 flex flex-col items-center gap-3">

            {/* Range label */}
            <p className="text-xs text-gray-400">
              Showing{" "}
              <span className="font-semibold text-gray-700">
                {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700">{total}</span>{" "}
              bookings
            </p>

            {/* Controls */}
            <div className="flex items-center gap-1">
              {/* Prev */}
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isFetching}
                className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) =>
                  p === 1 || p === totalPages || Math.abs(p - page) <= 1
                )
                .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                  if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) {
                    acc.push("…");
                  }
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) =>
                  p === "…" ? (
                    <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-sm text-gray-400">
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      disabled={isFetching}
                      className={`w-9 h-9 rounded-full text-sm font-bold transition-colors ${
                        p === page
                          ? "bg-gradient-to-br from-red-600 to-red-900 text-white shadow-sm"
                          : "border border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

              {/* Next */}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || isFetching}
                className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Fetching indicator */}
            {isFetching && (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Loader2 className="w-3 h-3 animate-spin" />
                Loading…
              </div>
            )}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewBooking && (
        <ReviewModal
          open={!!reviewBooking}
          onClose={() => setReviewBooking(null)}
          booking={reviewBooking}
        />
      )}
    </div>
  );
}
