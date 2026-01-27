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
  Bed,
  DollarSign,
  Mail,
  Phone,
  Home,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { Appartment, UpdateAppartmentDto } from "@/types/appartment.type";
import {
  getAppartmentById,
  updateAppartment,
} from "@/services/api/appartmentService";
import { MapPicker } from "@/components/dashboard/mapPicker";
import { ImageUpload } from "@/components/dashboard/ImageUpload";
import { AvailabilityCalendar } from "@/components/dashboard/AvailabilityCalendar";
import Swal from "sweetalert2";

const AppartmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editMode = searchParams.get("edit") === "true";

  const [appartment, setAppartment] = useState<Appartment | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(editMode);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<UpdateAppartmentDto>({});
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);

  /* -------------------------------------------------------------------------- */
  /*                                   Fetch                                    */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const fetchAppartment = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const data = await getAppartmentById(Number(id));
        setAppartment(data);
        setFormData(data ?? {});
        setNewImageFiles([]);
      } catch (error) {
        console.error("Error fetching appartment:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppartment();
  }, [id]);

  /* -------------------------------------------------------------------------- */
  /*                                  Handlers                                  */
  /* -------------------------------------------------------------------------- */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "rating" || name === "rooms" || name === "price"
          ? Number(value)
          : value,
    }));
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData((prev) => ({ ...prev, lat, lng }));
  };

  const handleSave = async () => {
    if (!id) return;

    setSaving(true);
    try {
      const updated = await updateAppartment(
        Number(id),
        formData,
        newImageFiles.length > 0 ? newImageFiles : undefined,
      );
      setAppartment(updated);
      setFormData(updated);
      setNewImageFiles([]);
      setIsEditing(false);

      Swal.fire({
        icon: "success",
        title: "Updated",
        text: "Apartment updated successfully!",
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update apartment.",
      });
    } finally {
      setSaving(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                   States                                   */
  /* -------------------------------------------------------------------------- */

  if (loading) {
    return (
      <Hsidebar>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
      </Hsidebar>
    );
  }

  if (!appartment) {
    return (
      <Hsidebar>
        <div className="text-center py-20">
          <h3 className="text-2xl font-bold">Apartment Not Found</h3>
          <Button onClick={() => navigate("/dashboard/AppartmentsList")}>
            <ArrowLeft className="mr-2" size={16} />
            Back
          </Button>
        </div>
      </Hsidebar>
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <Hsidebar>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard/AppartmentsList")}
              className="mb-4 -ml-4"
            >
              <ArrowLeft className="mr-2" size={16} />
              Back to Appartments
            </Button>

            <h1 className="text-3xl font-bold">
              {isEditing ? "Edit Apartment" : "Apartment Details"}
            </h1>
            <p className="text-gray-500 mt-1">
              {isEditing
                ? "Update apartment information"
                : "View complete apartment details"}
            </p>
          </div>

          <div className="flex gap-3">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="mr-2" size={16} />
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" size={16} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2" size={16} />
                      Save
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="mr-2" size={16} />
                Edit Apartment
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left */}
          <div>
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 mb-6">
              {isEditing ? (
                <div className="p-4">
                  <ImageUpload
                    onImagesSelected={(files) => {
                      setNewImageFiles((prev) => [...prev, ...files]);
                    }}
                    selectedFiles={newImageFiles}
                    onRemoveFile={(index) => {
                      setNewImageFiles((prev) =>
                        prev.filter((_, i) => i !== index),
                      );
                    }}
                    existingImages={formData.imageUrls}
                    onRemoveExisting={(url) => {
                      setFormData((prev) => ({
                        ...prev,
                        imageUrls: prev.imageUrls?.filter((img) => img !== url),
                      }));
                    }}
                    maxImages={10}
                    isLoading={saving}
                  />
                </div>
              ) : (
                <div className="relative">
                  {/* Main Image */}
                  {appartment.imageUrls && appartment.imageUrls.length > 0 ? (
                    <div className="grid grid-cols-4 grid-rows-2 gap-1 h-[300px]">
                      {/* First large image */}
                      <div
                        className={`bg-cover bg-center cursor-pointer relative group ${
                          appartment.imageUrls.length === 1
                            ? "col-span-4 row-span-2"
                            : "col-span-2 row-span-2"
                        }`}
                        style={{
                          backgroundImage: `url(${appartment.imageUrls[0]})`,
                        }}
                      >
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                      </div>

                      {/* Other images grid */}
                      {appartment.imageUrls.slice(1, 5).map((url, idx) => (
                        <div
                          key={idx}
                          className="bg-cover bg-center col-span-1 row-span-1 relative group"
                          style={{
                            backgroundImage: `url(${url})`,
                          }}
                        >
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                        </div>
                      ))}

                      {/* "See all" overlay if more than 5 images */}
                      {appartment.imageUrls.length > 5 && (
                        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                          +{appartment.imageUrls.length - 5} photos
                        </div>
                      )}
                    </div>
                  ) : appartment.imageUrls[0] ? (
                    <div className="h-64 bg-cover bg-center" />
                  ) : (
                    <div className="h-64 bg-gray-100 flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No images available</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl">
              <Label>Status</Label>
              {isEditing ? (
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full mt-2 border rounded-md px-3 py-2"
                >
                  <option value="available">Available</option>
                  <option value="rented">Rented</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              ) : (
                <span className="inline-block mt-2 px-4 py-2 rounded-full bg-blue-600 text-white">
                  {appartment.status}
                </span>
              )}
            </div>

            {/* Availability Calendar */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <AvailabilityCalendar
                propertyId={Number(id)}
                propertyType="apartment"
              />
            </div>
          </div>

          {/* Right */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-6">Basic Information</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>
                    <Home size={16} /> Name
                  </Label>
                  {isEditing ? (
                    <Input
                      name="name"
                      value={formData.name || ""}
                      onChange={handleChange}
                    />
                  ) : (
                    <p>{appartment.name}</p>
                  )}
                </div>

                <div>
                  <Label>
                    <MapPin size={16} /> Address
                  </Label>
                  {isEditing ? (
                    <Input
                      name="address"
                      value={formData.address || ""}
                      onChange={handleChange}
                    />
                  ) : (
                    <p>{appartment.address}</p>
                  )}
                </div>

                <div>
                  <Label>
                    <Star size={16} /> Rating
                  </Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      step="0.1"
                      name="rating"
                      value={formData.rating || 0}
                      onChange={handleChange}
                    />
                  ) : (
                    <p>{appartment.rating}</p>
                  )}
                </div>

                <div>
                  <Label>
                    <DollarSign size={16} /> Price / Day
                  </Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      name="price"
                      value={formData.price || 0}
                      onChange={handleChange}
                    />
                  ) : (
                    <p>${appartment.price}</p>
                  )}
                </div>

                <div>
                  <Label>
                    <Bed size={16} /> Rooms
                  </Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      name="rooms"
                      value={formData.rooms || 0}
                      onChange={handleChange}
                    />
                  ) : (
                    <p>{appartment.rooms}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-6">Contact</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>
                    <Mail size={16} /> Email
                  </Label>
                  {isEditing ? (
                    <Input
                      name="contactEmail"
                      value={formData.contactEmail || ""}
                      onChange={handleChange}
                    />
                  ) : (
                    <p>{appartment.contactEmail || "N/A"}</p>
                  )}
                </div>

                <div>
                  <Label>
                    <Phone size={16} /> Phone
                  </Label>
                  {isEditing ? (
                    <Input
                      name="contactPhone"
                      value={formData.contactPhone || ""}
                      onChange={handleChange}
                    />
                  ) : (
                    <p>{appartment.contactPhone || "N/A"}</p>
                  )}
                </div>
              </div>
            </div>

            <MapPicker
              lat={formData.lat}
              lng={formData.lng}
              onLocationSelect={handleLocationSelect}
              label="Apartment Location"
              defaultCenter={[appartment.lat || 40.7, appartment.lng || -73.9]}
              showCoordinates
            />

            <div className="bg-white p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-4">Description</h2>
              {isEditing ? (
                <textarea
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border rounded-md p-3"
                />
              ) : (
                <p>{appartment.description || "No description available."}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Hsidebar>
  );
};

export default AppartmentDetails;
