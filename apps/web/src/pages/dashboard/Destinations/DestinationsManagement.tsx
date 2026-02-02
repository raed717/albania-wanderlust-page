import React, { useState, useEffect } from "react";
import Hsidebar from "../../../components/dashboard/hsidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Search,
  Filter,
  MapPin,
  Edit,
  Trash2,
  Eye,
  Loader2,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Destination, DestinationDto } from "@/types/destination.types";
// Import destination service functions with string ID parameters
import {
  getAllDestinations,
  createDestination,
  updateDestination,
  deleteDestination,
} from "@/services/api/destinationService";
import { MapPicker } from "@/components/dashboard/mapPicker";
import { ImageUpload } from "@/components/dashboard/ImageUpload";
import Swal from "sweetalert2";
import {
  uploadImages,
  type StorageEntityType,
} from "@/services/api/storageService";

/* ============================== Types ============================== */

interface DestinationFormData {
  name: string;
  description: string;
  category: string;
  lat?: number;
  lng?: number;
  imageUrls: string[];
}

/* ============================== Constants ============================== */

const CATEGORIES = [
  { id: "Adventure", label: "Adventure" },
  { id: "Historic", label: "Historic" },
  { id: "Beach", label: "Beach" },
  { id: "Cultural", label: "Cultural" },
  { id: "Nature", label: "Nature" },
  { id: "City", label: "City" },
];

const ITEMS_PER_PAGE = 12;

/* ============================== Main Component ============================== */

