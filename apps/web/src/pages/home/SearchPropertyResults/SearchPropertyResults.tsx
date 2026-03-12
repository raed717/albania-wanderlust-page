import { useEffect } from "react";
import { AlertCircle, Building2 } from "lucide-react";
import PrimarySearchAppBar from "@/components/home/AppBar";
import FilterBar from "./FilterBar";
import { PropertyCard } from "@/components/home/PropertyCard";
import { useSearchFilters } from "@/hooks/useSearchFilters";
import { useLocation } from "react-router-dom";
import { defaultSearchFilters } from "@/types/search.types";
import MapPreviewCard from "./MapPreviewCard";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";

const SearchPropertyResults = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as {
    type: string;
    destination?: string;
    checkInDate?: string | null;
    checkOutDate?: string | null;
    adults?: number;
    children?: number;
    rooms?: number;
  } | null;

  const initialFilters = state
    ? {
        destination: state.destination,
        checkInDate: state.checkInDate,
        checkOutDate: state.checkOutDate,
        adults: state.adults,
        children: state.children,
        rooms: state.rooms,
        hotelFilters: {
          ...defaultSearchFilters.hotelFilters,
          searchTerm:
            state.destination || defaultSearchFilters.hotelFilters.searchTerm,
          rooms: state.rooms
            ? { ...defaultSearchFilters.hotelFilters.rooms, min: state.rooms }
            : defaultSearchFilters.hotelFilters.rooms,
        },
        apartmentFilters: {
          ...defaultSearchFilters.apartmentFilters,
          searchTerm:
            state.destination ||
            defaultSearchFilters.apartmentFilters.searchTerm,
          rooms: state.rooms
            ? {
                ...defaultSearchFilters.apartmentFilters.rooms,
                min: state.rooms,
              }
            : defaultSearchFilters.apartmentFilters.rooms,
          beds:
            state.adults || state.children
              ? {
                  ...defaultSearchFilters.apartmentFilters.beds,
                  min: (state.adults || 0) + (state.children || 0),
                }
              : defaultSearchFilters.apartmentFilters.beds,
        },
      }
    : undefined;

  const {
    filters,
    results,
    loading,
    error,
    setFilters,
    setPropertyType,
    setHotelFilters,
    setApartmentFilters,
    resetFilters,
    applyFilters,
  } = useSearchFilters(initialFilters);

  // Set filters from navigation state
  useEffect(() => {
    if (state) {
      if (state.destination) {
        setHotelFilters({ searchTerm: state.destination });
        setApartmentFilters({ searchTerm: state.destination });
      }

      if (
        state.checkInDate ||
        state.checkOutDate ||
        state.adults !== undefined ||
        state.children !== undefined ||
        state.rooms !== undefined
      ) {
        setFilters({
          checkInDate: state.checkInDate,
          checkOutDate: state.checkOutDate,
          adults: state.adults,
          children: state.children,
          rooms: state.rooms,
        });

        if (state.adults !== undefined || state.children !== undefined) {
          const requiredBeds = (state.adults || 0) + (state.children || 0);
          setApartmentFilters({
            beds: {
              min: requiredBeds,
              max: filters.apartmentFilters.beds?.max,
            },
          });
        }

        if (state.rooms !== undefined) {
          setHotelFilters({
            rooms: {
              min: state.rooms,
              max: filters.hotelFilters.rooms?.max,
            },
          });
          setApartmentFilters({
            rooms: {
              min: state.rooms,
              max: filters.apartmentFilters.rooms?.max,
            },
          });
        }
      }
    }
  }, [state, setFilters, setHotelFilters, setApartmentFilters]);

  // Fetch properties on mount
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleDateChange = (dates: {
    checkInDate?: string | null;
    checkOutDate?: string | null;
  }) => {
    setFilters({
      checkInDate: dates.checkInDate ?? filters.checkInDate,
      checkOutDate: dates.checkOutDate ?? filters.checkOutDate,
    });
    setTimeout(() => applyFilters(), 0);
  };

  const handleGuestsChange = (guests: {
    adults?: number;
    children?: number;
    rooms?: number;
  }) => {
    setFilters({
      adults: guests.adults ?? filters.adults,
      children: guests.children ?? filters.children,
      rooms: guests.rooms ?? filters.rooms,
    });
    setApartmentFilters({
      beds: {
        min: (guests.adults || 2) + (guests.children || 0),
        max: filters.apartmentFilters.beds?.max,
      },
      rooms: {
        min: guests.rooms || 1,
        max: filters.apartmentFilters.rooms?.max,
      },
    });
    if (filters.propertyType === "hotel") {
      setHotelFilters({
        rooms: {
          min: guests.rooms || 1,
          max: filters.hotelFilters.rooms?.max,
        },
      });
    }
    setTimeout(() => applyFilters(), 0);
  };

  const handlePropertyClick = (id: number, isHotel: boolean) => {
    if (isHotel) {
      navigate(`/hotelReservation/${id}`);
    } else {
      navigate(`/apartmentReservation/${id}`);
    }
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

  const renderSkeletons = () =>
    Array.from({ length: 6 }).map((_, idx) => (
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
          <div className="alb-skeleton-pulse" style={{ height: 14, width: '40%', borderRadius: 2 }} />
          <div style={{ marginTop: 8, paddingTop: 12, borderTop: `1px solid ${tk.skeletonBorder}`, display: 'flex', justifyContent: 'space-between' }}>
            <div className="alb-skeleton-pulse" style={{ height: 14, width: '25%', borderRadius: 2 }} />
            <div className="alb-skeleton-pulse" style={{ height: 22, width: '30%', borderRadius: 2 }} />
          </div>
        </div>
      </div>
    ));

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
              Albania — Properties
            </p>
            <h1 className="alb-title" style={{ fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', color: tk.headingColor, lineHeight: 0.95, marginBottom: 0, transition: 'color 0.3s' }}>
              {t("searchResults.properties.title")}
            </h1>
            <div className="alb-red-line" style={{ marginTop: 16, width: 'min(200px, 40%)' }} />
          </div>
        </div>

        <main className="container mx-auto px-4 py-8" style={{ position: 'relative', zIndex: 1 }}>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filter Sidebar & Map Preview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flexShrink: 0 }}>
              <MapPreviewCard />
              <FilterBar
                filters={filters}
                onPropertyTypeChange={setPropertyType}
                onHotelFiltersChange={setHotelFilters}
                onApartmentFiltersChange={setApartmentFilters}
                onDateChange={handleDateChange}
                onGuestsChange={handleGuestsChange}
                onResetFilters={resetFilters}
                onApplyFilters={applyFilters}
                loading={loading}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1 w-full">
              {/* Result count */}
              {!loading && !error && (
                <div style={{ marginBottom: 28 }}>
                  <span className="alb-count-badge alb-body">
                    <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#E8192C', flexShrink: 0 }} />
                    {t("searchResults.properties.found", { count: results.combined.length })}
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
                  <button className="alb-retry-btn" onClick={applyFilters}>
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
              {!loading && !error && results.combined.length === 0 && (
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
                    <Building2 style={{ width: 32, height: 32, color: '#E8192C', opacity: 0.7 }} />
                  </div>
                  <h3 className="alb-title" style={{ fontSize: '1.8rem', color: tk.headingColor, marginBottom: 10, transition: 'color 0.3s' }}>
                    {t("searchResults.properties.emptyTitle")}
                  </h3>
                  <p className="alb-body" style={{ color: isDark ? 'rgba(240,236,232,0.5)' : 'rgba(26,10,13,0.55)', fontSize: '1.1rem', maxWidth: 360 }}>
                    {t("searchResults.properties.emptyDescription")}
                  </p>
                  <button
                    className="alb-clear-btn"
                    onClick={resetFilters}
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
                    {t("searchResults.properties.resetFilters")}
                  </button>
                </div>
              )}

              {/* Results Grid */}
              {!loading && !error && results.combined.length > 0 && (
                <div className="alb-card-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.combined.map((property, index) => {
                    const isHotel = "occupancy" in property;
                    const propertyType = isHotel ? "hotel" : "apartment";
                    const uniqueKey = `${propertyType}-${property.id}-${index}`;
                    return (
                      <div key={uniqueKey} style={{ animationDelay: `${index * 0.05}s`, animation: 'fadeUpGrid 0.5s ease both' }}>
                        <PropertyCard
                          id={property.id}
                          name={property.name}
                          image={property.imageUrls?.[0]}
                          rating={property.rating}
                          price={property.price}
                          location={property.location}
                          address={property.address}
                          rooms={property.rooms}
                          amenities={property.amenities || []}
                          status={property.status}
                          propertyType={propertyType}
                          onClick={() => handlePropertyClick(property.id, isHotel)}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SearchPropertyResults;
