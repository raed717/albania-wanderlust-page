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
import { useTranslation } from "react-i18next";

const AppartmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editMode = searchParams.get("edit") === "true";
  const { t } = useTranslation();

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
        title: t("apartment.save"),
        text: t("apartment.updateSuccess"),
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: t("common.error"),
        text: t("apartment.updateFailed"),
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
          <h3 className="text-2xl font-bold">
            {t("apartment.apartmentNotFound")}
          </h3>
          <Button onClick={() => navigate("/dashboard/AppartmentsList")}>
            <ArrowLeft className="mr-2" size={16} />
            {t("apartment.backToApartments")}
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
              {t("apartment.backToApartments")}
            </Button>

            <h1 className="text-3xl font-bold">
              {isEditing
                ? t("apartment.editApartment")
                : t("apartment.apartmentDetails")}
            </h1>
            <p className="text-gray-500 mt-1">
              {isEditing
                ? t("apartment.updateInfo")
                : t("apartment.viewDetails")}
            </p>
          </div>

          <div className="flex gap-3">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="mr-2" size={16} />
                  {t("apartment.cancel")}
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" size={16} />
                      {t("apartment.saving")}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2" size={16} />
                      {t("apartment.save")}
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="mr-2" size={16} />
                {t("apartment.editApartment")}
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
                        <p>{t("apartment.noImages")}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl">
              <Label>{t("apartment.status")}</Label>
              {isEditing ? (
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full mt-2 border rounded-md px-3 py-2"
                >
                  <option value="available">{t("apartment.available")}</option>
                  <option value="rented">{t("apartment.rented")}</option>
                  <option value="maintenance">
                    {t("apartment.maintenance")}
                  </option>
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
              <h2 className="text-xl font-bold mb-6">
                {t("apartment.basicInformation")}
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>
                    <Home size={16} /> {t("apartment.name")}
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
                    <MapPin size={16} /> {t("apartment.address")}
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
                    <Star size={16} /> {t("apartment.rating")}
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
                    <DollarSign size={16} /> {t("apartment.pricePerDay")}
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
                    <Bed size={16} /> {t("apartment.rooms")}
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
              <h2 className="text-xl font-bold mb-6">
                {t("apartment.contact")}
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>
                    <Mail size={16} /> {t("apartment.email")}
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
                    <Phone size={16} /> {t("apartment.phone")}
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
              label={t("apartment.apartmentLocation")}
              defaultCenter={[appartment.lat || 40.7, appartment.lng || -73.9]}
              showCoordinates
            />

            <div className="bg-white p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-4">
                {t("apartment.description")}
              </h2>
              {isEditing ? (
                <textarea
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border rounded-md p-3"
                />
              ) : (
                <p>{appartment.description || t("apartment.noDescription")}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Hsidebar>
  );
};

export default AppartmentDetails;