export default function DestinationsManagement() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search and filter
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">(
    "create",
  );
  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);

  // Form states
  const [formData, setFormData] = useState<DestinationFormData>({
    name: "",
    description: "",
    category: "",
    lat: undefined,
    lng: undefined,
    imageUrls: [],
  });
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);

  /* ============================== Effects ============================== */

  useEffect(() => {
    fetchDestinations();
  }, []);

  /* ============================== Handlers ============================== */

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const data = await getAllDestinations();
      setDestinations(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching destinations:", err);
      setError("Failed to load destinations");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setDialogMode("create");
    setSelectedDestination(null);
    setFormData({
      name: "",
      description: "",
      category: "",
      lat: undefined,
      lng: undefined,
      imageUrls: [],
    });
    setSelectedImageFiles([]);
    setDialogOpen(true);
  };

  const handleEdit = (destination: Destination) => {
    setDialogMode("edit");
    setSelectedDestination(destination);
    setFormData({
      name: destination.name,
      description: destination.description,
      category: destination.category,
      lat: destination.lat,
      lng: destination.lng,
      imageUrls: destination.imageUrls || [],
    });
    setSelectedImageFiles([]);
    setDialogOpen(true);
  };

  const handleView = (destination: Destination) => {
    setDialogMode("view");
    setSelectedDestination(destination);
    setFormData({
      name: destination.name,
      description: destination.description,
      category: destination.category,
      lat: destination.lat,
      lng: destination.lng,
      imageUrls: destination.imageUrls || [],
    });
    setDialogOpen(true);
  };

  const handleDelete = async (destination: Destination) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete destination "${destination.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteDestination(destination.id);
        setDestinations((prev) => prev.filter((d) => d.id !== destination.id));
        Swal.fire("Deleted!", "Destination has been deleted.", "success");
      } catch (err) {
        console.error("Error deleting destination:", err);
        Swal.fire("Error", "Failed to delete destination", "error");
      }
    }
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData((prev) => ({ ...prev, lat, lng }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // Validation
    if (!formData.name || !formData.category) {
      Swal.fire("Error", "Please fill in all required fields", "error");
      return;
    }

    if (dialogMode === "create" && selectedImageFiles.length === 0) {
      Swal.fire("Error", "Please upload at least one image", "error");
      return;
    }

    if (!formData.lat || !formData.lng) {
      Swal.fire("Error", "Please select a location on the map", "error");
      return;
    }

    setSaving(true);
    try {
      let {imageUrls} = formData;

      // Upload new images if any
      if (selectedImageFiles.length > 0) {
        const uploadResults = await uploadImages(
          selectedImageFiles,
          "destination" as StorageEntityType,
        );
        const newImageUrls = uploadResults.map((result) => result.publicUrl);
        imageUrls = [...imageUrls, ...newImageUrls];
      }

      const destinationData: DestinationDto = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        lat: formData.lat,
        lng: formData.lng,
        imageUrls,
      };

      if (dialogMode === "create") {
        const newDestination = await createDestination(destinationData);
        setDestinations((prev) => [newDestination, ...prev]);
        Swal.fire("Success!", "Destination created successfully", "success");
      } else if (dialogMode === "edit" && selectedDestination) {
        const updated = await updateDestination(
          selectedDestination.id,
          destinationData,
        );
        setDestinations((prev) =>
          prev.map((d) => (d.id === selectedDestination.id ? updated : d)),
        );
        Swal.fire("Success!", "Destination updated successfully", "success");
      }

      setDialogOpen(false);
      setSelectedImageFiles([]);
    } catch (err) {
      console.error("Error saving destination:", err);
      Swal.fire("Error", "Failed to save destination", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ============================== Filtering & Pagination ============================== */

  const filteredDestinations = destinations.filter((destination) => {
    const matchesSearch =
      destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destination.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || destination.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredDestinations.length / ITEMS_PER_PAGE);
  const paginatedDestinations = filteredDestinations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  /* ============================== Render ============================== */

  if (loading) {
    return (
      <Hsidebar>
        <div className="flex justify-center items-center h-96">
          <Loader2 size={48} className="animate-spin text-blue-600" />
        </div>
      </Hsidebar>
    );
  }

  return (
    <Hsidebar>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Destinations Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage tourist destinations across Albania
            </p>
          </div>
          <Button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus size={20} className="mr-2" />
            Add Destination
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-xl shadow">
            <span className="text-sm text-gray-500">Total Destinations</span>
            <span className="text-2xl font-bold text-blue-600 block">
              {destinations.length}
            </span>
          </div>
          <div className="p-4 bg-white rounded-xl shadow">
            <span className="text-sm text-gray-500">Adventure</span>
            <span className="text-2xl font-bold text-green-600 block">
              {destinations.filter((d) => d.category === "Adventure").length}
            </span>
          </div>
          <div className="p-4 bg-white rounded-xl shadow">
            <span className="text-sm text-gray-500">Historic</span>
            <span className="text-2xl font-bold text-purple-600 block">
              {destinations.filter((d) => d.category === "Historic").length}
            </span>
          </div>
          <div className="p-4 bg-white rounded-xl shadow">
            <span className="text-sm text-gray-500">Beach</span>
            <span className="text-2xl font-bold text-orange-600 block">
              {destinations.filter((d) => d.category === "Beach").length}
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 bg-white rounded-lg shadow flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search destinations..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-500" />
            <select
              className="px-3 py-2 border rounded-lg"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        {filteredDestinations.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl">
            <p className="text-gray-500">No destinations found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {paginatedDestinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-3 mt-10">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg ${
                  page === currentPage
                    ? "bg-blue-600 text-white"
                    : "border hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Dialog for Create/Edit/View */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "create" && "Add New Destination"}
              {dialogMode === "edit" && "Edit Destination"}
              {dialogMode === "view" && "View Destination"}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "create" &&
                "Fill in the details to add a new tourist destination"}
              {dialogMode === "edit" && "Update the destination information"}
              {dialogMode === "view" && "Destination details"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Destination Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Berat Castle"
                disabled={dialogMode === "view"}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-red-500">*</span>
              </Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                disabled={dialogMode === "view"}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe the destination..."
                disabled={dialogMode === "view"}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            {/* Image Upload */}
            {dialogMode !== "view" && (
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
                existingImages={formData.imageUrls}
                onRemoveExisting={(url) => {
                  setFormData((prev) => ({
                    ...prev,
                    imageUrls: prev.imageUrls.filter((img) => img !== url),
                  }));
                }}
                maxImages={10}
                isLoading={saving}
              />
            )}

            {/* Image Preview for View Mode */}
            {dialogMode === "view" && formData.imageUrls.length > 0 && (
              <div className="space-y-2">
                <Label>Images</Label>
                <div className="grid grid-cols-3 gap-3">
                  {formData.imageUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Destination ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Map Picker */}
            <div className="space-y-2">
              <Label>
                Location on Map <span className="text-red-500">*</span>
              </Label>
              <MapPicker
                lat={formData.lat}
                lng={formData.lng}
                onLocationSelect={handleLocationSelect}
                label={
                  dialogMode === "view"
                    ? "Destination Location"
                    : "Select destination location on the map"
                }
                defaultCenter={[41.3275, 19.8187]}
                defaultZoom={8}
                showCoordinates={true}
              />
            </div>
          </div>

          <DialogFooter>
            {dialogMode !== "view" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>{dialogMode === "create" ? "Create" : "Update"}</>
                  )}
                </Button>
              </>
            )}
            {dialogMode === "view" && (
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Hsidebar>
  );
}

/* ============================== Card Component ============================== */

interface DestinationCardProps {
  destination: Destination;
  onView: (destination: Destination) => void;
  onEdit: (destination: Destination) => void;
  onDelete: (destination: Destination) => void;
}

function DestinationCard({
  destination,
  onView,
  onEdit,
  onDelete,
}: DestinationCardProps) {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Adventure: "bg-green-100 text-green-800",
      Historic: "bg-purple-100 text-purple-800",
      Beach: "bg-blue-100 text-blue-800",
      Cultural: "bg-pink-100 text-pink-800",
      Nature: "bg-emerald-100 text-emerald-800",
      City: "bg-orange-100 text-orange-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden">
      {/* Image */}
      <div className="h-48 bg-gray-200 relative overflow-hidden">
        {destination.imageUrls && destination.imageUrls.length > 0 ? (
          <img
            src={destination.imageUrls[0]}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
            <MapPin size={48} className="text-gray-500" />
          </div>
        )}
        <div
          className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
            destination.category,
          )}`}
        >
          {destination.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
          {destination.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {destination.description}
        </p>

        {destination.lat && destination.lng && (
          <div className="flex items-center text-xs text-gray-500 mb-3">
            <MapPin size={14} className="mr-1" />
            <span>
              {destination.lat.toFixed(4)}, {destination.lng.toFixed(4)}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onView(destination)}
            className="flex-1"
          >
            <Eye size={16} className="mr-1" />
            View
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(destination)}
            className="flex-1"
          >
            <Edit size={16} className="mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(destination)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
