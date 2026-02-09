import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Booking } from "@/types/booking.type";
import {
  getBookingsByProviderId,
  updateBookingStatus,
} from "@/services/api/bookingService";
import Hsidebar from "@/components/dashboard/hsidebar";
import { getCarById } from "@/services/api/carService";
import { getAppartmentById } from "@/services/api/appartmentService";
import { getHotelById } from "@/services/api/hotelService";
import {
  Search,
  Calendar,
  Car,
  Building2,
  Home,
  Mail,
  Phone,
  DollarSign,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Eye,
  Filter,
} from "lucide-react";
import { userService } from "@/services/api/userService";
import { User } from "@/types/user.types";
import { sendEmailDirect } from "@/services/api/emailService";
import Swal from "sweetalert2";

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

const getStatusColor = (status: Booking["status"]) => {
  switch (status) {
    case "confirmed":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "pending":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "canceled":
      return "bg-red-100 text-red-700 border-red-200";
    case "completed":
      return "bg-blue-100 text-blue-700 border-blue-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const getPaymentStatusColor = (status: Booking["payment_status"]) => {
  switch (status) {
    case "paid":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "pending":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "failed":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const getPaymentStatusIcon = (status: Booking["payment_status"]) => {
  switch (status) {
    case "paid":
      return CheckCircle2;
    case "pending":
      return Clock;
    case "failed":
      return XCircle;
    default:
      return AlertCircle;
  }
};

const getStatusIcon = (status: Booking["status"]) => {
  switch (status) {
    case "confirmed":
      return CheckCircle2;
    case "pending":
      return Clock;
    case "canceled":
      return XCircle;
    case "completed":
      return CheckCircle2;
    default:
      return AlertCircle;
  }
};

const getPropertyRoute = (booking: Booking) => {
  const id = booking.propertyId;
  switch (booking.propertyType) {
    case "apartment":
      return `/dashboard/appartments/${id}`;
    case "hotel":
      return `/dashboard/hotels/${id}`;
    case "car":
      return `/dashboard/carInfo/${id}`;
    default:
      return "";
  }
};

export default function BookingsManagement() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Booking["status"]>(
    "all",
  );
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<
    "all" | Booking["propertyType"]
  >("all");
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await userService.getCurrentUser();
        setUser(user);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBookingsByProviderId();
      setBookings(data);
      await fetchPropertiesData(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // fetch properties data
  const fetchPropertiesData = async (bookings: Booking[]) => {
    const bookingsWithPropertyData = await Promise.all(
      bookings.map(async (booking) => {
        if (booking.propertyType === "car") {
          const car = await getCarById(parseInt(booking.propertyId));
          return {
            ...booking,
            propertyData: car || null,
          };
        }
        if (booking.propertyType === "apartment") {
          const appartment = await getAppartmentById(
            parseInt(booking.propertyId),
          );
          return {
            ...booking,
            propertyData: appartment || null,
          };
        }
        if (booking.propertyType === "hotel") {
          const hotel = await getHotelById(parseInt(booking.propertyId));
          return {
            ...booking,
            propertyData: hotel || null,
          };
        }
        return { ...booking, propertyData: null };
      }),
    );
    setBookings(bookingsWithPropertyData);
  };

  useEffect(() => {
    if (currentUser) {
      fetchBookings();
    }
  }, [currentUser]);

  // Filter bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch =
        booking.requesterName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        booking.contactMail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.propertyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.contactPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.propertyData?.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || booking.status === statusFilter;
      const matchesPropertyType =
        propertyTypeFilter === "all" ||
        booking.propertyType === propertyTypeFilter;

      return matchesSearch && matchesStatus && matchesPropertyType;
    });
  }, [bookings, searchTerm, statusFilter, propertyTypeFilter]);

  // Handle status update
  const handleStatusUpdate = async (
    bookingId: string,
    newStatus: Booking["status"],
  ) => {
    const result = await Swal.fire({
      title: "Update Booking Status?",
      text: `Are you sure you want to change the status to "${newStatus}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    });

    if (!result.isConfirmed) return;

    try {
      setUpdatingStatus(bookingId);
      const updatedBooking = await updateBookingStatus(bookingId, newStatus);
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? updatedBooking : b)),
      );

      // Send confirmation email if status changed to confirmed
      if (newStatus === "confirmed") {
        const booking = bookings.find((b) => b.id === bookingId);
        if (booking) {
          try {
            const emailSubject = `Booking Confirmed - ${booking.propertyData?.name || booking.propertyType}`;
            const emailHtml = `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">Booking Confirmed!</h2>
                <p>Dear ${booking.requesterName},</p>
                <p>Your booking has been confirmed please proceed to payment. Here are the details:</p>
                <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin-top: 0; color: #1f2937;">${booking.propertyData?.name || `${booking.propertyType.charAt(0).toUpperCase() + booking.propertyType.slice(1)}`}</h3>
                  <p><strong>Check-in:</strong> ${new Date(booking.startDate).toLocaleDateString()}</p>
                  <p><strong>Check-out:</strong> ${new Date(booking.endDate).toLocaleDateString()}</p>
                  ${booking.pickUpTime && booking.dropOffTime ? `<p><strong>Time:</strong> ${booking.pickUpTime} - ${booking.dropOffTime}</p>` : ""}
                  <p><strong>Total Price:</strong> $${booking.totalPrice.toFixed(2)}</p>
                  <p><strong>Status:</strong> Confirmed</p>
                </div>
                <p>If you have any questions, please contact us.</p>
                <p>Best regards,<br>The Albania Team</p>
              </div>
            `;

            await sendEmailDirect({
              to: booking.contactMail,
              subject: emailSubject,
              html: emailHtml,
            });
          } catch (emailError) {
            console.error("Error sending confirmation email:", emailError);
            // Don't show error to user as the booking update was successful
          }
        }
      }

      await Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: "Booking status has been updated successfully.",
      });
    } catch (err) {
      console.error("Error updating booking status:", err);
      await Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Failed to update booking status. Please try again.",
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  if (loading) {
    return (
      <Hsidebar>
        <div className="flex justify-center items-center h-96">
          <Loader2 size={48} className="animate-spin text-blue-600" />
        </div>
      </Hsidebar>
    );
  }

  if (error) {
    return (
      <Hsidebar>
        <div className="text-center py-20">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchBookings}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </Hsidebar>
    );
  }

  return (
    <Hsidebar>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-600" />
            Bookings Management
          </h1>
          <p className="text-gray-600">
            View and manage all booking requests for your properties
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-2xl font-bold text-amber-600">
                  {bookings.filter((b) => b.status === "pending").length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-amber-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Confirmed</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {bookings.filter((b) => b.status === "confirmed").length}
                </p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  $
                  {bookings
                    .reduce((sum, b) => sum + b.totalPrice, 0)
                    .toFixed(2)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              className="w-full pl-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Search by customer name, email, phone, or property ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="canceled">Canceled</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={propertyTypeFilter}
            onChange={(e) => setPropertyTypeFilter(e.target.value as any)}
            className="px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="all">All Types</option>
            <option value="car">Cars</option>
            <option value="apartment">Apartments</option>
            <option value="hotel">Hotels</option>
          </select>
        </div>

        {/* Bookings Table */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium mb-2">No bookings found</p>
            <p className="text-gray-500 text-sm">
              {searchTerm ||
              statusFilter !== "all" ||
              propertyTypeFilter !== "all"
                ? "Try adjusting your filters"
                : "You don't have any bookings yet"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Booking Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Payment Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => {
                    const PropertyIcon = getPropertyIcon(booking.propertyType);
                    const StatusIcon = getStatusIcon(booking.status);
                    const PaymentStatusIcon = getPaymentStatusIcon(
                      booking.payment_status,
                    );
                    const startDate = new Date(booking.startDate);
                    const endDate = new Date(booking.endDate);

                    return (
                      <tr
                        key={booking.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 rounded-lg p-2 transition-colors"
                            onClick={() => navigate(getPropertyRoute(booking))}
                          >
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center overflow-hidden">
                              {booking.propertyData?.imageUrls?.[0] ? (
                                <img
                                  src={booking.propertyData.imageUrls[0]}
                                  alt={booking.propertyData.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <PropertyIcon className="w-5 h-5 text-blue-600" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {booking.propertyData?.name ||
                                  `${booking.propertyType.charAt(0).toUpperCase() + booking.propertyType.slice(1)}`}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <p className="font-medium text-gray-900">
                              {booking.requesterName}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                              <Mail className="w-3 h-3" />
                              <span>{booking.contactMail}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                              <Phone className="w-3 h-3" />
                              <span>{booking.contactPhone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <p className="text-gray-900">
                              {startDate.toLocaleDateString()}
                            </p>
                            <p className="text-gray-500 text-xs">to</p>
                            <p className="text-gray-900">
                              {endDate.toLocaleDateString()}
                            </p>
                            {booking.pickUpTime && booking.dropOffTime && (
                              <p className="text-gray-500 text-xs mt-1">
                                {booking.pickUpTime} - {booking.dropOffTime}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <p className="font-semibold text-gray-900">
                              ${booking.totalPrice.toFixed(2)}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                              booking.status,
                            )}`}
                          >
                            <StatusIcon className="w-3.5 h-3.5" />
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getPaymentStatusColor(
                              booking.payment_status,
                            )}`}
                          >
                            <PaymentStatusIcon className="w-3.5 h-3.5" />
                            {booking.payment_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <select
                              value={booking.status}
                              onChange={(e) =>
                                handleStatusUpdate(
                                  booking.id,
                                  e.target.value as Booking["status"],
                                )
                              }
                              disabled={
                                updatingStatus === booking.id ||
                                booking.payment_status === "paid"
                              }
                              className="text-xs px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="canceled">Canceled</option>
                              <option value="completed">Completed</option>
                            </select>
                            {updatingStatus === booking.id && (
                              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Hsidebar>
  );
}
