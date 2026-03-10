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
  Cookie,
  ChefHat,
  Toilet,
  Bath,
  Sofa,
  BedDouble,
  Building2,
} from "lucide-react";
import { getAllApartments } from "@/services/api/apartmentService";
import {
  getApartmentsByProviderId,
  deleteApartment,
} from "@/services/api/apartmentService";
import { Apartment, ApartmentFilters } from "@/types/apartment.type";
import Swal from "sweetalert2";
import { Room } from "@mui/icons-material";
import { User } from "@/types/user.types";
import { userService } from "@/services/api/userService";
import { AddApartmentDialog } from "./AddApartmentDialog";
import { useTranslation } from "react-i18next";

/* -------------------------------------------------------------------------- */
/*                                   Utils                                    */
/* -------------------------------------------------------------------------- */

const confirmDelete = async (t: any): Promise<boolean> => {
  const result = await Swal.fire({
    title: t("apartment.confirmDelete"),
    text: t("apartment.deleteWarning"),
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: t("apartment.confirmDeleteButton"),
  });

  if (result.isConfirmed) {
    await Swal.fire({
      title: t("apartment.deleteSuccess"),
      text: t("apartment.deleteSuccessMessage"),
      icon: "success",
    });
    return true;
  }

  return false;
};

/* -------------------------------------------------------------------------- */
/*                               Main Component                                */
/* -------------------------------------------------------------------------- */

