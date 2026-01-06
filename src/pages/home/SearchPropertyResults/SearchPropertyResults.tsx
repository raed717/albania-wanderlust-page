import { useEffect } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import PrimarySearchAppBar from "@/components/home/AppBar";
import FilterBar from "./FilterBar";
import { PropertyCard } from "@/components/home/PropertyCard";
import { useSearchFilters } from "@/hooks/useSearchFilters";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Hotel } from "@/types/hotel.types";
import { Appartment } from "@/types/appartment.type";

const SearchPropertyResults = () => {
  const {
    filters,
    results,
    loading,
    error,
    setPropertyType,
    setHotelFilters,
    setAppartmentFilters,
    resetFilters,
    applyFilters,
  } = useSearchFilters();

  // Fetch properties on component mount
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Handle property click
  const handlePropertyClick = (id: number, isHotel: boolean) => {
    // Navigate to property details page
    console.log("Navigate to property details:", id);
    if (isHotel) {
      window.open(`/hotelReservation/${id}`, "_blank", "noopener,noreferrer");
    } else {
      window.open(
        `/appartmentReservation/${id}`,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  // Render skeleton loaders
  const renderSkeletons = () => {
    return Array.from({ length: 8 }).map((_, idx) => (
      <div key={idx} className="space-y-3">
        <Skeleton className="h-48 w-full rounded-lg" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    ));
  };

  // Render empty state
  const renderEmptyState = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-16">
      <div className="text-center space-y-3">
        <h3 className="text-xl font-semibold text-gray-900">
          No properties found
        </h3>
        <p className="text-gray-600 max-w-sm">
          Try adjusting your filters or search criteria to find more properties
        </p>
        <button
          onClick={resetFilters}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <PrimarySearchAppBar />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar */}
          <FilterBar
            filters={filters}
            onPropertyTypeChange={setPropertyType}
            onHotelFiltersChange={setHotelFilters}
            onAppartmentFiltersChange={setAppartmentFilters}
            onResetFilters={resetFilters}
            onApplyFilters={applyFilters}
            loading={loading}
          />

          {/* Results Section */}
          <div className="flex-1 w-full">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Search Results
              </h1>
              {!loading && results.combined.length > 0 && (
                <p className="text-gray-600">
                  Found{" "}
                  <span className="font-semibold">
                    {results.combined.length}
                  </span>{" "}
                  properties matching your criteria
                </p>
              )}
            </div>

            {/* Error State */}
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {renderSkeletons()}
              </div>
            )}

            {/* Empty State */}
            {!loading && results.combined.length === 0 && renderEmptyState()}

            {/* Results Grid */}
            {!loading && results.combined.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.combined.map((property, index) => {
                  const isHotel = "occupancy" in property;
                  const propertyType = isHotel ? "hotel" : "apartment";
                  // Use a truly unique key combining type, id, and index
                  const uniqueKey = `${propertyType}-${property.id}-${index}`;

                  return (
                    <PropertyCard
                      key={uniqueKey}
                      id={property.id}
                      name={property.name}
                      image={property.image}
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
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchPropertyResults;
