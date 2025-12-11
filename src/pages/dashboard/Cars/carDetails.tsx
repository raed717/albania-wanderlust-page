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
  DollarSign,
  Car as CarIcon,
  Loader2,
  Gauge,
  Fuel,
  Settings,
  Calendar,
  Palette,
} from "lucide-react";
import { Car, UpdateCarDto } from "@/types/car.types";
import { MapPicker } from "@/components/dashboard/mapPicker";
import Swal from "sweetalert2";
import { getCarById, updateCar } from "@/services/api/carService";

const CarDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editMode = searchParams.get("edit") === "true";

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(editMode);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<UpdateCarDto>({});
  const featureInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCar = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const data = await getCarById(parseInt(id));
        setCar(data);
        setFormData(data);
      } catch (error) {
        console.error("Error fetching car:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

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
        name === "pricePerDay" ||
        name === "lat" ||
        name === "lng"
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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (car) {
      setFormData(car);
    }
  };

  const handleSave = async () => {
    if (!id) return;

    setSaving(true);
    try {
      const updatedCar = await updateCar(parseInt(id), formData);
      setCar(updatedCar);
      setIsEditing(false);
      Swal.fire({
        icon: "success",
        title: "Success...",
        text: "Car updated successfully!",
      });
    } catch (error) {
      console.error("Error updating car:", error);
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

  if (!car) {
    return (
      <Hsidebar>
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Car Not Found
            </h3>
            <p className="text-gray-500 mb-8">
              The car you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate("/dashboard/carsList")}>
              <ArrowLeft className="mr-2" size={16} />
              Back to Cars
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
              onClick={() => navigate("/dashboard/carsList")}
              className="mb-4 -ml-4"
            >
              <ArrowLeft className="mr-2" size={16} />
              Back to Cars
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? "Edit Car" : "Car Details"}
            </h1>
            <p className="text-gray-500 text-lg mt-1">
              {isEditing
                ? "Update car information"
                : "View complete car information"}
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
                Edit Car
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image and Status */}
          <div className="lg:col-span-1">
            {/* Car Image */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 mb-6">
              <div
                className="h-64 bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.3)), url(${isEditing ? formData.image : car.image})`,
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
                  value={formData.status || "available"}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="available">Available</option>
                  <option value="rented">Rented</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              ) : (
                <span
                  className={`inline-block px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider ${
                    car.status === "available"
                      ? "bg-emerald-500 text-white"
                      : car.status === "rented"
                        ? "bg-blue-500 text-white"
                        : "bg-amber-500 text-white"
                  }`}
                >
                  {car.status}
                </span>
              )}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <CarIcon size={16} className="text-blue-500" />
                    Car Name
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
                    <p className="text-lg font-semibold text-gray-900">
                      {car.name}
                    </p>
                  )}
                </div>

                {/* Brand */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Star size={16} className="text-amber-400 fill-amber-400" />
                    Brand
                  </Label>
                  {isEditing ? (
                    <select
                      name="brand"
                      value={formData.brand || ""}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-md p-2"
                    >
                      <option value="" disabled selected>
                        Select a brand
                      </option>
                      <option value="Acura">Acura</option>
                      <option value="Alfa Romeo">Alfa Romeo</option>
                      <option value="Aston Martin">Aston Martin</option>
                      <option value="Audi">Audi</option>
                      <option value="Bentley">Bentley</option>
                      <option value="BMW">BMW</option>
                      <option value="Buick">Buick</option>
                      <option value="Cadillac">Cadillac</option>
                      <option value="Chevrolet">Chevrolet</option>
                      <option value="Chrysler">Chrysler</option>
                      <option value="Citroën">Citroën</option>
                      <option value="Dodge">Dodge</option>
                      <option value="Ferrari">Ferrari</option>
                      <option value="Fiat">Fiat</option>
                      <option value="Ford">Ford</option>
                      <option value="Genesis">Genesis</option>
                      <option value="GMC">GMC</option>
                      <option value="Honda">Honda</option>
                      <option value="Hyundai">Hyundai</option>
                      <option value="Infiniti">Infiniti</option>
                      <option value="Jaguar">Jaguar</option>
                      <option value="Jeep">Jeep</option>
                      <option value="Kia">Kia</option>
                      <option value="Lamborghini">Lamborghini</option>
                      <option value="Land Rover">Land Rover</option>
                      <option value="Lexus">Lexus</option>
                      <option value="Lincoln">Lincoln</option>
                      <option value="Lotus">Lotus</option>
                      <option value="Maserati">Maserati</option>
                      <option value="Mazda">Mazda</option>
                      <option value="McLaren">McLaren</option>
                      <option value="Mercedes-Benz">Mercedes-Benz</option>
                      <option value="Mini">Mini</option>
                      <option value="Mitsubishi">Mitsubishi</option>
                      <option value="Nissan">Nissan</option>
                      <option value="Peugeot">Peugeot</option>
                      <option value="Porsche">Porsche</option>
                      <option value="Ram">Ram</option>
                      <option value="Renault">Renault</option>
                      <option value="Rolls-Royce">Rolls-Royce</option>
                      <option value="Saab">Saab</option>
                      <option value="Seat">Seat</option>
                      <option value="Skoda">Skoda</option>
                      <option value="Smart">Smart</option>
                      <option value="Subaru">Subaru</option>
                      <option value="Suzuki">Suzuki</option>
                      <option value="Tesla">Tesla</option>
                      <option value="Toyota">Toyota</option>
                      <option value="Volkswagen">Volkswagen</option>
                      <option value="Volvo">Volvo</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="text-gray-700">{car.brand}</p>
                  )}
                </div>

                {/* Type */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Settings size={16} className="text-gray-500" />
                    Type
                  </Label>
                  {isEditing ? (
                    <select
                      name="type"
                      value={formData.type || ""}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-md p-2"
                    >
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="Sports">Sports</option>
                    </select>
                  ) : (
                    <p className="text-gray-700">{car.type}</p>
                  )}
                </div>

                {/* Year */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500" />
                    Year
                  </Label>
                  {isEditing ? (
                    <Input
                      name="year"
                      type="number"
                      min="1900"
                      max="2100"
                      value={formData.year || 0}
                      onChange={handleChange}
                    />
                  ) : (
                    <p className="text-gray-700">{car.year}</p>
                  )}
                </div>

                {/* Transmission */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Settings size={16} className="text-gray-500" />
                    Transmission
                  </Label>
                  {isEditing ? (
                    <select
                      name="transmission"
                      value={formData.transmission || ""}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="Manual">Manual</option>
                      <option value="Automatic">Automatic</option>
                    </select>
                  ) : (
                    <p className="text-gray-700">{car.transmission}</p>
                  )}
                </div>

                {/* Fuel Type */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Fuel size={16} className="text-gray-500" />
                    Fuel Type
                  </Label>
                  {isEditing ? (
                    <select
                      name="fuelType"
                      value={formData.fuelType || ""}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Electric">Electric</option>
                    </select>
                  ) : (
                    <p className="text-gray-700">{car.fuelType}</p>
                  )}
                </div>

                {/* Seats */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Users size={16} className="text-gray-500" />
                    Seats
                  </Label>
                  {isEditing ? (
                    <Input
                      name="seats"
                      type="number"
                      min="1"
                      max="20"
                      value={formData.seats || 0}
                      onChange={handleChange}
                    />
                  ) : (
                    <p className="text-gray-700">{car.seats} Seats</p>
                  )}
                </div>

                {/* Price per Day */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <DollarSign size={16} className="text-emerald-500" />
                    Price per Day
                  </Label>
                  {isEditing ? (
                    <Input
                      name="pricePerDay"
                      type="number"
                      min="0"
                      value={formData.pricePerDay || 0}
                      onChange={handleChange}
                    />
                  ) : (
                    <p className="text-lg font-semibold text-gray-900">
                      ${car.pricePerDay}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Vehicle Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Color */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Palette size={16} className="text-blue-500" />
                    Color
                  </Label>
                  {isEditing ? (
                    <Input
                      name="color"
                      value={formData.color || ""}
                      onChange={handleChange}
                    />
                  ) : (
                    <p className="text-gray-700">{car.color}</p>
                  )}
                </div>

                {/* Plate Number */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <CarIcon size={16} className="text-blue-500" />
                    Plate Number
                  </Label>
                  {isEditing ? (
                    <Input
                      name="plateNumber"
                      value={formData.plateNumber || ""}
                      onChange={handleChange}
                    />
                  ) : (
                    <p className="text-gray-700">{car.plateNumber}</p>
                  )}
                </div>

                {/* Mileage */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Gauge size={16} className="text-blue-500" />
                    Mileage
                  </Label>
                  {isEditing ? (
                    <Input
                      name="mileage"
                      type="number"
                      min="0"
                      max="999999"
                      value={formData.mileage || ""}
                      onChange={handleChange}
                    />
                  ) : (
                    <p className="text-gray-700">{car.mileage}</p>
                  )}
                </div>

                {/* Pick Up Location */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <MapPin size={16} className="text-blue-500" />
                    Pick Up Location
                  </Label>
                  {isEditing ? (
                    <Input
                      name="pickUpLocation"
                      value={formData.pickUpLocation || ""}
                      onChange={handleChange}
                    />
                  ) : (
                    <p className="text-gray-700">{car.pickUpLocation}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Features</h2>
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {(formData.features || []).map((feature, index) => (
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
                                (_, i) => i !== index
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
                      placeholder="Add a new feature"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.currentTarget.value.trim()) {
                          e.preventDefault();
                          const newFeature = e.currentTarget.value.trim();
                          setFormData((prev) => ({
                            ...prev,
                            features: [...(prev.features || []), newFeature],
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
                            features: [...(prev.features || []), inputValue],
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
              ) : (
                <div className="flex flex-wrap gap-2">
                  {car.features && car.features.length > 0 ? (
                    car.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {feature}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">No features listed.</p>
                  )}
                </div>
              )}
            </div>

            {/* Map Location */}
            {isEditing ? (
              <MapPicker
                lat={formData.lat}
                lng={formData.lng}
                onLocationSelect={handleLocationSelect}
                label="Car Location on Map"
                defaultCenter={[car.lat || 41.3275, car.lng || 19.8187]}
                defaultZoom={13}
                showCoordinates={true}
              />
            ) : (
              car.lat !== undefined &&
              car.lng !== undefined && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Location
                  </h2>
                  <MapPicker
                    lat={car.lat}
                    lng={car.lng}
                    onLocationSelect={() => {}}
                    label=""
                    defaultCenter={[car.lat, car.lng]}
                    defaultZoom={15}
                    showCoordinates={true}
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </Hsidebar>
  );
};

export default CarDetails;
