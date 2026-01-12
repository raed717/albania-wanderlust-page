import React, { useState, useEffect } from "react";
import {
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  CreditCard,
  Check,
} from "lucide-react";
import { Car } from "@/types/car.types";
import { getCarById } from "@/services/api/carService";
import { useNavigate, useParams } from "react-router";
import PrimarySearchAppBar from "@/components/home/AppBar";
import "react-phone-number-input/style.css";
import PhoneInput, {
  formatPhoneNumber,
  formatPhoneNumberIntl,
  isPossiblePhoneNumber,
  isValidPhoneNumber,
} from "react-phone-number-input";
import { useMutation } from "@tanstack/react-query";
import { createBooking } from "@/services/api/bookingService";
import Swal from "sweetalert2";

export default function CarBilling() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const [car, setCar] = useState<Car | null>(null);

  useEffect(() => {
    const fetchCar = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const data = await getCarById(parseInt(id));
        if (!data) {
          setCar(null);
        } else {
          setCar(data);
          // If car has a single image string, convert to array
          setImages(data.imageUrls || []);
        }
      } catch (error) {
        console.error("Error fetching car:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    pickUpDate: "",
    dropOffDate: "",
    pickUpTime: "10:00",
    dropOffTime: "10:00",
    pickUpLocation: car?.pickUpLocation || "",
    dropOffLocation: "",
  });

  const [totalDays, setTotalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const bookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Booking confirmed",
        text: "Your car booking has been created successfully.",
      });
      navigate("/myBookings");
    },
    onError: (error: any) => {
      console.error("Error creating booking:", error);
      Swal.fire({
        icon: "error",
        title: "Booking failed",
        text:
          error?.message ||
          "We couldn't create your booking. Please try again or log in again.",
      });
    },
  });

  useEffect(() => {
    if (!car) return;
    if (formData.pickUpDate && formData.dropOffDate) {
      const pickup = new Date(formData.pickUpDate);
      const dropoff = new Date(formData.dropOffDate);
      const diffTime = Math.abs(dropoff.getTime() - pickup.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const days = diffDays || 1;
      setTotalDays(days);
      setTotalPrice(days * car.pricePerDay);
    }
  }, [formData.pickUpDate, formData.dropOffDate, car]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!car) return;

    if (!formData.phone || !isValidPhoneNumber(formData.phone)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid phone number",
        text: "Please enter a valid phone number before confirming your booking.",
      });
      return;
    }

    bookingMutation.mutate({
      propertyId: String(car.id),
      providerId: car.providerId,
      propertyType: "car",
      startDate: formData.pickUpDate,
      endDate: formData.dropOffDate,
      pickUpLocation: formData.pickUpLocation || car.pickUpLocation,
      dropOffLocation: formData.dropOffLocation || formData.pickUpLocation,
      pickUpTime: formData.pickUpTime,
      dropOffTime: formData.dropOffTime,
      totalPrice,
      contactMail: formData.email,
      contactPhone: formData.phone,
      requesterName: formData.fullName,
    });
  };

  const serviceFee = totalPrice * 0.05;
  const tax = totalPrice * 0.1;
  const finalTotal = totalPrice + serviceFee + tax;
  if (loading) {
    return <div className="p-8 text-center">Loading car details…</div>;
  }

  if (!car) {
    return <div className="p-8 text-center">Car not found</div>;
  }

  function handlePhoneChange(value?: string): void {
    setFormData((prev) => ({
      ...prev,
      phone: value || "",
    }));
  }

  return (
    <div>
      <PrimarySearchAppBar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Complete Your Booking
            </h1>
            <p className="text-slate-600">
              Just a few more details and you're ready to go
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Form Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
                <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="john@example.com"
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <PhoneInput
                          international
                          countryCallingCodeEditable={false}
                          
                          placeholder="Enter phone number"
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          error={
                            formData.phone
                              ? isValidPhoneNumber(formData.phone)
                                ? undefined
                                : "Invalid phone number"
                              : "Phone number required"
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rental Period */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
                <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Rental Period
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Pick-up Date *
                      </label>
                      <input
                        type="date"
                        name="pickUpDate"
                        value={formData.pickUpDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Pick-up Time
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="time"
                          name="pickUpTime"
                          value={formData.pickUpTime}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Pick-up Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          name="pickUpLocation"
                          value={formData.pickUpLocation}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Drop-off Date *
                      </label>
                      <input
                        type="date"
                        name="dropOffDate"
                        value={formData.dropOffDate}
                        onChange={handleInputChange}
                        min={
                          formData.pickUpDate ||
                          new Date().toISOString().split("T")[0]
                        }
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Drop-off Time
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="time"
                          name="dropOffTime"
                          value={formData.dropOffTime}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Drop-off Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          name="dropOffLocation"
                          value={formData.dropOffLocation}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {totalDays > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      <span className="font-semibold">Rental Duration:</span>{" "}
                      {totalDays} {totalDays === 1 ? "day" : "days"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Car Summary */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={car.imageUrls?.[0]}
                      alt={car.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-1">
                      {car.brand} {car.name}
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                      {car.year} • {car.color}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="w-4 h-4" />
                        <span>{car.pickUpLocation}</span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {car.features.slice(0, 3).map((feature, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    Price Summary
                  </h3>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-slate-600">
                      <span>
                        ${car.pricePerDay} × {totalDays || 0} days
                      </span>
                      <span className="font-medium">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Service fee</span>
                      <span className="font-medium">
                        ${serviceFee.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Tax (10%)</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-slate-800">
                        Total
                      </span>
                      <span className="text-2xl font-bold text-blue-600">
                        ${finalTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={
                      bookingMutation.isPending ||
                      !formData.fullName ||
                      !formData.email ||
                      !formData.phone ||
                      !formData.pickUpDate ||
                      !formData.dropOffDate
                    }
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
                  >
                    <Check className="w-5 h-5" />
                    {bookingMutation.isPending ? "Processing..." : "Confirm Booking"}
                  </button>

                  <p className="text-xs text-slate-500 text-center mt-4">
                    You won't be charged yet
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
