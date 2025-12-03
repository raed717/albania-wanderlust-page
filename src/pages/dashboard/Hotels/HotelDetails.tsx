import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Hsidebar from "../../../components/dashboard/hsidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    ArrowLeft,
    Edit,
    Save,
    X,
    MapPin,
    Star,
    Users,
    Bed,
    DollarSign,
    Mail,
    Phone,
    Clock,
    Home,
    Loader2,
} from "lucide-react";
import { Hotel, UpdateHotelDto } from "@/types/hotel.types";
import { getHotelById, updateHotel } from "@/services/api/hotelService";
import Swal from "sweetalert2";

const HotelDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editMode = searchParams.get("edit") === "true";

    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(editMode);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<UpdateHotelDto>({});

    // Fetch hotel data
    useEffect(() => {
        const fetchHotel = async () => {
            if (!id) return;

            setLoading(true);
            try {
                const data = await getHotelById(parseInt(id));

                // If no data from service, use mock data for demo
                if (!data) {
                    // Mock hotel data for demonstration
                    const mockHotel: Hotel = {
                        id: parseInt(id),
                        name: "Grand Plaza Hotel",
                        location: "New York, USA",
                        rating: 4.8,
                        rooms: 150,
                        occupancy: 85,
                        price: 299,
                        status: "active",
                        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
                        description: "Luxurious hotel in the heart of Manhattan with stunning city views, world-class amenities, and exceptional service. Perfect for business and leisure travelers.",
                        amenities: ["Free WiFi", "Pool", "Spa", "Gym", "Restaurant", "Room Service", "Parking"],
                        contactEmail: "info@grandplaza.com",
                        contactPhone: "+1 (212) 555-0100",
                        address: "123 Fifth Avenue, New York, NY 10001",
                    };
                    setHotel(mockHotel);
                    setFormData(mockHotel);
                } else {
                    setHotel(data);
                    setFormData(data);
                }
            } catch (error) {
                console.error("Error fetching hotel:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHotel();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "rating" || name === "rooms" || name === "occupancy" || name === "price"
                ? parseFloat(value) || 0
                : value,
        }));
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        if (hotel) {
            setFormData(hotel);
        }
    };

    const handleSave = async () => {
        if (!id) return;

        setSaving(true);
        try {
            const updatedHotel = await updateHotel(parseInt(id), formData);
            setHotel(updatedHotel);
            setIsEditing(false);
            Swal.fire({
                icon: "success",
                title: "Success...",
                text: "Hotel updated successfully!",
            });
        } catch (error) {
            console.error("Error updating hotel:", error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Hsidebar>
                <div className="flex items-center justify-center h-screen">
                    <Loader2 className="animate-spin text-blue-600" size={48} />
                </div>
            </Hsidebar>
        );
    }

    if (!hotel) {
        return (
            <Hsidebar>
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-20">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Hotel Not Found</h3>
                        <p className="text-gray-500 mb-8">The hotel you're looking for doesn't exist.</p>
                        <Button onClick={() => navigate("/dashboard/HotelsList")}>
                            <ArrowLeft className="mr-2" size={16} />
                            Back to Hotels
                        </Button>
                    </div>
                </div>
            </Hsidebar>
        );
    }

    return (
        <Hsidebar>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/dashboard/HotelsList")}
                            className="mb-4 -ml-4"
                        >
                            <ArrowLeft className="mr-2" size={16} />
                            Back to Hotels
                        </Button>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {isEditing ? "Edit Hotel" : "Hotel Details"}
                        </h1>
                        <p className="text-gray-500 text-lg mt-1">
                            {isEditing ? "Update hotel information" : "View complete hotel information"}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        {isEditing ? (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={saving}
                                >
                                    <X className="mr-2" size={16} />
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="mr-2 animate-spin" size={16} />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2" size={16} />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </>
                        ) : (
                            <Button
                                onClick={handleEdit}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                            >
                                <Edit className="mr-2" size={16} />
                                Edit Hotel
                            </Button>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Image and Basic Info */}
                    <div className="lg:col-span-1">
                        {/* Hotel Image */}
                        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 mb-6">
                            <div
                                className="h-64 bg-cover bg-center"
                                style={{
                                    backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.3)), url(${isEditing ? formData.image : hotel.image})`,
                                }}
                            />
                            {isEditing && (
                                <div className="p-4">
                                    <Label htmlFor="image" className="text-sm font-medium">
                                        Image URL
                                    </Label>
                                    <Input
                                        id="image"
                                        name="image"
                                        value={formData.image || ""}
                                        onChange={handleChange}
                                        placeholder="https://..."
                                        className="mt-2"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Status Badge */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <Label className="text-sm font-medium mb-2 block">Status</Label>
                            {isEditing ? (
                                <select
                                    name="status"
                                    value={formData.status || "active"}
                                    onChange={handleChange}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <option value="active">Active</option>
                                    <option value="maintenance">Maintenance</option>
                                </select>
                            ) : (
                                <span
                                    className={`inline-block px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider ${hotel.status === "active"
                                            ? "bg-emerald-500 text-white"
                                            : "bg-amber-500 text-white"
                                        }`}
                                >
                                    {hotel.status}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                                        <Home size={16} className="text-blue-500" />
                                        Hotel Name
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            id="name"
                                            name="name"
                                            value={formData.name || ""}
                                            onChange={handleChange}
                                            className="text-lg font-semibold"
                                        />
                                    ) : (
                                        <p className="text-lg font-semibold text-gray-900">{hotel.name}</p>
                                    )}
                                </div>

                                {/* Location */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium flex items-center gap-2">
                                        <MapPin size={16} className="text-blue-500" />
                                        Location
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            name="location"
                                            value={formData.location || ""}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <p className="text-gray-700">{hotel.location}</p>
                                    )}
                                </div>

                                {/* Rating */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium flex items-center gap-2">
                                        <Star size={16} className="text-amber-400 fill-amber-400" />
                                        Rating
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            name="rating"
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="5"
                                            value={formData.rating || 0}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <p className="text-lg font-semibold text-gray-900">{hotel.rating} / 5.0</p>
                                    )}
                                </div>

                                {/* Price */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium flex items-center gap-2">
                                        <DollarSign size={16} className="text-emerald-500" />
                                        Price per Night
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            name="price"
                                            type="number"
                                            min="0"
                                            value={formData.price || 0}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <p className="text-lg font-semibold text-gray-900">${hotel.price}</p>
                                    )}
                                </div>

                                {/* Rooms */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium flex items-center gap-2">
                                        <Bed size={16} className="text-gray-500" />
                                        Total Rooms
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            name="rooms"
                                            type="number"
                                            min="0"
                                            value={formData.rooms || 0}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <p className="text-gray-700">{hotel.rooms} Rooms</p>
                                    )}
                                </div>

                                {/* Occupancy */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium flex items-center gap-2">
                                        <Users size={16} className="text-gray-500" />
                                        Occupancy Rate
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            name="occupancy"
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={formData.occupancy || 0}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <p className="text-gray-700">{hotel.occupancy}%</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Email */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium flex items-center gap-2">
                                        <Mail size={16} className="text-blue-500" />
                                        Email
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            name="contactEmail"
                                            type="email"
                                            value={formData.contactEmail || ""}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <p className="text-gray-700">{hotel.contactEmail || "N/A"}</p>
                                    )}
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium flex items-center gap-2">
                                        <Phone size={16} className="text-blue-500" />
                                        Phone
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            name="contactPhone"
                                            value={formData.contactPhone || ""}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <p className="text-gray-700">{hotel.contactPhone || "N/A"}</p>
                                    )}
                                </div>

                                {/* Address - Full Width */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-sm font-medium flex items-center gap-2">
                                        <MapPin size={16} className="text-blue-500" />
                                        Full Address
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            name="address"
                                            value={formData.address || ""}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <p className="text-gray-700">{hotel.address || "N/A"}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                            {isEditing ? (
                                <textarea
                                    name="description"
                                    value={formData.description || ""}
                                    onChange={handleChange}
                                    rows={4}
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                                />
                            ) : (
                                <p className="text-gray-700 leading-relaxed">
                                    {hotel.description || "No description available."}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Hsidebar>
    );
};

export default HotelDetails;
