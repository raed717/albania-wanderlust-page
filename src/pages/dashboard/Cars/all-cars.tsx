import React, { useState, useMemo, useEffect } from "react";
import Hsidebar from "../../../components/dashboard/hsidebar";
import { getAllCars, deleteCar } from "@/services/api/carService";
import { Car } from "@/types/car.types";
import { useNavigate } from "react-router-dom";
import { AddCarDialog } from "./addCarDialog";
import {
  Search,
  Filter,
  Fuel,
  Settings,
  Users,
  DollarSign,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Gauge,
  Cog,
  MapPin,
} from "lucide-react";
import Swal from "sweetalert2";

const AllCars = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [transmissionFilter, setTransmissionFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [carsData, setCarsData] = useState<Car[]>([]);
  const itemsPerPage = 6;

  // Fetch cars on component mount
  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAllCars();
      console.log("Fetched cars:", data);
      console.log("Number of cars:", data?.length);

      setCarsData(data || []); // Ensure we always set an array
    } catch (err) {
      console.error("Error fetching cars:", err);
      setError("Failed to load cars. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Filter and search cars
  const filteredCars = useMemo(() => {
    return carsData.filter((car) => {
      // 1. Search Term Check
      const lowerSearchTerm = searchTerm.toLowerCase();
      const matchesSearch =
        car.name.toLowerCase().includes(lowerSearchTerm) ||
        car.brand.toLowerCase().includes(lowerSearchTerm) ||
        car.plateNumber.toLowerCase().includes(lowerSearchTerm);

      // 2. Status Filter Check
      const matchesStatus =
        statusFilter === "all" || car.status === statusFilter;

      // 3. Type Filter Check
      const matchesType = typeFilter === "all" || car.type === typeFilter;

      // 4. Transmission Filter Check
      const matchesTransmission =
        transmissionFilter === "all" || car.transmission === transmissionFilter;

      return (
        matchesSearch && matchesStatus && matchesType && matchesTransmission
      );
    });
  }, [carsData, searchTerm, statusFilter, typeFilter, transmissionFilter]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, typeFilter, transmissionFilter]);

  // Calculate stats based on ALL cars, not just filtered ones
  const availableCars = carsData.filter(
    (car) => car.status === "available"
  ).length;
  const rentedCars = carsData.filter((car) => car.status === "rented").length;
  const maintenanceCars = carsData.filter(
    (car) => car.status === "maintenance"
  ).length;
  const avgPrice =
    carsData.length > 0
      ? carsData.reduce((sum, car) => sum + car.pricePerDay, 0) / carsData.length
      : 0;

  // Pagination is based on the filtered results
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCars = filteredCars.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Handler functions - moved outside of map
  const handleViewCar = (id: number) => {
    navigate(`/dashboard/carInfo/${id}`);
  };

  const handleEditCar = (id: number) => {
    navigate(`/dashboard/carInfo/${id}?edit=true`);
  };

  const handleDeleteCar = async (id: number, name: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteCar(id);
        setCarsData((prev) => prev.filter((car) => car.id !== id));
        console.log(`Deleting car with ID: ${id}`);
        Swal.fire({
          title: "Deleted!",
          text: "Your car has been deleted.",
          icon: "success"
        });
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return { bg: "#10b981", text: "white" };
      case "rented":
        return { bg: "#3b82f6", text: "white" };
      case "maintenance":
        return { bg: "#f59e0b", text: "white" };
      default:
        return { bg: "#6b7280", text: "white" };
    }
  };

  // Simplified handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(e.target.value);
  };

  const handleTransmissionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTransmissionFilter(e.target.value);
  };

  // Show loading state
  if (loading) {
    return (
      <Hsidebar>
        <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-xl font-semibold text-gray-700">Loading vehicles...</div>
          </div>
        </div>
      </Hsidebar>
    );
  }

  // Show error state
  if (error) {
    return (
      <Hsidebar>
        <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-xl font-semibold text-red-600">{error}</div>
            <button
              onClick={fetchCars}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      </Hsidebar>
    );
  }

  function handleCarAdded(car: any): void {
    setCarsData((prev) => [...prev, car]);
  }

  return (
    <Hsidebar>
      <div className="p-4 sm:p-6 lg:p-8 font-['Inter'] min-h-screen bg-gray-50">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              All Cars
            </h1>
            <p className="text-gray-500 text-lg">
              Manage and monitor all your fleet
            </p>
          </div>
          <AddCarDialog onCarAdded={handleCarAdded} />
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
          {/* Stat 1: Available */}
          <div
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              padding: "24px",
              borderRadius: "12px",
              color: "white",
              boxShadow: "0 4px 6px rgba(16, 185, 129, 0.4)",
            }}
          >
            <div
              style={{ fontSize: "14px", opacity: 0.9, marginBottom: "8px" }}
            >
              Available Cars
            </div>
            <div style={{ fontSize: "32px", fontWeight: 700 }}>
              {availableCars}
            </div>
            <div style={{ fontSize: "12px", opacity: 0.8, marginTop: "4px" }}>
              Ready to rent
            </div>
          </div>
          {/* Stat 2: Rented */}
          <div
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              padding: "24px",
              borderRadius: "12px",
              color: "white",
              boxShadow: "0 4px 6px rgba(59, 130, 246, 0.4)",
            }}
          >
            <div
              style={{ fontSize: "14px", opacity: 0.9, marginBottom: "8px" }}
            >
              Currently Rented
            </div>
            <div style={{ fontSize: "32px", fontWeight: 700 }}>
              {rentedCars}
            </div>
            <div style={{ fontSize: "12px", opacity: 0.8, marginTop: "4px" }}>
              On the road
            </div>
          </div>
          {/* Stat 3: Maintenance */}
          <div
            style={{
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              padding: "24px",
              borderRadius: "12px",
              color: "white",
              boxShadow: "0 4px 6px rgba(245, 158, 11, 0.4)",
            }}
          >
            <div
              style={{ fontSize: "14px", opacity: 0.9, marginBottom: "8px" }}
            >
              In Maintenance
            </div>
            <div style={{ fontSize: "32px", fontWeight: 700 }}>
              {maintenanceCars}
            </div>
            <div style={{ fontSize: "12px", opacity: 0.8, marginTop: "4px" }}>
              Being serviced
            </div>
          </div>
          {/* Stat 4: Avg Daily Rate */}
          <div
            style={{
              background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
              padding: "24px",
              borderRadius: "12px",
              color: "white",
              boxShadow: "0 4px 6px rgba(139, 92, 246, 0.4)",
            }}
          >
            <div
              style={{ fontSize: "14px", opacity: 0.9, marginBottom: "8px" }}
            >
              Avg Daily Rate
            </div>
            <div style={{ fontSize: "32px", fontWeight: 700 }}>
              ${avgPrice.toFixed(0)}
            </div>
            <div style={{ fontSize: "12px", opacity: 0.8, marginTop: "4px" }}>
              Per vehicle
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
                placeholder="Search by name, brand, or plate..."
                value={searchTerm}
                onChange={handleSearchChange}
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
            <select
              value={statusFilter}
              onChange={handleStatusChange}
              style={{
                padding: "10px 12px",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                cursor: "pointer",
                backgroundColor: "white",
                minWidth: "150px",
              }}
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="rented">Rented</option>
              <option value="maintenance">Maintenance</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={handleTypeChange}
              style={{
                padding: "10px 12px",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                cursor: "pointer",
                backgroundColor: "white",
                minWidth: "150px",
              }}
            >
              <option value="all">All Types</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Sports">Sports</option>
            </select>

            {/* Transmission Filter */}
            <select
              value={transmissionFilter}
              onChange={handleTransmissionChange}
              style={{
                padding: "10px 12px",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                cursor: "pointer",
                backgroundColor: "white",
                minWidth: "150px",
              }}
            >
              <option value="all">All Transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>

            {/* Results count */}
            <div
              style={{ color: "#6b7280", fontSize: "14px", marginLeft: "auto" }}
            >
              <span className="font-semibold text-gray-800">
                {filteredCars.length}
              </span>{" "}
              vehicles found
            </div>
          </div>
        </div>

        {/* Cars Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "24px",
            marginBottom: "32px",
          }}
        >
          {paginatedCars.map((car) => {
            const statusColor = getStatusColor(car.status);

            return (
              <div
                key={car.id}
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
                  e.currentTarget.style.boxShadow =
                    "0 8px 16px rgba(0,0,0,0.15)";
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
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url(${car.image})`,
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
                      backgroundColor: statusColor.bg,
                      color: statusColor.text,
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: 600,
                      textTransform: "capitalize",
                    }}
                  >
                    {car.status}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      bottom: "12px",
                      left: "12px",
                      backgroundColor: "rgba(0,0,0,0.7)",
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    {car.plateNumber}
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: "20px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      marginBottom: "8px",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: "20px",
                          fontWeight: 600,
                          color: "#111827",
                          marginBottom: "4px",
                        }}
                      >
                        {car.name}
                      </h3>
                      <div style={{ fontSize: "14px", color: "#6b7280" }}>
                        {car.brand} • {car.year}
                      </div>
                    </div>
                    <div
                      style={{
                        backgroundColor: "#f3f4f6",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#374151",
                      }}
                    >
                      {car.type}
                    </div>
                  </div>

                  {/* Specs Grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: "12px",
                      marginTop: "16px",
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
                      <Settings size={16} color="#6b7280" />
                      <span style={{ fontSize: "13px", color: "#374151" }}>
                        {car.transmission}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Fuel size={16} color="#6b7280" />
                      <span style={{ fontSize: "13px", color: "#374151" }}>
                        {car.fuelType}
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
                      <span style={{ fontSize: "13px", color: "#374151" }}>
                        {car.seats} Seats
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Gauge size={16} color="#6b7280" />
                      <span style={{ fontSize: "13px", color: "#374151" }}>
                        {car.mileage}
                      </span>

                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}>
                        <MapPin size={16} color="#6b7280" />
                        <span style={{ fontSize: "13px", color: "#374151" }}>
                          {car.pickUpLocation}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px",
                      marginBottom: "16px",
                    }}
                  >
                    {car.features?.map((feature, index) => (
                      <span
                        key={index}
                        style={{
                          fontSize: "11px",
                          backgroundColor: "#eff6ff",
                          color: "#3b82f6",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontWeight: 500,
                        }}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Price and Actions */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingTop: "16px",
                      borderTop: "1px solid #e5e7eb",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>
                        Daily Rate
                      </div>
                      <div
                        style={{
                          fontSize: "24px",
                          fontWeight: 700,
                          color: "#111827",
                        }}
                      >
                        ${car.pricePerDay}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewCar(car.id);
                        }}
                        className="flex-1 py-2 px-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                      >
                        <Eye size={16} /> View
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditCar(car.id);
                        }}
                        className="p-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCar(car.id, car.name);
                        }}
                        className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Message if no cars found */}
          {filteredCars.length === 0 && (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "40px",
                color: "#6b7280",
              }}
            >
              <p className="text-xl font-semibold">No Vehicles Found</p>
              <p>Try adjusting your search term or filters.</p>
            </div>
          )}
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
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor =
                currentPage === 1 ? "#f3f4f6" : "#2563eb")
              }
              onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor =
                currentPage === 1 ? "#f3f4f6" : "#3b82f6")
              }
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            <div style={{ display: "flex", gap: "8px" }}>
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
                      transition: "background-color 0.2s, border-color 0.2s",
                    }}
                    onMouseOver={(e) => {
                      if (currentPage !== page)
                        e.currentTarget.style.backgroundColor = "#f3f4f6";
                    }}
                    onMouseOut={(e) => {
                      if (currentPage !== page)
                        e.currentTarget.style.backgroundColor = "white";
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
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor =
                currentPage === totalPages ? "#f3f4f6" : "#2563eb")
              }
              onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor =
                currentPage === totalPages ? "#f3f4f6" : "#3b82f6")
              }
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

export default AllCars;