import React, { useState, useMemo } from "react";
import Hsidebar from "../../components/dashboard/hsidebar";
import {
  Search,
  Filter,
  Car,
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
} from "lucide-react";

// Sample cars data
const carsData = [
  {
    id: 1,
    name: "Tesla Model 3",
    brand: "Tesla",
    type: "Sedan",
    year: 2024,
    transmission: "Automatic",
    fuelType: "Electric",
    seats: 5,
    mileage: "358 miles",
    pricePerDay: 89,
    status: "available",
    color: "Pearl White",
    plateNumber: "EV-2024",
    features: ["Autopilot", "Premium Audio", "Glass Roof"],
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400",
  },
  {
    id: 2,
    name: "BMW X5",
    brand: "BMW",
    type: "SUV",
    year: 2023,
    transmission: "Automatic",
    fuelType: "Diesel",
    seats: 7,
    mileage: "25 MPG",
    pricePerDay: 125,
    status: "rented",
    color: "Black Sapphire",
    plateNumber: "BMW-5890",
    features: ["4WD", "Leather Seats", "Sunroof"],
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400",
  },
  {
    id: 3,
    name: "Mercedes-Benz C-Class",
    brand: "Mercedes",
    type: "Sedan",
    year: 2024,
    transmission: "Automatic",
    fuelType: "Petrol",
    seats: 5,
    mileage: "32 MPG",
    pricePerDay: 110,
    status: "available",
    color: "Silver",
    plateNumber: "MBC-7721",
    features: ["Navigation", "Heated Seats", "Bluetooth"],
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400",
  },
  {
    id: 4,
    name: "Toyota Camry",
    brand: "Toyota",
    type: "Sedan",
    year: 2023,
    transmission: "Automatic",
    fuelType: "Hybrid",
    seats: 5,
    mileage: "52 MPG",
    pricePerDay: 65,
    status: "available",
    color: "Blue",
    plateNumber: "TOY-4432",
    features: ["Backup Camera", "Cruise Control", "USB Ports"],
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400",
  },
  {
    id: 5,
    name: "Audi A4",
    brand: "Audi",
    type: "Sedan",
    year: 2024,
    transmission: "Automatic",
    fuelType: "Petrol",
    seats: 5,
    mileage: "30 MPG",
    pricePerDay: 95,
    status: "maintenance",
    color: "Mythos Black",
    plateNumber: "AUD-8834",
    features: ["Quattro AWD", "Virtual Cockpit", "Ambient Lighting"],
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400",
  },
  {
    id: 6,
    name: "Honda CR-V",
    brand: "Honda",
    type: "SUV",
    year: 2023,
    transmission: "Automatic",
    fuelType: "Petrol",
    seats: 5,
    mileage: "28 MPG",
    pricePerDay: 75,
    status: "available",
    color: "White Diamond",
    plateNumber: "HON-2341",
    features: ["Apple CarPlay", "Lane Assist", "Rear Camera"],
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400",
  },
  {
    id: 7,
    name: "Ford Mustang",
    brand: "Ford",
    type: "Sports",
    year: 2024,
    transmission: "Manual",
    fuelType: "Petrol",
    seats: 4,
    mileage: "21 MPG",
    pricePerDay: 150,
    status: "available",
    color: "Race Red",
    plateNumber: "MUS-9876",
    features: ["V8 Engine", "Sport Mode", "Premium Sound"],
    image: "https://images.unsplash.com/photo-1584345604476-8ec5f8d69daf?w=400",
  },
  {
    id: 8,
    name: "Jeep Wrangler",
    brand: "Jeep",
    type: "SUV",
    year: 2023,
    transmission: "Automatic",
    fuelType: "Petrol",
    seats: 5,
    mileage: "22 MPG",
    pricePerDay: 105,
    status: "rented",
    color: "Granite Crystal",
    plateNumber: "JEP-5543",
    features: ["4x4", "Removable Top", "Off-Road Package"],
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400",
  },
  {
    id: 9,
    name: "Porsche 911",
    brand: "Porsche",
    type: "Sports",
    year: 2024,
    transmission: "Automatic",
    fuelType: "Petrol",
    seats: 4,
    mileage: "20 MPG",
    pricePerDay: 299,
    status: "available",
    color: "Guards Red",
    plateNumber: "POR-1111",
    features: ["Turbo", "Sport Chrono", "Carbon Brakes"],
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400",
  },
  {
    id: 10,
    name: "Chevrolet Suburban",
    brand: "Chevrolet",
    type: "SUV",
    year: 2023,
    transmission: "Automatic",
    fuelType: "Petrol",
    seats: 8,
    mileage: "18 MPG",
    pricePerDay: 135,
    status: "available",
    color: "Black",
    plateNumber: "CHV-7788",
    features: ["Third Row", "Towing Package", "Entertainment System"],
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400",
  },
  {
    id: 11,
    name: "Nissan Altima",
    brand: "Nissan",
    type: "Sedan",
    year: 2023,
    transmission: "Automatic",
    fuelType: "Petrol",
    seats: 5,
    mileage: "32 MPG",
    pricePerDay: 55,
    status: "available",
    color: "Storm Blue",
    plateNumber: "NIS-3322",
    features: ["Keyless Entry", "Bluetooth", "Safety Shield"],
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400",
  },
  {
    id: 12,
    name: "Range Rover Sport",
    brand: "Land Rover",
    type: "SUV",
    year: 2024,
    transmission: "Automatic",
    fuelType: "Diesel",
    seats: 7,
    mileage: "24 MPG",
    pricePerDay: 189,
    status: "available",
    color: "Santorini Black",
    plateNumber: "RNG-4455",
    features: ["Air Suspension", "Meridian Audio", "Terrain Response"],
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400",
  },
];