const AllApartments = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [currentUser, setUser] = useState<User | null>(null);

  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<ApartmentFilters["status"]>("all");
  const [ratingFilter, setRatingFilter] = useState<"all" | "4+" | "4.5+">(
    "all",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 6;

  /* ------------------------------- Fetching -------------------------------- */

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await userService.getCurrentUser();
        if (!currentUser) {
          console.log("user not found");
          setUser(null);
          return;
        }
        setUser(currentUser);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const fetchApartments = async (user: User) => {
    try {
      setLoading(true);
      setError(null);

      if (user.role === "admin") {
        const data = await getAllApartments();
        setApartments(data);
      } else {
        const data = await getApartmentsByProviderId(user.id);
        setApartments(data);
      }
    } catch (err) {
      console.error(err);
      setError(t("apartment.loadFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser) return;
    fetchApartments(currentUser);
  }, [currentUser]);

  /* ------------------------------- Handlers -------------------------------- */

  const handleDelete = async (id: number) => {
    const confirmed = await confirmDelete(t);
    if (!confirmed) return;

    try {
      await deleteApartment(id);
      setApartments((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      console.error("Error deleting apartment:", err);
      Swal.fire({
        title: t("common.error", "Error"),
        text:
          err.message ||
          t(
            "apartment.deleteError",
            "Failed to delete apartment. Please try again.",
          ),
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleView = (id: number) => {
    navigate(`/dashboard/apartments/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/dashboard/apartments/${id}?edit=true`);
  };

  const handleApartmentAdded = (newApartment: Apartment) => {
    setApartments((prev) => [newApartment, ...prev]);
  };

  /* ------------------------------ Filtering -------------------------------- */

  const filteredApartments = useMemo(() => {
    return apartments.filter((a) => {
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
  }, [apartments, searchTerm, statusFilter, ratingFilter]);

  /* ------------------------------ Pagination -------------------------------- */

  const totalPages = Math.ceil(filteredApartments.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedApartments = filteredApartments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  /* ------------------------------ States UI -------------------------------- */

  if (loading) {
    return (
      <Hsidebar>
        <div className="-m-8 flex min-h-[calc(100vh)] items-center justify-center bg-[#0d0d0d]">
          <Loader2 size={40} className="animate-spin text-[#e41e20]" />
        </div>
      </Hsidebar>
    );
  }

  if (error) {
    return (
      <Hsidebar>
        <div className="-m-8 flex min-h-[calc(100vh)] flex-col items-center justify-center gap-4 bg-[#0d0d0d]">
          <p className="text-red-400 text-sm">{error}</p>
          <button
            onClick={() => currentUser && fetchApartments(currentUser)}
            className="px-4 py-2 bg-[#e41e20] text-white rounded-xl text-sm hover:bg-[#c91a1c] transition"
          >
            {t("apartment.retry")}
          </button>
        </div>
      </Hsidebar>
    );
  }

  /* ------------------------------- Render ---------------------------------- */

  return (
    <Hsidebar>
      <div className="-m-8 min-h-[calc(100vh)] bg-[#0d0d0d] text-white">
        {/* ── Header ── */}
        <div className="relative overflow-hidden border-b border-white/5 bg-[#111] px-6 py-8 md:px-10">
          <div className="pointer-events-none absolute -top-20 left-10 h-60 w-60 rounded-full bg-[#e41e20]/10 blur-3xl" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e41e20]/15 ring-1 ring-[#e41e20]/40">
                <Building2 className="h-4 w-4 text-[#e41e20]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  {t("apartment.allApartments")}
                </h1>
                <p className="text-sm text-white/40">
                  {t("apartment.manageApartments")}
                </p>
              </div>
            </div>
            <AddApartmentDialog onApartmentAdded={handleApartmentAdded} />
          </div>
        </div>

        <div className="px-6 py-6 md:px-10">
          {/* ── Filters ── */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <input
                className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-10 text-sm text-white placeholder:text-white/25 focus:border-[#e41e20]/50 focus:outline-none"
                placeholder={t("apartment.searchPlaceholder")}
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
              className="h-10 appearance-none rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white focus:border-[#e41e20]/50 focus:outline-none"
            >
              <option value="all" className="bg-[#1a1a1a]">
                {t("apartment.allStatuses")}
              </option>
              <option value="available" className="bg-[#1a1a1a]">
                {t("apartment.available")}
              </option>
              <option value="rented" className="bg-[#1a1a1a]">
                {t("apartment.rented")}
              </option>
              <option value="maintenance" className="bg-[#1a1a1a]">
                {t("apartment.maintenance")}
              </option>
            </select>
            <select
              value={ratingFilter}
              onChange={(e) => {
                setRatingFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="h-10 appearance-none rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white focus:border-[#e41e20]/50 focus:outline-none"
            >
              <option value="all" className="bg-[#1a1a1a]">
                {t("apartment.allRatings")}
              </option>
              <option value="4.5+" className="bg-[#1a1a1a]">
                {t("apartment.rating4_5")}
              </option>
              <option value="4+" className="bg-[#1a1a1a]">
                {t("apartment.rating4")}
              </option>
            </select>
          </div>

          {/* ── Grid ── */}
          {filteredApartments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                <Building2 className="h-7 w-7 text-white/20" />
              </div>
              <p className="text-sm font-medium text-white/50">
                {t("apartment.noApartmentsFound")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedApartments.map((a) => (
                <ApartmentCard
                  key={a.id}
                  apartment={a}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/50 transition hover:bg-white/[0.08] disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`h-9 w-9 rounded-xl text-sm font-medium transition ${
                    currentPage === i + 1
                      ? "bg-[#e41e20] text-white"
                      : "border border-white/10 bg-white/[0.04] text-white/50 hover:bg-white/[0.08]"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/50 transition hover:bg-white/[0.08] disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </Hsidebar>
  );
};

/* -------------------------------------------------------------------------- */
/*                              Card Component                                 */
/* -------------------------------------------------------------------------- */

interface CardProps {
  apartment: Apartment;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const ApartmentCard: React.FC<CardProps> = ({
  apartment,
  onView,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();

  const statusCls =
    apartment.status === "available"
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      : apartment.status === "rented"
        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
        : "bg-red-500/10 text-red-400 border-red-500/20";

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] overflow-hidden transition-colors hover:border-white/10 hover:bg-white/[0.04]">
      {/* Image */}
      <div
        className="relative h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${apartment.imageUrls[0]})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${statusCls}`}
          >
            {apartment.status}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="text-base font-bold text-white truncate">
          {apartment.name}
        </h3>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-white/40">
          <MapPin className="h-3.5 w-3.5" />
          {apartment.address ?? t("apartment.noAddress")}
        </div>

        {/* Stats grid */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2">
            <Star className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs text-white/70">{apartment.rating}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2">
            <Bed className="h-3.5 w-3.5 text-white/30" />
            <span className="text-xs text-white/70">
              {t("apartment.roomsCount", { count: apartment.rooms })}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2">
            <BedDouble className="h-3.5 w-3.5 text-white/30" />
            <span className="text-xs text-white/70">
              {t("apartment.bedCount", { count: apartment.beds })}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2">
            <ChefHat className="h-3.5 w-3.5 text-white/30" />
            <span className="text-xs text-white/70">
              {t("apartment.kitchenCount", { count: apartment.kitchens })}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2">
            <Bath className="h-3.5 w-3.5 text-white/30" />
            <span className="text-xs text-white/70">
              {t("apartment.bathroomCount", { count: apartment.bathrooms })}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2">
            <Sofa className="h-3.5 w-3.5 text-white/30" />
            <span className="text-xs text-white/70">
              {t("apartment.livingRoomCount", { count: apartment.livingRooms })}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-center gap-1">
          <DollarSign className="h-4 w-4 text-[#e41e20]" />
          <span className="text-xl font-bold text-white">
            {apartment.price}
          </span>
          <span className="text-xs text-white/35">{t("apartment.perDay")}</span>
        </div>

        {/* Amenities */}
        {apartment.amenities && apartment.amenities.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {apartment.amenities.map((amenity, i) => (
              <span
                key={i}
                className="rounded-full border border-white/10 bg-white/[0.06] px-2 py-0.5 text-[10px] text-white/50"
              >
                {amenity}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-xs text-white/25">
            {t("apartment.noAmenities")}
          </p>
        )}

        {/* Actions */}
        <div className="mt-4 flex gap-2 border-t border-white/5 pt-4">
          <button
            onClick={() => onView(apartment.id)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] py-2 text-xs font-medium text-white/70 transition hover:bg-white/[0.08]"
          >
            <Eye size={14} /> {t("apartment.view")}
          </button>
          <button
            onClick={() => onEdit(apartment.id)}
            className="flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] p-2 text-white/50 transition hover:bg-white/[0.08]"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={() => onDelete(apartment.id)}
            className="flex items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-red-400 transition hover:bg-red-500/20"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllApartments;
