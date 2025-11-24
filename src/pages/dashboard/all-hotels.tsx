import React, { useState, useMemo } from "react";
import Hsidebar from "../../components/dashboard/hsidebar";
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

// Sample hotel data
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
  {
    id: 10,
    name: "Royal Palace Hotel",
    location: "Las Vegas, USA",
    rating: 4.9,
    rooms: 250,
    occupancy: 95,
    price: 499,
    status: "active",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400",
  },
  {
    id: 11,
    name: "Garden Inn & Spa",
    location: "Portland, USA",
    rating: 4.6,
    rooms: 85,
    occupancy: 75,
    price: 259,
    status: "active",
    image: "https://images.unsplash.com/photo-1455587734955-081b22074882?w=400",
  },
  {
    id: 12,
    name: "Harbor View Hotel",
    location: "San Diego, USA",
    rating: 4.7,
    rooms: 130,
    occupancy: 82,
    price: 310,
    status: "active",
    image: "https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=400",
  },
];

const AllHotels = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter and search hotels
  const filteredHotels = useMemo(() => {
    return hotelsData.filter((hotel) => {
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
  }, [searchTerm, statusFilter, ratingFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHotels = filteredHotels.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <Hsidebar>
      <div>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#111827",
              marginBottom: "8px",
            }}
          >
            All Hotels
          </h1>
          <p style={{ color: "#6b7280", fontSize: "16px" }}>
            Manage and monitor all your hotel properties
          </p>
        </div>

        {/* Stats Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              padding: "24px",
              borderRadius: "12px",
              color: "white",
            }}
          >
            <div
              style={{ fontSize: "14px", opacity: 0.9, marginBottom: "8px" }}
            >
              Total Hotels
            </div>
            <div style={{ fontSize: "32px", fontWeight: 700 }}>
              {hotelsData.length}
            </div>
          </div>
          <div
            style={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              padding: "24px",
              borderRadius: "12px",
              color: "white",
            }}
          >
            <div
              style={{ fontSize: "14px", opacity: 0.9, marginBottom: "8px" }}
            >
              Total Rooms
            </div>
            <div style={{ fontSize: "32px", fontWeight: 700 }}>
              {hotelsData.reduce((sum, hotel) => sum + hotel.rooms, 0)}
            </div>
          </div>
          <div
            style={{
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              padding: "24px",
              borderRadius: "12px",
              color: "white",
            }}
          >
            <div
              style={{ fontSize: "14px", opacity: 0.9, marginBottom: "8px" }}
            >
              Avg Occupancy
            </div>
            <div style={{ fontSize: "32px", fontWeight: 700 }}>
              {(
                hotelsData.reduce((sum, hotel) => sum + hotel.occupancy, 0) /
                hotelsData.length
              ).toFixed(0)}
              %
            </div>
          </div>
          <div
            style={{
              background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
              padding: "24px",
              borderRadius: "12px",
              color: "white",
            }}
          >
            <div
              style={{ fontSize: "14px", opacity: 0.9, marginBottom: "8px" }}
            >
              Avg Rating
            </div>
            <div style={{ fontSize: "32px", fontWeight: 700 }}>
              {(
                hotelsData.reduce((sum, hotel) => sum + hotel.rating, 0) /
                hotelsData.length
              ).toFixed(1)}
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div
          style={{
            backgroundColor: "white",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {/* Search */}
            <div style={{ flex: "1", minWidth: "250px", position: "relative" }}>
              <Search
                size={18}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                }}
              />
              <input
                type="text"
                placeholder="Search hotels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px 10px 40px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>

            {/* Status Filter */}
            <div style={{ position: "relative" }}>
              <Filter
                size={18}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                  pointerEvents: "none",
                }}
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: "10px 12px 10px 40px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  cursor: "pointer",
                  backgroundColor: "white",
                }}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                style={{
                  padding: "10px 12px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  cursor: "pointer",
                  backgroundColor: "white",
                }}
              >
                <option value="all">All Ratings</option>
                <option value="4.5+">4.5+ Stars</option>
                <option value="4+">4+ Stars</option>
              </select>
            </div>

            {/* Results count */}
            <div style={{ color: "#6b7280", fontSize: "14px" }}>
              {filteredHotels.length} hotels found
            </div>
          </div>
        </div>

        {/* Hotels Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
            gap: "24px",
            marginBottom: "32px",
          }}
        >
          {paginatedHotels.map((hotel) => (
            <div
              key={hotel.id}
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
              }}
            >
              {/* Image */}
              <div
                style={{
                  height: "200px",
                  background: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url(${hotel.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    backgroundColor:
                      hotel.status === "active" ? "#10b981" : "#f59e0b",
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: 600,
                    textTransform: "capitalize",
                  }}
                >
                  {hotel.status}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: "20px" }}>
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: 600,
                    color: "#111827",
                    marginBottom: "8px",
                  }}
                >
                  {hotel.name}
                </h3>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "#6b7280",
                    fontSize: "14px",
                    marginBottom: "16px",
                  }}
                >
                  <MapPin size={16} />
                  <span>{hotel.location}</span>
                </div>

                {/* Stats */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "12px",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Star size={16} color="#fbbf24" fill="#fbbf24" />
                    <span style={{ fontSize: "14px", color: "#374151" }}>
                      {hotel.rating} Rating
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Bed size={16} color="#6b7280" />
                    <span style={{ fontSize: "14px", color: "#374151" }}>
                      {hotel.rooms} Rooms
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Users size={16} color="#6b7280" />
                    <span style={{ fontSize: "14px", color: "#374151" }}>
                      {hotel.occupancy}% Occupied
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <DollarSign size={16} color="#6b7280" />
                    <span style={{ fontSize: "14px", color: "#374151" }}>
                      ${hotel.price}/night
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    paddingTop: "16px",
                    borderTop: "1px solid #e5e7eb",
                  }}
                >
                  <button
                    style={{
                      flex: 1,
                      padding: "8px",
                      backgroundColor: "#3b82f6",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: 500,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button
                    style={{
                      padding: "8px 12px",
                      backgroundColor: "#f3f4f6",
                      color: "#374151",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    style={{
                      padding: "8px 12px",
                      backgroundColor: "#fee2e2",
                      color: "#dc2626",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "12px",
              marginTop: "32px",
            }}
          >
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              style={{
                padding: "8px 16px",
                backgroundColor: currentPage === 1 ? "#f3f4f6" : "#3b82f6",
                color: currentPage === 1 ? "#9ca3af" : "white",
                border: "none",
                borderRadius: "8px",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontWeight: 500,
              }}
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            <div
              style={{
                display: "flex",
                gap: "8px",
              }}
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      padding: "8px 14px",
                      backgroundColor:
                        currentPage === page ? "#3b82f6" : "white",
                      color: currentPage === page ? "white" : "#374151",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: 500,
                    }}
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
              style={{
                padding: "8px 16px",
                backgroundColor:
                  currentPage === totalPages ? "#f3f4f6" : "#3b82f6",
                color: currentPage === totalPages ? "#9ca3af" : "white",
                border: "none",
                borderRadius: "8px",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontWeight: 500,
              }}
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </Hsidebar>
  );
};

export default AllHotels;