const AllCars = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [transmissionFilter, setTransmissionFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // --- FIX APPLIED: The filtering must occur on the ENTIRE dataset (carsData)
  // The original logic was correct, but we must ensure the page resets on change.

  // Filter and search cars
  const filteredCars = useMemo(() => {
    // We start filtering on the *full* data set: carsData
    const results = carsData.filter((car) => {
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

    // Check if the current page is out of bounds after filtering and reset if needed
    const totalPagesAfterFilter = Math.ceil(results.length / itemsPerPage);
    if (currentPage > totalPagesAfterFilter && totalPagesAfterFilter > 0) {
      // Note: We avoid calling setCurrentPage here directly to prevent side-effects
      // in useMemo. The handlers below already reset the page on input change,
      // which is usually sufficient.
      // For pure correctness (if filters are changed programmatically),
      // we'd use a useEffect, but for user input, the handlers are enough.
    }

    return results;
  }, [searchTerm, statusFilter, typeFilter, transmissionFilter, currentPage]);

  // Calculate stats based on ALL cars, not just filtered ones
  const availableCars = carsData.filter(
    (car) => car.status === "available"
  ).length;
  const rentedCars = carsData.filter((car) => car.status === "rented").length;
  const maintenanceCars = carsData.filter(
    (car) => car.status === "maintenance"
  ).length;
  const avgPrice =
    carsData.reduce((sum, car) => sum + car.pricePerDay, 0) / carsData.length;

  // Pagination is based on the filtered results
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCars = filteredCars.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getStatusColor = (status) => {
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

  // --- Handlers modified to reset currentPage to 1 on filter/search change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Crucial fix: Reset page on search
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Crucial fix: Reset page on filter
  };

  const handleTypeChange = (e) => {
    setTypeFilter(e.target.value);
    setCurrentPage(1); // Crucial fix: Reset page on filter
  };

  const handleTransmissionChange = (e) => {
    setTransmissionFilter(e.target.value);
    setCurrentPage(1); // Crucial fix: Reset page on filter
  };

  return (
    <Hsidebar>
      <div className="p-4 sm:p-6 lg:p-8 font-['Inter'] min-h-screen bg-gray-50">
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
            Fleet Management
          </h1>
          <p style={{ color: "#6b7280", fontSize: "16px" }}>
            Manage your entire car rental fleet in one place
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
                onChange={handleSearchChange} // <-- FIX APPLIED
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
              onChange={handleStatusChange} // <-- FIX APPLIED
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
              onChange={handleTypeChange} // <-- FIX APPLIED
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
              <option value="Hybrid">Hybrid</option>
            </select>

            {/* Transmission Filter */}
            <select
              value={transmissionFilter}
              onChange={handleTransmissionChange} // <-- FIX APPLIED
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
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", // Adjusted min width slightly for better fit
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
                      <Gauge size={16} color="#6b7280" />
                      <span style={{ fontSize: "13px", color: "#374151" }}>
                        {car.mileage}
                      </span>
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
                    {car.features.slice(0, 3).map((feature, index) => (
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
                        style={{
                          padding: "8px 16px",
                          backgroundColor: "#3b82f6",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "14px",
                          fontWeight: 500,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          transition: "background-color 0.2s",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.backgroundColor = "#2563eb")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.backgroundColor = "#3b82f6")
                        }
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
                          transition: "background-color 0.2s",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.backgroundColor = "#e5e7eb")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.backgroundColor = "#f3f4f6")
                        }
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
                          transition: "background-color 0.2s",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.backgroundColor = "#fecaca")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.backgroundColor = "#fee2e2")
                        }
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
              <Car size={48} style={{ margin: "0 auto 12px" }} />
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
