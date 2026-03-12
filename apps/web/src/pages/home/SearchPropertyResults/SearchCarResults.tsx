import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import { AlertCircle, Car as CarIcon } from "lucide-react";
import PrimarySearchAppBar from "@/components/home/AppBar";
import { CarCard } from "@/components/home/CarCard";
import {
  getAllCars,
  getCarUnavailabilityDates,
} from "@/services/api/carService";
import { getMonthlyPrices } from "@/services/api/monthlyPriceService";
import { Car } from "@/types/car.types";
import { Month, MONTHS } from "@/types/price.type";
import { CarFilterBar, CarFilterState } from "./CarFilterBar";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";

// Helper to get current month as Month type
const getCurrentMonth = (): Month => {
  const monthIndex = new Date().getMonth();
  return MONTHS[monthIndex];
};

interface LocationState {
  type?: string;
  destination?: string;
  pickupDate?: string | null;
  returnDate?: string | null;
}

const SearchCarResults = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const navigate = useNavigate();

  const [cars, setCars] = useState<Car[]>([]);
  const [carUnavailability, setCarUnavailability] = useState<
    Record<number, string[]>
  >({});
  const [carMonthlyPrices, setCarMonthlyPrices] = useState<
    Record<number, number | null>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current month for pricing
  const currentMonth = getCurrentMonth();

  // Extract search params from navigation state
  const initialDestination = state?.destination || "";
  const pickupDate = state?.pickupDate ? new Date(state.pickupDate) : null;
  const returnDate = state?.returnDate ? new Date(state.returnDate) : null;

  // Filter State
  const [filters, setFilters] = useState<CarFilterState>({
    searchTerm: initialDestination,
    status: "all",
    type: "all",
    transmission: "all",
    fuelType: "all",
    priceRange: { min: 0, max: 1000 },
    features: [],
    seats: undefined,
    pickupDate: pickupDate,
    returnDate: returnDate,
  });

  useEffect(() => {
    fetchCars();
  }, []);

  // Fetch monthly prices for all cars when loaded
  useEffect(() => {
    const fetchMonthlyPrices = async () => {
      if (cars.length === 0) return;

      const pricesMap: Record<number, number | null> = {};
      await Promise.all(
        cars.map(async (car) => {
          try {
            const prices = await getMonthlyPrices(car.id, "car");
            const currentMonthPrice = prices.find(
              (p) => p.month === currentMonth,
            );
            pricesMap[car.id] = currentMonthPrice?.pricePerDay ?? null;
          } catch (err) {
            console.error(
              `Error fetching monthly prices for car ${car.id}:`,
              err,
            );
            pricesMap[car.id] = null;
          }
        }),
      );
      setCarMonthlyPrices(pricesMap);
    };

    fetchMonthlyPrices();
  }, [cars, currentMonth]);

  // Fetch unavailability dates when cars are loaded or date filters change
  useEffect(() => {
    const fetchUnavailability = async () => {
      if (cars.length === 0) return;
      if (!filters.pickupDate && !filters.returnDate) {
        setCarUnavailability({});
        return;
      }

      const unavailabilityMap: Record<number, string[]> = {};
      await Promise.all(
        cars.map(async (car) => {
          try {
            const dates = await getCarUnavailabilityDates(car.id);
            unavailabilityMap[car.id] = dates;
          } catch (err) {
            console.error(
              `Error fetching unavailability for car ${car.id}:`,
              err,
            );
            unavailabilityMap[car.id] = [];
          }
        }),
      );
      setCarUnavailability(unavailabilityMap);
    };

    fetchUnavailability();
  }, [cars, filters.pickupDate, filters.returnDate]);

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllCars();
      //  exclude cars with status "maintenance" or "review"
      const availableCars = data.filter(
        (car) => car.status !== "maintenance" && car.status !== "review",
      );
      setCars(availableCars);
    } catch (err) {
      console.error("Error fetching cars:", err);
      setError(t("searchResults.cars.errorFetch"));
    } finally {
      setLoading(false);
    }
  };

  // Extract unique features from all cars
  const availableFeatures = useMemo(() => {
    const featuresSet = new Set<string>();
    cars.forEach((car) => {
      car.features?.forEach((feature) => featuresSet.add(feature));
    });
    return Array.from(featuresSet).sort();
  }, [cars]);

  // Helper function to check if car is available for the selected date range
  const isCarAvailableForDateRange = (
    carId: number,
    pickup: Date | null,
    returnD: Date | null,
  ): boolean => {
    if (!pickup || !returnD) return true; // No date filter applied

    const unavailableDates = carUnavailability[carId] || [];
    if (unavailableDates.length === 0) return true;

    // Get all dates in the requested range
    const requestedDates: string[] = [];
    const currentDate = new Date(pickup);
    while (currentDate <= returnD) {
      requestedDates.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Check if any requested date is unavailable
    return !requestedDates.some((date) => unavailableDates.includes(date));
  };

  // Filter logic
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      // Search Term (Brand, Name, Location)
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        const matchName = car.name.toLowerCase().includes(term);
        const matchBrand = car.brand.toLowerCase().includes(term);
        const matchLocation = car.pickUpLocation?.toLowerCase().includes(term);
        if (!matchName && !matchBrand && !matchLocation) return false;
      }

      // Status
      if (
        filters.status &&
        filters.status !== "all" &&
        car.status !== filters.status
      )
        return false;

      // Type
      if (filters.type && filters.type !== "all" && car.type !== filters.type)
        return false;

      // Transmission
      if (
        filters.transmission &&
        filters.transmission !== "all" &&
        car.transmission !== filters.transmission
      )
        return false;

      // Fuel Type
      if (
        filters.fuelType &&
        filters.fuelType !== "all" &&
        car.fuelType !== filters.fuelType
      )
        return false;

      // Price Range (use current month price if available, otherwise base price)
      if (filters.priceRange) {
        const effectivePrice = carMonthlyPrices[car.id] ?? car.pricePerDay;
        if (
          effectivePrice < filters.priceRange.min ||
          effectivePrice > filters.priceRange.max
        )
          return false;
      }

      // Seats
      if (filters.seats && car.seats < filters.seats) return false;

      // Features (Must have all selected features)
      if (filters.features && filters.features.length > 0) {
        const hasAllFeatures = filters.features.every((f) =>
          car.features?.includes(f),
        );
        if (!hasAllFeatures) return false;
      }

      // Date Availability
      if (filters.pickupDate || filters.returnDate) {
        if (
          !isCarAvailableForDateRange(
            car.id,
            filters.pickupDate ?? null,
            filters.returnDate ?? null,
          )
        ) {
          return false;
        }
      }

      return true;
    });
  }, [cars, filters, carUnavailability, carMonthlyPrices]);

  const handleFilterChange = (newFilters: Partial<CarFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchTerm: "",
      status: "all",
      type: "all",
      transmission: "all",
      fuelType: "all",
      priceRange: { min: 0, max: 1000 },
      features: [],
      seats: undefined,
      pickupDate: null,
      returnDate: null,
    });
  };

  const handleCarClick = (id: number) => {
    // Navigate to car reservation page
    navigate(`/carReservation/${id}`);
  };

  // Theme tokens
  const tk = {
    pageBg: isDark
      ? 'linear-gradient(160deg, #0a0a0c 0%, #111115 40%, #16080a 100%)'
      : 'linear-gradient(160deg, #f8f4f1 0%, #fdf9f7 40%, #fff5f5 100%)',
    heroBg: isDark
      ? 'linear-gradient(180deg, rgba(232,25,44,0.08) 0%, transparent 100%)'
      : 'linear-gradient(180deg, rgba(232,25,44,0.06) 0%, transparent 100%)',
    heroBorder: isDark ? 'rgba(232,25,44,0.12)' : 'rgba(232,25,44,0.15)',
    headingColor: isDark ? '#f0ece8' : '#1a0a0d',
    skeletonBg: isDark ? '#141417' : '#ffffff',
    skeletonBorder: isDark ? 'rgba(232,25,44,0.1)' : 'rgba(232,25,44,0.12)',
    skeletonPulseFrom: isDark ? '#1c1c21' : '#f0e8e8',
    skeletonPulseMid: isDark ? '#252528' : '#fde8e8',
    errorText: isDark ? '#f0ece8' : '#1a0a0d',
    emptyStateBg: isDark ? '#141417' : '#ffffff',
    emptyStateBorder: isDark ? 'rgba(232,25,44,0.2)' : 'rgba(232,25,44,0.25)',
    clearBtnColor: isDark ? 'rgba(240,236,232,0.7)' : 'rgba(26,10,13,0.6)',
    clearBtnBorder: isDark ? 'rgba(240,236,232,0.2)' : 'rgba(26,10,13,0.2)',
    textureBg: isDark
      ? "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")"
      : "none",
  };

  const renderSkeletons = () => {
    return Array.from({ length: 6 }).map((_, idx) => (
      <div
        key={idx}
        style={{
          background: tk.skeletonBg,
          border: `1px solid ${tk.skeletonBorder}`,
          borderRadius: 6,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animationDelay: `${idx * 0.07}s`,
          animation: 'fadeUpGrid 0.5s ease both',
        }}
      >
        <div className="alb-skeleton-pulse" style={{ height: 192, width: '100%' }} />
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="alb-skeleton-pulse" style={{ height: 10, width: '30%', borderRadius: 2 }} />
          <div className="alb-skeleton-pulse" style={{ height: 20, width: '70%', borderRadius: 2 }} />
          <div className="alb-skeleton-pulse" style={{ height: 14, width: '50%', borderRadius: 2 }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[0,1,2,3].map(i => (
              <div key={i} className="alb-skeleton-pulse" style={{ height: 14, borderRadius: 2 }} />
            ))}
          </div>
          <div style={{ marginTop: 8, paddingTop: 12, borderTop: `1px solid ${tk.skeletonBorder}`, display: 'flex', justifyContent: 'space-between' }}>
            <div className="alb-skeleton-pulse" style={{ height: 14, width: '25%', borderRadius: 2 }} />
            <div className="alb-skeleton-pulse" style={{ height: 22, width: '30%', borderRadius: 2 }} />
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen" style={{ background: tk.pageBg, transition: 'background 0.3s' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300&display=swap');

        .alb-title {
          font-family: 'Bebas Neue', 'Impact', sans-serif;
          letter-spacing: 0.04em;
        }

        .alb-body {
          font-family: 'Crimson Pro', 'Georgia', serif;
        }

        .alb-card-grid {
          animation: fadeUpGrid 0.6s ease both;
        }

        @keyframes fadeUpGrid {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .alb-skeleton-pulse {
          background: linear-gradient(90deg, ${tk.skeletonPulseFrom} 25%, ${tk.skeletonPulseMid} 50%, ${tk.skeletonPulseFrom} 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s ease infinite;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .alb-red-line {
          height: 3px;
          background: linear-gradient(90deg, #E8192C, #b01020 60%, transparent);
        }

        .alb-count-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(232, 25, 44, 0.08);
          border: 1px solid rgba(232, 25, 44, 0.22);
          color: #E8192C;
          font-family: 'Crimson Pro', serif;
          font-size: 0.95rem;
          letter-spacing: 0.03em;
          padding: 3px 12px;
          border-radius: 2px;
        }

        .alb-retry-btn {
          margin-left: auto;
          background: transparent;
          border: 1px solid rgba(232, 25, 44, 0.5);
          color: #E8192C;
          font-family: 'Crimson Pro', serif;
          font-size: 0.9rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 6px 16px;
          border-radius: 2px;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          white-space: nowrap;
        }
        .alb-retry-btn:hover {
          background: rgba(232, 25, 44, 0.12);
          color: #E8192C;
        }

        .alb-clear-btn:hover {
          border-color: #E8192C !important;
          color: #E8192C !important;
        }

        .alb-bg-texture {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background-image: ${tk.textureBg};
          opacity: 0.025;
        }
      `}</style>

      <div style={{ position: 'relative', zIndex: 1, transition: 'all 0.3s' }}>
        <div className="alb-bg-texture" />
        <PrimarySearchAppBar />

        {/* Hero band */}
        <div style={{
          background: tk.heroBg,
          borderBottom: `1px solid ${tk.heroBorder}`,
          padding: '32px 0 0',
          transition: 'background 0.3s, border-color 0.3s',
        }}>
          <div className="container mx-auto px-4 pb-6">
            <p className="alb-body" style={{ color: 'rgba(232,25,44,0.7)', fontSize: '0.8rem', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 8 }}>
              Albania — Car Rentals
            </p>
            <h1 className="alb-title" style={{ fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', color: tk.headingColor, lineHeight: 0.95, marginBottom: 0, transition: 'color 0.3s' }}>
              {t("searchResults.cars.title")}
            </h1>
            <div className="alb-red-line" style={{ marginTop: 16, width: 'min(200px, 40%)' }} />
          </div>
        </div>

        <main className="container mx-auto px-4 py-8" style={{ position: 'relative', zIndex: 1 }}>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filter Sidebar */}
            <CarFilterBar
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              availableFeatures={availableFeatures}
              featuresLoading={loading}
            />

            {/* Main Content */}
            <div className="flex-1 w-full">
              {/* Result count */}
              {!loading && !error && (
                <div style={{ marginBottom: 28 }}>
                  <span className="alb-count-badge alb-body">
                    <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#E8192C', flexShrink: 0 }} />
                    {t("searchResults.cars.found", { count: filteredCars.length })}
                  </span>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div style={{
                  background: isDark ? 'rgba(232,25,44,0.07)' : 'rgba(232,25,44,0.05)',
                  border: '1px solid rgba(232,25,44,0.3)',
                  borderLeft: '4px solid #E8192C',
                  borderRadius: 4,
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  color: tk.errorText,
                  marginBottom: 24,
                  transition: 'background 0.3s',
                }}>
                  <AlertCircle style={{ color: '#E8192C', width: 20, height: 20, flexShrink: 0 }} />
                  <span className="alb-body" style={{ flex: 1, fontSize: '1rem' }}>{error}</span>
                  <button className="alb-retry-btn" onClick={fetchCars}>
                    {t("searchResults.cars.tryAgain")}
                  </button>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {renderSkeletons()}
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && filteredCars.length === 0 && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '80px 24px',
                  textAlign: 'center',
                  background: tk.emptyStateBg,
                  border: `1px dashed ${tk.emptyStateBorder}`,
                  borderRadius: 6,
                  transition: 'background 0.3s',
                }}>
                  <div style={{
                    width: 72, height: 72,
                    border: '1px solid rgba(232,25,44,0.25)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 20,
                    background: 'rgba(232,25,44,0.06)',
                  }}>
                    <CarIcon style={{ width: 32, height: 32, color: '#E8192C', opacity: 0.7 }} />
                  </div>
                  <h3 className="alb-title" style={{ fontSize: '1.8rem', color: tk.headingColor, marginBottom: 10, transition: 'color 0.3s' }}>
                    {t("searchResults.cars.emptyTitle")}
                  </h3>
                  <p className="alb-body" style={{ color: isDark ? 'rgba(240,236,232,0.5)' : 'rgba(26,10,13,0.55)', fontSize: '1.1rem', maxWidth: 360 }}>
                    {t("searchResults.cars.emptyDescription")}
                  </p>
                  <button
                    className="alb-clear-btn"
                    onClick={handleResetFilters}
                    style={{
                      marginTop: 24,
                      background: 'transparent',
                      border: `1px solid ${tk.clearBtnBorder}`,
                      color: tk.clearBtnColor,
                      fontFamily: 'Crimson Pro, Georgia, serif',
                      fontSize: '1rem',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      padding: '10px 28px',
                      borderRadius: 2,
                      cursor: 'pointer',
                      transition: 'border-color 0.2s, color 0.2s',
                    }}
                  >
                    {t("searchResults.cars.clearFilters")}
                  </button>
                </div>
              )}

              {/* Results Grid */}
              {!loading && !error && filteredCars.length > 0 && (
                <div className="alb-card-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCars.map((car, idx) => (
                    <div key={car.id} style={{ animationDelay: `${idx * 0.05}s`, animation: 'fadeUpGrid 0.5s ease both' }}>
                      <CarCard
                        {...car}
                        currentMonthPrice={carMonthlyPrices[car.id] ?? undefined}
                        onClick={() => handleCarClick(car.id)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SearchCarResults;
