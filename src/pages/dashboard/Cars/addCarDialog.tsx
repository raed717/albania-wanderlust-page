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
import { CreateCarDto } from "@/types/car.types";
import { addCar } from "@/services/api/carService";
import { MapPicker } from "@/components/dashboard/mapPicker";

interface AddCarDialogProps {
    onCarAdded: (car: any) => void;
}

export const AddCarDialog: React.FC<AddCarDialogProps> = ({
    onCarAdded,
}) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        brand: "",
        type: "",
        year: new Date().getFullYear(),
        transmission: "Manual" as "Manual" | "Automatic",
        fuelType: "Petrol" as "Petrol" | "Diesel" | "Hybrid" | "Electric",
        seats: 5,
        mileage: 0,
        pricePerDay: 0,
        status: "available" as "available" | "rented" | "maintenance",
        color: "",
        plateNumber: "",
        features: [] as string[],
        image: "",
        pickUpLocation: "",
        lat: undefined as number | undefined,
        lng: undefined as number | undefined,
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
        if (!formData.name || !formData.brand || !formData.plateNumber || formData.pricePerDay <= 0) {
            alert("Please fill in all required fields");
            return;
        }

        // Validate coordinates
        if (formData.lat === undefined || formData.lng === undefined) {
            alert("Please select a location on the map");
            return;
        }

        setLoading(true);
        try {
            // Create payload with proper types
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
                status: formData.status,
                color: formData.color,
                plateNumber: formData.plateNumber,
                features: formData.features,
                image: formData.image,
                pickUpLocation: formData.pickUpLocation,
                lat: formData.lat,
                lng: formData.lng,
            };

            const newCar = await addCar(carData);
            onCarAdded(newCar);
            setOpen(false);

            // Reset form
            setFormData({
                name: "",
                brand: "",
                type: "",
                year: new Date().getFullYear(),
                transmission: "Manual",
                fuelType: "Petrol",
                seats: 5,
                mileage: 0,
                pricePerDay: 0,
                status: "available",
                color: "",
                plateNumber: "",
                features: [],
                image: "",
                pickUpLocation: "",
                lat: undefined,
                lng: undefined,
            });
        } catch (error) {
            console.error("Error adding car:", error);
            alert("Failed to add car. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
                    <Plus className="mr-2" size={20} />
                    Add Car
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Add New Car
                    </DialogTitle>
                    <DialogDescription>
                        Fill in the details below to add a new car to your fleet.
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
                            <Input
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                placeholder="Sedan, SUV, Sports..."
                                className="w-full"
                            />
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
                                Price per Day ($) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="pricePerDay"
                                name="pricePerDay"
                                type="number"
                                min="0"
                                value={formData.pricePerDay}
                                onChange={handleChange}
                                placeholder="89"
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

                        {/* Image URL */}
                        <div className="space-y-2">
                            <Label htmlFor="image" className="text-sm font-medium">
                                Image URL
                            </Label>
                            <Input
                                id="image"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="https://images.unsplash.com/..."
                                className="w-full"
                            />
                        </div>
                    </div>

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
                                Add Car
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};