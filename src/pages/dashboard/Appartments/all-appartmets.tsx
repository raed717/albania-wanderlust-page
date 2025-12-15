import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Hsidebar from "../../../components/dashboard/hsidebar";
import {
  Search,
  Filter,
  MapPin,
  Star,
  Bed,
  DollarSign,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { getAllAppartments } from "@/services/api/appartmentService";
import { Appartment, AppartmentFilters } from "@/types/appartment.type";
import Swal from "sweetalert2";

/* -------------------------------------------------------------------------- */
/*                                   Utils                                    */
/* -------------------------------------------------------------------------- */

const confirmDelete = async (): Promise<boolean> => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    await Swal.fire({
      title: "Deleted!",
      text: "Your apartment has been deleted.",
      icon: "success",
    });
    return true;
  }

  return false;
};

/* -------------------------------------------------------------------------- */
/*                               Main Component                                */
/* -------------------------------------------------------------------------- */

const AllAppartments = () => {
  const navigate = useNavigate();

  const [appartments, setAppartments] = useState<Appartment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<AppartmentFilters["status"]>("all");
  const [ratingFilter, setRatingFilter] = useState<"all" | "4+" | "4.5+">(
    "all"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 6;

  /* ------------------------------- Fetching -------------------------------- */

  const fetchAppartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllAppartments();
      setAppartments(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load apartments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppartments();
  }, []);

  /* ------------------------------- Handlers -------------------------------- */

  const handleDelete = async (id: number) => {
    const confirmed = await confirmDelete();
    if (!confirmed) return;

    setAppartments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleView = (id: number) => {
    navigate(`/dashboard/appartments/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/dashboard/appartments/${id}?edit=true`);
  };

  /* ------------------------------ Filtering -------------------------------- */

  const filteredAppartments = useMemo(() => {
    return appartments.filter((a) => {
      const matchesSearch =
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.address ?? "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || a.status === statusFilter;

      const matchesRating =
        ratingFilter === "all" ||
        (ratingFilter === "4+" && a.rating >= 4) ||
        (ratingFilter === "4.5+" && a.rating >= 4.5);

      return matchesSearch && matchesStatus && matchesRating;
    });
  }, [appartments, searchTerm, statusFilter, ratingFilter]);

  /* ------------------------------ Pagination -------------------------------- */

  const totalPages = Math.ceil(filteredAppartments.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedAppartments = filteredAppartments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* ------------------------------ States UI -------------------------------- */

  if (loading) {
    return (
      <Hsidebar>
        <div className="flex justify-center items-center h-96">
          <Loader2 size={48} className="animate-spin text-blue-600" />
        </div>
      </Hsidebar>
    );
  }

  if (error) {
    return (
      <Hsidebar>
        <div className="text-center py-20">
          <p className="text-red-500">{error}</p>
          <button
            onClick={fetchAppartments}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </Hsidebar>
    );
  }

  /* ------------------------------- Render ---------------------------------- */

  return (
    <Hsidebar>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">All Appartments</h1>
          <p className="text-gray-500">
            Manage and monitor all your apartment listings
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              className="w-full pl-10 py-2.5 border rounded-lg"
              placeholder="Search by name or address..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="px-4 py-2.5 border rounded-lg"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="rented">Rented</option>
            <option value="maintenance">Maintenance</option>
          </select>

          <select
            value={ratingFilter}
            onChange={(e) => {
              setRatingFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="px-4 py-2.5 border rounded-lg"
          >
            <option value="all">All Ratings</option>
            <option value="4.5+">4.5+</option>
            <option value="4+">4+</option>
          </select>
        </div>

        {/* Grid */}
        {filteredAppartments.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl">
            <p className="text-gray-500">No apartments found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {paginatedAppartments.map((a) => (
              <AppartmentCard
                key={a.id}
                appartment={a}
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
              className="px-4 py-2 border rounded-lg"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-lg ${
                  currentPage === i + 1 ? "bg-blue-600 text-white" : "border"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-2 border rounded-lg"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </Hsidebar>
  );
};

/* -------------------------------------------------------------------------- */
/*                              Card Component                                 */
/* -------------------------------------------------------------------------- */

interface CardProps {
  appartment: Appartment;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const AppartmentCard: React.FC<CardProps> = ({
  appartment,
  onView,
  onEdit,
  onDelete,
}) => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden border hover:shadow-xl transition">
    <div
      className="h-52 bg-cover bg-center"
      style={{ backgroundImage: `url(${appartment.image})` }}
    />
    <div className="absolute top-3 right-3"></div>
    <div className="p-5">
      <span
        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
          appartment.status === "available"
            ? "bg-emerald-500 text-white"
            : "bg-amber-500 text-white"
        }`}
      >
        {appartment.status}
      </span>
      <h3 className="text-xl font-bold">{appartment.name}</h3>

      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <MapPin size={16} />
        {appartment.address ?? "No address"}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Star size={16} className="text-amber-400" />
          {appartment.rating}
        </div>
        <div className="flex items-center gap-2">
          <Bed size={16} />
          {appartment.rooms} rooms
        </div>
        <div className="flex items-center gap-2 col-span-2">
          <DollarSign size={16} />
          <strong>${appartment.pricePerDay}</strong>/day
        </div>
      </div>

      <div className="flex gap-2 pt-3 border-t">
        <button
          onClick={() => onView(appartment.id)}
          className="flex-1 py-2 px-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <Eye size={16} /> View
        </button>
        <button
          onClick={() => onEdit(appartment.id)}
          className="p-2 bg-gray-50 rounded-lg"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={() => onDelete(appartment.id)}
          className="p-2 bg-red-50 text-red-500 rounded-lg"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  </div>
);

export default AllAppartments;
