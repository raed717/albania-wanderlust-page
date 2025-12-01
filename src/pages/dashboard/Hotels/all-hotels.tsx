import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Hsidebar from "../../../components/dashboard/hsidebar";
import {
  Search,
  Filter,
  MapPin,
  Star,
  Users,
  Bed,
  DollarSign,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AddHotelDialog } from "./components/AddHotelDialog";

// NOTE: In a real app, you would import Swal from 'sweetalert2'
// For this standalone demo, we will use a simple window.confirm to avoid dependency errors in the preview
const confirmDelete = (hotelId) => {
  if (window.confirm("Are you sure? You won't be able to revert this!")) {
    alert("Deleted! The hotel has been deleted.");
    return true;
  }
  return false;
};

// --- Data ---
const hotelsData = [
  {
    id: 1,
    name: "Grand Plaza Hotel",
    location: "New York, USA",
    rating: 4.8,
    rooms: 150,
    occupancy: 85,
    price: 299,
    status: "active",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
  },
  {
    id: 2,
    name: "Ocean View Resort",
    location: "Miami, USA",
    rating: 4.6,
    rooms: 200,
    occupancy: 92,
    price: 399,
    status: "active",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400",
  },
  {
    id: 3,
    name: "Mountain Lodge",
    location: "Aspen, USA",
    rating: 4.9,
    rooms: 80,
    occupancy: 78,
    price: 450,
    status: "active",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400",
  },
  {
    id: 4,
    name: "City Center Inn",
    location: "Chicago, USA",
    rating: 4.3,
    rooms: 120,
    occupancy: 65,
    price: 189,
    status: "active",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400",
  },
  {
    id: 5,
    name: "Sunset Beach Hotel",
    location: "Los Angeles, USA",
    rating: 4.7,
    rooms: 180,
    occupancy: 88,
    price: 349,
    status: "active",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400",
  },
  {
    id: 6,
    name: "Desert Oasis Resort",
    location: "Phoenix, USA",
    rating: 4.5,
    rooms: 95,
    occupancy: 72,
    price: 279,
    status: "maintenance",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400",
  },
  {
    id: 7,
    name: "Historic Manor Hotel",
    location: "Boston, USA",
    rating: 4.4,
    rooms: 75,
    occupancy: 80,
    price: 320,
    status: "active",
    image: "https://images.unsplash.com/photo-1549294413-26f195200c16?w=400",
  },
  {
    id: 8,
    name: "Lakeside Retreat",
    location: "Seattle, USA",
    rating: 4.8,
    rooms: 110,
    occupancy: 90,
    price: 380,
    status: "active",
    image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400",
  },
  {
    id: 9,
    name: "Downtown Suites",
    location: "San Francisco, USA",
    rating: 4.2,
    rooms: 140,
    occupancy: 70,
    price: 420,
    status: "active",
    image: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=400",
  },
];

