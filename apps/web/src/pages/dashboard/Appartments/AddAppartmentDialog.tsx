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
import { Plus, Loader2 } from "lucide-react";
import { CreateAppartmentDto, Appartment } from "@/types/appartment.type";
import { createAppartment } from "@/services/api/appartmentService";
import { MapPicker } from "@/components/dashboard/mapPicker";
import { ImageUpload } from "@/components/dashboard/ImageUpload";

interface AddAppartmentDialogProps {
    onAppartmentAdded: (appartment: Appartment) => void;
}

export const AddAppartmentDialog: React.FC<AddAppartmentDialogProps> = ({
    onAppartmentAdded,
}) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
    const [formData, setFormData] = useState<CreateAppartmentDto>({
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
        status: "available",
        imageUrls: [],
        description: "",
        amenities: [],
        contactEmail: "",
        contactPhone: "",
        lat: undefined,
        lng: undefined,
    });

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
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

    const handleAmenitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const amenities = e.target.value.split(",").map((a) => a.trim()).filter(Boolean);
        setFormData((prev) => ({
            ...prev,
            amenities,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name || formData.price <= 0) {
            alert("Please fill in all required fields (name and price)");
            return;
        }

        if (selectedImageFiles.length === 0) {
            alert("Please upload at least one image");
            return;
        }

        setLoading(true);
        try {
            const newAppartment = await createAppartment(formData, selectedImageFiles);
            onAppartmentAdded(newAppartment);
            setOpen(false);

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
                status: "available",
                imageUrls: [],
                description: "",
                amenities: [],
                contactEmail: "",
                contactPhone: "",
                lat: undefined,
                lng: undefined,
            });
            setSelectedImageFiles([]);
        } catch (error) {
            console.error("Error adding apartment:", error);
            alert(
                `Failed to add apartment: ${error instanceof Error ? error.message : "Please try again."}`
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg">
                    <Plus className="mr-2" size={20} />
                    Add Apartment
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        Add New Apartment
                    </DialogTitle>
                    <DialogDescription>
                        Fill in the details below to add a new apartment to your property list.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium">
                                Apartment Name <span className="text-red-500">*</span>
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
                                Address
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
                                City/Location
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
                                Rating (0-5)
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
                                Price per Day ($) <span className="text-red-500">*</span>
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

                        {/* Rooms */}
                        <div className="space-y-2">
                            <Label htmlFor="rooms" className="text-sm font-medium">
                                Rooms
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
                                Beds
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
                                Kitchens
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
                                Bathrooms
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
                                Living Rooms
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

                        {/* Contact Email */}
                        <div className="space-y-2">
                            <Label htmlFor="contactEmail" className="text-sm font-medium">
                                Contact Email
                            </Label>
                            <Input
                                id="contactEmail"
                                name="contactEmail"
                                type="email"
                                value={formData.contactEmail}
                                onChange={handleChange}
                                placeholder="contact@apartment.com"
                                className="w-full"
                            />
                        </div>

                        {/* Contact Phone */}
                        <div className="space-y-2">
                            <Label htmlFor="contactPhone" className="text-sm font-medium">
                                Contact Phone
                            </Label>
                            <Input
                                id="contactPhone"
                                name="contactPhone"
                                value={formData.contactPhone}
                                onChange={handleChange}
                                placeholder="+355 69 123 4567"
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Amenities */}
                    <div className="space-y-2">
                        <Label htmlFor="amenities" className="text-sm font-medium">
                            Amenities (comma-separated)
                        </Label>
                        <Input
                            id="amenities"
                            name="amenities"
                            value={formData.amenities?.join(", ") || ""}
                            onChange={handleAmenitiesChange}
                            placeholder="WiFi, Air Conditioning, Parking, Kitchen, Balcony"
                            className="w-full"
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
                                prev.filter((_, i) => i !== index)
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
                        label="Select Apartment Location on Map"
                        defaultCenter={[41.327953, 19.819025]}
                        defaultZoom={8}
                        showCoordinates={true}
                    />

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium">
                            Description
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
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 animate-spin" size={16} />
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <Plus className="mr-2" size={16} />
                                    Add Apartment
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
