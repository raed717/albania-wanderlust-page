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
import { Plus, Loader2, Clock } from "lucide-react";
import { propertyRequestService } from "@/services/api/propertyRequest";
import { authService } from "@/services/api/authService";
import {
  CreateApartmentDto,
  Apartment,
  PREDEFINED_AMENITIES,
} from "@/types/apartment.type";
import { createApartment } from "@/services/api/apartmentService";
import { MapPicker } from "@/components/dashboard/mapPicker";
import { ImageUpload } from "@/components/dashboard/ImageUpload";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
interface AddApartmentDialogProps {
  onApartmentAdded: (apartment: Apartment) => void;
}

export const AddApartmentDialog: React.FC<AddApartmentDialogProps> = ({
  onApartmentAdded,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState<CreateApartmentDto>({
    name: "",
    address: "",
    location: "",
    rating: 0,
    rooms: 1,
    beds: 1,
    kitchens: 1,
    bathrooms: 1,
    livingRooms: 1,
    price: 0,
    status: "review",
    imageUrls: [],
    description: "",
    amenities: [],
    lat: undefined,
    lng: undefined,
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
        name === "rating" ||
        name === "rooms" ||
        name === "beds" ||
        name === "kitchens" ||
        name === "bathrooms" ||
        name === "livingRooms" ||
        name === "price"
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

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => {
      const currentAmenities = prev.amenities || [];
      const isSelected = currentAmenities.includes(amenity);

      if (isSelected) {
        return {
          ...prev,
          amenities: currentAmenities.filter((a) => a !== amenity),
        };
      } else {
        return {
          ...prev,
          amenities: [...currentAmenities, amenity],
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || formData.price <= 0) {
      alert(t("apartment.requiredFields"));
      return;
    }

    if (selectedImageFiles.length === 0) {
      alert(t("apartment.uploadImage"));
      return;
    }

    setLoading(true);
    try {
      // Get the current user's ID for the property request
      const providerId = await authService.getCurrentUserId();
      if (!providerId) {
        throw new Error("User not authenticated");
      }

      // Create the apartment with 'review' status - needs admin approval
      const apartmentData: CreateApartmentDto = {
        ...formData,
        status: "review",
      };

      const newApartment = await createApartment(
        apartmentData,
        selectedImageFiles,
      );

      // Create a property request for admin review
      await propertyRequestService.createRequest(
        providerId,
        newApartment.id.toString(),
        "apartment",
        `New apartment listing: ${formData.name}`,
      );

      onApartmentAdded(newApartment);
      setSubmissionSuccess(true);

      // Reset form
      setFormData({
        name: "",
        address: "",
        location: "",
        rating: 0,
        rooms: 1,
        beds: 1,
        kitchens: 1,
        bathrooms: 1,
        livingRooms: 1,
        price: 0,
        status: "review",
        imageUrls: [],
        description: "",
        amenities: [],
        lat: undefined,
        lng: undefined,
      });
      setSelectedImageFiles([]);
    } catch (error) {
      console.error("Error adding apartment:", error);
      alert(
        `${t("apartment.addFailed")}: ${error instanceof Error ? error.message : t("common.tryAgain")}`,
      );
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
        <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg">
          <Plus className="mr-2" size={20} />
          {t("apartment.addApartment")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {submissionSuccess ? (
          <div>
            {/* Success State */}
            <div className="py-12 text-center">
              <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {t("apartment.successTitle")}
                </DialogTitle>
                <DialogDescription className="text-gray-600 max-w-md mx-auto">
                  {t("apartment.successMessage")}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto">
                <div className="flex items-center gap-2 text-yellow-800">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">
                    {t("apartment.statusPending")}
                  </span>
                </div>
                <p className="text-sm text-yellow-700 mt-2">
                  {t("apartment.statusDescription")}
                </p>
              </div>
              <Button
                onClick={() => {
                  setOpen(false);
                  setSubmissionSuccess(false);
                }}
                className="mt-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                {t("apartment.close")}
              </Button>
            </div>
          </div>
        ) : (
          <div>
            {/* Form State */}
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {t("apartment.addNewApartment")}
              </DialogTitle>
              <DialogDescription>
                {t("apartment.addDescription")}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    {t("apartment.apartmentName")}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Luxury Downtown Apartment"
                    required
                    className="w-full"
                  />
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium">
                    {t("apartment.address")}
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Main Street, Tirana"
                    className="w-full"
                  />
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium">
                    {t("apartment.cityLocation")}
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Tirana, Albania"
                    className="w-full"
                  />
                </div>

                {/* Rating */}
                <div className="space-y-2">
                  <Label htmlFor="rating" className="text-sm font-medium">
                    {t("apartment.rating")}
                  </Label>
                  <Input
                    id="rating"
                    name="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={handleChange}
                    placeholder="4.5"
                    className="w-full"
                  />
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-medium">
                    {t("apartment.pricePerDay")}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="150"
                    required
                    className="w-full"
                  />
                </div>

                {/* Rooms */}
                <div className="space-y-2">
                  <Label htmlFor="rooms" className="text-sm font-medium">
                    {t("apartment.rooms")}
                  </Label>
                  <Input
                    id="rooms"
                    name="rooms"
                    type="number"
                    min="0"
                    value={formData.rooms}
                    onChange={handleChange}
                    placeholder="3"
                    className="w-full"
                  />
                </div>

                {/* Beds */}
                <div className="space-y-2">
                  <Label htmlFor="beds" className="text-sm font-medium">
                    {t("apartment.beds")}
                  </Label>
                  <Input
                    id="beds"
                    name="beds"
                    type="number"
                    min="0"
                    value={formData.beds}
                    onChange={handleChange}
                    placeholder="2"
                    className="w-full"
                  />
                </div>

                {/* Kitchens */}
                <div className="space-y-2">
                  <Label htmlFor="kitchens" className="text-sm font-medium">
                    {t("apartment.kitchens")}
                  </Label>
                  <Input
                    id="kitchens"
                    name="kitchens"
                    type="number"
                    min="0"
                    value={formData.kitchens}
                    onChange={handleChange}
                    placeholder="1"
                    className="w-full"
                  />
                </div>

                {/* Bathrooms */}
                <div className="space-y-2">
                  <Label htmlFor="bathrooms" className="text-sm font-medium">
                    {t("apartment.bathrooms")}
                  </Label>
                  <Input
                    id="bathrooms"
                    name="bathrooms"
                    type="number"
                    min="0"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    placeholder="1"
                    className="w-full"
                  />
                </div>

                {/* Living Rooms */}
                <div className="space-y-2">
                  <Label htmlFor="livingRooms" className="text-sm font-medium">
                    {t("apartment.livingRooms")}
                  </Label>
                  <Input
                    id="livingRooms"
                    name="livingRooms"
                    type="number"
                    min="0"
                    value={formData.livingRooms}
                    onChange={handleChange}
                    placeholder="1"
                    className="w-full"
                  />
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  {t("apartment.amenities")}
                </Label>

                {/* Selected Amenities */}
                {formData.amenities && formData.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.amenities.map((amenity) => (
                      <Badge
                        key={amenity}
                        variant="default"
                        className="cursor-pointer hover:bg-red-500 hover:text-white transition-colors flex items-center gap-1"
                        onClick={() => handleAmenityToggle(amenity)}
                      >
                        {amenity}
                        <X size={12} />
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Available Amenities */}
                <div className="space-y-2">
                  <Label className="text-xs text-gray-500">
                    Click to select amenities:
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {PREDEFINED_AMENITIES.map((amenity) => {
                      const isSelected =
                        formData.amenities?.includes(amenity) || false;
                      return (
                        <Badge
                          key={amenity}
                          variant={isSelected ? "default" : "outline"}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-blue-500 hover:bg-blue-600"
                              : "hover:bg-gray-100"
                          }`}
                          onClick={() => handleAmenityToggle(amenity)}
                        >
                          {amenity}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Image Upload Component */}
              <ImageUpload
                propertyType="Apartment"
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

              {/* Map Picker Component */}
              <MapPicker
                lat={formData.lat}
                lng={formData.lng}
                onLocationSelect={handleLocationSelect}
                label={t("apartment.selectLocation")}
                defaultCenter={[41.327953, 19.819025]}
                defaultZoom={8}
                showCoordinates={true}
              />

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  {t("apartment.description")}
                </Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the apartment features, amenities, and location..."
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                >
                  {t("apartment.cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" size={16} />
                      {t("apartment.adding")}
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2" size={16} />
                      {t("apartment.addApartment")}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