const AllHotels = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // NOTE: Assuming delete might update state in real app
  const [hotels, setHotels] = useState(hotelsData);

  const itemsPerPage = 6;

  // --- Handlers for Inputs (THE FIX) ---
  // When filters change, we MUST reset the current page to 1
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset pagination
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset pagination
  };

  const handleRatingChange = (e) => {
    setRatingFilter(e.target.value);
    setCurrentPage(1); // Reset pagination
  };

  const handleDelete = (id) => {
    if (confirmDelete(id)) {
      setHotels((prev) => prev.filter((h) => h.id !== id));
    }
  };

  const handleHotelAdded = (newHotel) => {
    setHotels((prev) => [newHotel, ...prev]);
  };

  const handleViewHotel = (id) => {
    navigate(`/dashboard/hotels/${id}`);
  };

  const handleEditHotel = (id) => {
    navigate(`/dashboard/hotels/${id}?edit=true`);
  };

  // --- Logic ---
  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      const matchesSearch =
        hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || hotel.status === statusFilter;
      const matchesRating =
        ratingFilter === "all" ||
        (ratingFilter === "4+" && hotel.rating >= 4) ||
        (ratingFilter === "4.5+" && hotel.rating >= 4.5);

      return matchesSearch && matchesStatus && matchesRating;
    });
  }, [searchTerm, statusFilter, ratingFilter, hotels]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);

  // Safety check: if current page is greater than total pages (after deletion), go back
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHotels = filteredHotels.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <Hsidebar>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">All Hotels</h1>
            <p className="text-gray-500 text-lg">
              Manage and monitor all your hotel properties
            </p>
          </div>
          <AddHotelDialog onHotelAdded={handleHotelAdded} />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard
            label="Total Hotels"
            value={hotels.length}
            gradient="from-blue-500 to-indigo-600"
          />
          <StatCard
            label="Total Rooms"
            value={hotels.reduce((sum, hotel) => sum + hotel.rooms, 0)}
            gradient="from-fuchsia-400 to-pink-500"
          />
          <StatCard
            label="Avg Occupancy"
            value={`${(hotels.reduce((sum, hotel) => sum + hotel.occupancy, 0) / (hotels.length || 1)).toFixed(0)}%`}
            gradient="from-sky-400 to-cyan-500"
          />
          <StatCard
            label="Avg Rating"
            value={(
              hotels.reduce((sum, hotel) => sum + hotel.rating, 0) /
              (hotels.length || 1)
            ).toFixed(1)}
            gradient="from-emerald-400 to-teal-400"
          />
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search hotels by name or location..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              {/* Status Filter */}
              <div className="relative flex-1 md:flex-none">
                <Filter
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <select
                  value={statusFilter}
                  onChange={handleStatusChange}
                  className="w-full md:w-48 pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              {/* Rating Filter */}
              <div className="flex-1 md:flex-none">
                <select
                  value={ratingFilter}
                  onChange={handleRatingChange}
                  className="w-full md:w-40 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                >
                  <option value="all">All Ratings</option>
                  <option value="4.5+">4.5+ Stars</option>
                  <option value="4+">4+ Stars</option>
                </select>
              </div>
            </div>

            <div className="text-sm text-gray-500 whitespace-nowrap hidden lg:block">
              {filteredHotels.length} results
            </div>
          </div>
        </div>

        {/* Hotels Grid */}
        {filteredHotels.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
            <div className="text-gray-300 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No hotels found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {paginatedHotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                onDelete={handleDelete}
                onView={handleViewHotel}
                onEdit={handleEditHotel}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm"
                }`}
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${currentPage === page
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                      }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm"
                }`}
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </Hsidebar>
  );
};

// --- Subcomponents for cleaner code ---

const StatCard = ({ label, value, gradient }) => (
  <div
    className={`p-6 rounded-2xl text-white bg-gradient-to-br ${gradient} shadow-lg`}
  >
    <div className="text-sm font-medium opacity-90 mb-2">{label}</div>
    <div className="text-3xl font-bold">{value}</div>
  </div>
);

const HotelCard = ({ hotel, onDelete, onView, onEdit }) => (
  <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
    {/* Image */}
    <div
      className="h-52 bg-cover bg-center relative group-hover:scale-105 transition-transform duration-500"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.3)), url(${hotel.image})`,
      }}
    >
      <div className="absolute top-3 right-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${hotel.status === "active"
              ? "bg-emerald-500 text-white"
              : "bg-amber-500 text-white"
            }`}
        >
          {hotel.status}
        </span>
      </div>
    </div>

    {/* Content */}
    <div className="p-5 relative bg-white">
      <h3 className="text-xl font-bold text-gray-900 mb-2">{hotel.name}</h3>

      <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
        <MapPin size={16} className="text-blue-500" />
        <span>{hotel.location}</span>
      </div>

      <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-5">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Star size={16} className="text-amber-400 fill-amber-400" />
          <span className="font-medium">{hotel.rating}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Bed size={16} className="text-gray-400" />
          <span>{hotel.rooms} Rooms</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users size={16} className="text-gray-400" />
          <span>{hotel.occupancy}% Full</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <DollarSign size={16} className="text-emerald-500" />
          <span className="font-bold text-gray-900">${hotel.price}</span>
          <span className="text-xs">/night</span>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t border-gray-100">
        <button
          onClick={() => onView(hotel.id)}
          className="flex-1 py-2 px-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <Eye size={16} /> View
        </button>
        <button
          onClick={() => onEdit(hotel.id)}
          className="p-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={() => onDelete(hotel.id)}
          className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  </div>
);

export default AllHotels;
