import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2, CheckCircle, Clock } from "lucide-react";
import { CreateCarDto } from "@/types/car.types";
import { MonthlyPriceInput } from "@/types/price.type";
import { addCar } from "@/services/api/carService";
import { MapPicker } from "@/components/dashboard/mapPicker";
import { ImageUpload } from "@/components/dashboard/ImageUpload";
import { MonthlyPricingEditor } from "@/components/dashboard/MonthlyPricingEditor";
import { propertyRequestService } from "@/services/api/propertyRequest";
import { authService } from "@/services/api/authService";

interface AddCarDialogProps {
  onCarAdded: (car: any) => void;
}

export const AddCarDialog: React.FC<AddCarDialogProps> = ({ onCarAdded }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  const featureInputRef = React.useRef<HTMLInputElement>(null);
  const [monthlyPrices, setMonthlyPrices] = useState<MonthlyPriceInput[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    type: "Sedan" as "Sedan" | "SUV" | "Sports",
    year: new Date().getFullYear(),
    transmission: "Manual" as "Manual" | "Automatic",
    fuelType: "Petrol" as "Petrol" | "Diesel" | "Hybrid" | "Electric",
    seats: 5,
    mileage: 0,
    pricePerDay: 10,
    status: "available" as "available" | "rented" | "maintenance",
    color: "",
    plateNumber: "",
    features: [] as string[],
    imageUrls: [] as string[],
    pickUpLocation: "",
    lat: undefined as number | undefined,
    lng: undefined as number | undefined,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "year" ||
        name === "seats" ||
        name === "mileage" ||
        name === "pricePerDay"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      lat,
      lng,
    }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (
      !formData.name ||
      !formData.brand ||
      !formData.plateNumber ||
      formData.pricePerDay <= 0
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (formData.lat === undefined || formData.lng === undefined) {
      alert("Please select a location on the map");
      return;
    }

    if (selectedImageFiles.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    setLoading(true);
    try {
      // Get the current user's ID for the property request
      const providerId = await authService.getCurrentUserId();
      if (!providerId) {
        throw new Error("User not authenticated");
      }

      // Create payload with 'review' status - car needs admin approval
      const carData: CreateCarDto = {
        name: formData.name,
        brand: formData.brand,
        type: formData.type,
        year: formData.year,
        transmission: formData.transmission,
        fuelType: formData.fuelType,
        seats: formData.seats,
        mileage: formData.mileage,
        pricePerDay: formData.pricePerDay,
        status: "review", // Car is created with 'review' status until approved
        color: formData.color,
        plateNumber: formData.plateNumber,
        features: formData.features,
        imageUrls: formData.imageUrls,
        pickUpLocation: formData.pickUpLocation,
        lat: formData.lat,
        lng: formData.lng,
        monthlyPrices: monthlyPrices.length > 0 ? monthlyPrices : undefined,
      };

      // Create the car first
      const newCar = await addCar(carData, selectedImageFiles);

      // Create a property request for admin review
      await propertyRequestService.createRequest(
        providerId,
        newCar.id.toString(),
        "car",
        `New car listing: ${formData.brand} ${formData.name} (${formData.year})`,
      );

      onCarAdded(newCar);
      setSubmissionSuccess(true);

      // Reset form
      setFormData({
        name: "",
        brand: "",
        type: "Sedan",
        year: new Date().getFullYear(),
        transmission: "Manual",
        fuelType: "Petrol",
        seats: 5,
        mileage: 0,
        pricePerDay: 10,
        status: "available",
        color: "",
        plateNumber: "",
        features: [],
        imageUrls: [],
        pickUpLocation: "",
        lat: undefined,
        lng: undefined,
      });
      setSelectedImageFiles([]);
      setMonthlyPrices([]);
    } catch (error) {
      console.error("Error adding car:", error);
      alert("Failed to add car. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setSubmissionSuccess(false);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
          <Plus className="mr-2" size={20} />
          Add Car
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {submissionSuccess ? (
          // Success State
          <div className="py-12 text-center">
            <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                Car Submitted for Review
              </DialogTitle>
              <DialogDescription className="text-gray-600 max-w-md mx-auto">
                Your car has been successfully submitted and is pending admin
                approval. You will be notified once your listing is reviewed.
                The car will become available for booking after approval.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto">
              <div className="flex items-center gap-2 text-yellow-800">
                <Clock className="w-5 h-5" />
                <span className="font-medium">Status: Pending Review</span>
              </div>
              <p className="text-sm text-yellow-700 mt-2">
                An administrator will review your car details and approve or
                request changes.
              </p>
            </div>
            <Button
              onClick={() => {
                setOpen(false);
                setSubmissionSuccess(false);
              }}
              className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Close
            </Button>
          </div>
        ) : (
          // Form State
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Add New Car
              </DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new car to your fleet. Your
                car will be reviewed by an admin before it becomes available for
                booking.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Car Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Tesla Model 3"
                    className="w-full"
                  />
                </div>

                {/* Brand */}
                <div className="space-y-2">
                  <Label htmlFor="brand" className="text-sm font-medium">
                    Brand <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Tesla"
                    className="w-full"
                  />
                </div>

                {/* Type */}
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-sm font-medium">
                    Type
                  </Label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>

                {/* Year */}
                <div className="space-y-2">
                  <Label htmlFor="year" className="text-sm font-medium">
                    Year
                  </Label>
                  <Input
                    id="year"
                    name="year"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="2024"
                    className="w-full"
                  />
                </div>

                {/* Transmission */}
                <div className="space-y-2">
                  <Label htmlFor="transmission" className="text-sm font-medium">
                    Transmission
                  </Label>
                  <select
                    id="transmission"
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                  </select>
                </div>

                {/* Fuel Type */}
                <div className="space-y-2">
                  <Label htmlFor="fuelType" className="text-sm font-medium">
                    Fuel Type
                  </Label>
                  <select
                    id="fuelType"
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>

                {/* Seats */}
                <div className="space-y-2">
                  <Label htmlFor="seats" className="text-sm font-medium">
                    Seats
                  </Label>
                  <Input
                    id="seats"
                    name="seats"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.seats}
                    onChange={handleChange}
                    placeholder="5"
                    className="w-full"
                  />
                </div>

                {/* Mileage */}
                <div className="space-y-2">
                  <Label htmlFor="mileage" className="text-sm font-medium">
                    Mileage (km)
                  </Label>
                  <Input
                    id="mileage"
                    name="mileage"
                    type="number"
                    min="0"
                    value={formData.mileage}
                    onChange={handleChange}
                    placeholder="15000"
                    className="w-full"
                  />
                </div>

                {/* Price Per Day */}
                <div className="space-y-2">
                  <Label htmlFor="pricePerDay" className="text-sm font-medium">
                    Base Price per Day ($){" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="pricePerDay"
                    name="pricePerDay"
                    type="number"
                    min="10"
                    value={formData.pricePerDay}
                    onChange={handleChange}
                    placeholder="89"
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">
                    This is the default price. You can set seasonal prices
                    below.
                  </p>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium">
                    Status
                  </Label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="available">Available</option>
                    <option value="rented">Rented</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                {/* Color */}
                <div className="space-y-2">
                  <Label htmlFor="color" className="text-sm font-medium">
                    Color
                  </Label>
                  <Input
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    placeholder="Black"
                    className="w-full"
                  />
                </div>

                {/* Plate Number */}
                <div className="space-y-2">
                  <Label htmlFor="plateNumber" className="text-sm font-medium">
                    Plate Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="plateNumber"
                    name="plateNumber"
                    value={formData.plateNumber}
                    onChange={handleChange}
                    placeholder="ABC-1234"
                    className="w-full"
                  />
                </div>
              </div>

              {/* Monthly Pricing Editor */}
              <div className="border-t pt-6">
                <MonthlyPricingEditor
                  prices={monthlyPrices}
                  onChange={setMonthlyPrices}
                  basePrice={formData.pricePerDay}
                  disabled={loading}
                />
              </div>

              {/* Image Upload Component */}
              <ImageUpload
                onImagesSelected={(files) => {
                  setSelectedImageFiles(files);
                }}
                selectedFiles={selectedImageFiles}
                onRemoveFile={(index) => {
                  setSelectedImageFiles((prev) =>
                    prev.filter((_, i) => i !== index),
                  );
                }}
                maxImages={10}
                isLoading={loading}
              />

              {/* Pick Up Location */}
              <div className="space-y-2">
                <Label htmlFor="pickUpLocation" className="text-sm font-medium">
                  Pick-up Location
                </Label>
                <Input
                  id="pickUpLocation"
                  name="pickUpLocation"
                  value={formData.pickUpLocation}
                  onChange={handleChange}
                  placeholder="Tirana Airport, Albania"
                  className="w-full"
                />
              </div>

              {/* Features */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Features</Label>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                      >
                        <span>{feature}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              features: prev.features.filter(
                                (_, i) => i !== index,
                              ),
                            }))
                          }
                          className="hover:bg-blue-100 rounded-full p-0.5"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      ref={featureInputRef}
                      placeholder="Add a new feature (e.g., GPS, Air Conditioning)"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.currentTarget.value.trim()) {
                          e.preventDefault();
                          const newFeature = e.currentTarget.value.trim();
                          setFormData((prev) => ({
                            ...prev,
                            features: [...prev.features, newFeature],
                          }));
                          e.currentTarget.value = "";
                        }
                      }}
                      className="flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const inputValue =
                          featureInputRef.current?.value.trim();
                        if (inputValue) {
                          setFormData((prev) => ({
                            ...prev,
                            features: [...prev.features, inputValue],
                          }));
                          if (featureInputRef.current) {
                            featureInputRef.current.value = "";
                          }
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Map Picker Component */}
              <MapPicker
                lat={formData.lat}
                lng={formData.lng}
                onLocationSelect={handleLocationSelect}
                label="Select Pick-up Location on Map (Required)"
                defaultCenter={[41.327953, 19.819025]}
                defaultZoom={8}
                showCoordinates={true}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" size={16} />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2" size={16} />
                    Submit for Review
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
