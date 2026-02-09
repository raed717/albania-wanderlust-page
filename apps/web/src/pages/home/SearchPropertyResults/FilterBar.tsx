import { useState } from "react";
import { ChevronDown, RotateCcw, Filter, Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  HotelFiltersInput,
  AppartmentFiltersInput,
  SearchFiltersState,
} from "@/types/search.types";

interface FilterBarProps {
  filters: SearchFiltersState;
  onPropertyTypeChange: (type: "hotel" | "apartment" | "both") => void;
  onHotelFiltersChange: (filters: Partial<HotelFiltersInput>) => void;
  onAppartmentFiltersChange: (filters: Partial<AppartmentFiltersInput>) => void;
  onDateChange: (dates: {
    checkInDate?: string | null;
    checkOutDate?: string | null;
  }) => void;
  onGuestsChange: (guests: {
    adults?: number;
    children?: number;
    rooms?: number;
  }) => void;
  onResetFilters: () => void;
  onApplyFilters: () => void;
  loading: boolean;
}

/**
 * FilterBar component for search results page
 * Supports dynamic filtering by property type with type-specific filter options
 */
export const FilterBar = ({
  filters,
  onPropertyTypeChange,
  onHotelFiltersChange,
  onAppartmentFiltersChange,
  onDateChange,
  onGuestsChange,
  onResetFilters,
  onApplyFilters,
  loading,
}: FilterBarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Count active filters
  const countActiveFilters = (): number => {
    let count = 0;
    const hf = filters.hotelFilters;
    const af = filters.appartmentFilters;

    // Date filters
    if (filters.checkInDate || filters.checkOutDate) count++;

    // Guests filters
    if (filters.adults || filters.children || filters.rooms) count++;

    // Hotel filters
    if (hf.searchTerm) count++;
    if (hf.rating !== "all") count++;
    if (hf.status !== "all") count++;
    if (hf.rooms?.min || hf.rooms?.max) count++;
    if (hf.priceRange?.min !== 0 || hf.priceRange?.max !== 500) count++;
    if (hf.amenities && Object.values(hf.amenities).some((v) => v)) count++;

    // Apartment filters
    if (af.searchTerm) count++;
    if (af.rating !== "all") count++;
    if (af.status !== "all") count++;
    if (af.rooms?.min || af.rooms?.max) count++;
    if (af.beds?.min || af.beds?.max) count++;
    if (af.bathrooms?.min || af.bathrooms?.max) count++;
    if (af.priceRange?.min !== 0 || af.priceRange?.max !== 500) count++;
    if (af.amenities && af.amenities.length > 0) count++;

    return count;
  };

  const activeFiltersCount = countActiveFilters();

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden mb-4 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </div>

      {/* Filter Sidebar */}
      <aside
        className={`${
          isOpen ? "block" : "hidden"
        } lg:block w-full lg:w-64 lg:border-r lg:pr-6 space-y-6`}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-0.5">
                {activeFiltersCount}
              </span>
            )}
          </h2>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="text-xs flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {/* Property Type Selector */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Property Type</h3>
            <div className="flex gap-2">
              {(["both", "hotel", "apartment"] as const).map((type) => (
                <Button
                  key={type}
                  variant={
                    filters.propertyType === type ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => onPropertyTypeChange(type)}
                  className="flex-1 capitalize"
                >
                  {type === "both" ? "All" : type}
                </Button>
              ))}
            </div>
          </div>

          {/* Shared Filters */}
          <Accordion type="single" collapsible defaultValue="search">
            {/* Search */}
            <AccordionItem value="search">
              <AccordionTrigger className="text-sm font-semibold">
                Search
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <Input
                  placeholder="Name or location..."
                  value={
                    filters.propertyType === "hotel"
                      ? filters.hotelFilters.searchTerm || ""
                      : filters.propertyType === "apartment"
                        ? filters.appartmentFilters.searchTerm || ""
                        : filters.hotelFilters.searchTerm ||
                          filters.appartmentFilters.searchTerm ||
                          ""
                  }
                  onChange={(e) => {
                    if (filters.propertyType === "hotel") {
                      onHotelFiltersChange({ searchTerm: e.target.value });
                    } else if (filters.propertyType === "apartment") {
                      onAppartmentFiltersChange({ searchTerm: e.target.value });
                    } else {
                      // Property type is "both" - update both filters
                      onHotelFiltersChange({ searchTerm: e.target.value });
                      onAppartmentFiltersChange({ searchTerm: e.target.value });
                    }
                  }}
                  className="text-sm"
                />
              </AccordionContent>
            </AccordionItem>

            {/* Stay Dates */}
            <AccordionItem value="dates">
              <AccordionTrigger className="text-sm font-semibold">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Stay Dates
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-600">Check-in Date</Label>
                  <Input
                    type="date"
                    value={
                      filters.checkInDate
                        ? new Date(filters.checkInDate)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) => {
                      const date = e.target.value
                        ? new Date(e.target.value).toISOString()
                        : null;
                      onDateChange({ checkInDate: date });
                    }}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-600">
                    Check-out Date
                  </Label>
                  <Input
                    type="date"
                    value={
                      filters.checkOutDate
                        ? new Date(filters.checkOutDate)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    min={
                      filters.checkInDate
                        ? new Date(filters.checkInDate)
                            .toISOString()
                            .split("T")[0]
                        : undefined
                    }
                    onChange={(e) => {
                      const date = e.target.value
                        ? new Date(e.target.value).toISOString()
                        : null;
                      onDateChange({ checkOutDate: date });
                    }}
                    className="text-sm"
                  />
                </div>
                {(filters.checkInDate || filters.checkOutDate) && (
                  <p className="text-xs text-blue-600 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Showing properties available for selected dates
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Guests */}
            <AccordionItem value="guests">
              <AccordionTrigger className="text-sm font-semibold">
                Guests
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-600">Adults</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      min="1"
                      value={filters.adults || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        const adults = val ? parseInt(val) : 0;
                        const children = filters.children || 0;
                        onGuestsChange({
                          adults,
                          children,
                          rooms: filters.rooms,
                        });
                        // Update apartment beds min to adults + children
                        onAppartmentFiltersChange({
                          beds: {
                            min: adults + children,
                            max: filters.appartmentFilters.beds?.max,
                          },
                        });
                      }}
                      className="text-sm pr-8"
                    />
                    {filters.adults ? (
                      <button
                        onClick={() => {
                          const children = filters.children || 0;
                          onGuestsChange({
                            adults: 0,
                            children,
                            rooms: filters.rooms,
                          });
                          onAppartmentFiltersChange({
                            beds: {
                              min: children,
                              max: filters.appartmentFilters.beds?.max,
                            },
                          });
                        }}
                        className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-600">Children</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      value={filters.children || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        const children = val ? parseInt(val) : 0;
                        const adults = filters.adults || 2;
                        onGuestsChange({
                          adults,
                          children,
                          rooms: filters.rooms,
                        });
                        // Update apartment beds min to adults + children
                        onAppartmentFiltersChange({
                          beds: {
                            min: adults + children,
                            max: filters.appartmentFilters.beds?.max,
                          },
                        });
                      }}
                      className="text-sm pr-8"
                    />
                    {filters.children ? (
                      <button
                        onClick={() => {
                          const adults = filters.adults || 2;
                          onGuestsChange({
                            adults,
                            children: 0,
                            rooms: filters.rooms,
                          });
                          onAppartmentFiltersChange({
                            beds: {
                              min: adults,
                              max: filters.appartmentFilters.beds?.max,
                            },
                          });
                        }}
                        className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-600">Rooms</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      min="1"
                      value={filters.rooms || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        const rooms = val ? parseInt(val) : 0;
                        onGuestsChange({
                          adults: filters.adults,
                          children: filters.children,
                          rooms,
                        });
                        // Update apartment rooms min to rooms
                        onAppartmentFiltersChange({
                          rooms: {
                            min: rooms,
                            max: filters.appartmentFilters.rooms?.max,
                          },
                        });
                      }}
                      className="text-sm pr-8"
                    />
                    {filters.rooms ? (
                      <button
                        onClick={() => {
                          onGuestsChange({
                            adults: filters.adults,
                            children: filters.children,
                            rooms: 0,
                          });
                          onAppartmentFiltersChange({
                            rooms: {
                              min: 0,
                              max: filters.appartmentFilters.rooms?.max,
                            },
                          });
                        }}
                        className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                </div>
                {(filters.adults || filters.children || filters.rooms) && (
                  <p className="text-xs text-blue-600 flex items-center gap-1">
                    <Filter className="w-3 h-3" />
                    Filtering apartments by beds ≥ {filters.adults || 2} +{" "}
                    {filters.children || 0} and rooms ≥ {filters.rooms || 1}
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Price Range */}
            <AccordionItem value="price">
              <AccordionTrigger className="text-sm font-semibold">
                Price Range
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>€{filters.hotelFilters.priceRange?.min || 0}</span>
                    <span>€{filters.hotelFilters.priceRange?.max || 500}</span>
                  </div>
                  <Slider
                    min={0}
                    max={500}
                    step={10}
                    value={[
                      filters.hotelFilters.priceRange?.min || 0,
                      filters.hotelFilters.priceRange?.max || 500,
                    ]}
                    onValueChange={(value) => {
                      if (filters.propertyType === "hotel") {
                        onHotelFiltersChange({
                          priceRange: { min: value[0], max: value[1] },
                        });
                      } else if (filters.propertyType === "apartment") {
                        onAppartmentFiltersChange({
                          priceRange: { min: value[0], max: value[1] },
                        });
                      } else {
                        // Property type is "both" - update both filters
                        onHotelFiltersChange({
                          priceRange: { min: value[0], max: value[1] },
                        });
                        onAppartmentFiltersChange({
                          priceRange: { min: value[0], max: value[1] },
                        });
                      }
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {filters.propertyType === "hotel" ? "per night" : "per day"}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Rating */}
            <AccordionItem value="rating">
              <AccordionTrigger className="text-sm font-semibold">
                Rating
              </AccordionTrigger>
              <AccordionContent className="space-y-2">
                <Select
                  value={
                    filters.propertyType === "hotel"
                      ? filters.hotelFilters.rating || "all"
                      : filters.appartmentFilters.rating || "all"
                  }
                  onValueChange={(value) => {
                    if (filters.propertyType === "hotel") {
                      onHotelFiltersChange({
                        rating: value as any,
                      });
                    } else if (filters.propertyType === "apartment") {
                      onAppartmentFiltersChange({
                        rating: value as any,
                      });
                    } else {
                      // Property type is "both" - update both filters
                      onHotelFiltersChange({
                        rating: value as any,
                      });
                      onAppartmentFiltersChange({
                        rating: value as any,
                      });
                    }
                  }}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="3+">3+</SelectItem>
                    <SelectItem value="3.5+">3.5+</SelectItem>
                    <SelectItem value="4+">4+</SelectItem>
                    <SelectItem value="4.5+">4.5+</SelectItem>
                  </SelectContent>
                </Select>
              </AccordionContent>
            </AccordionItem>

            {/* Availability Status */}
            <AccordionItem value="status">
              <AccordionTrigger className="text-sm font-semibold">
                Availability
              </AccordionTrigger>
              <AccordionContent className="space-y-2">
                <Select
                  value={
                    filters.propertyType === "hotel"
                      ? filters.hotelFilters.status || "all"
                      : filters.appartmentFilters.status || "all"
                  }
                  onValueChange={(value) => {
                    if (filters.propertyType === "hotel") {
                      onHotelFiltersChange({
                        status: value as any,
                      });
                    } else if (filters.propertyType === "apartment") {
                      onAppartmentFiltersChange({
                        status: value as any,
                      });
                    } else {
                      // Property type is "both" - update both filters
                      onHotelFiltersChange({
                        status: value as any,
                      });
                      onAppartmentFiltersChange({
                        status: value as any,
                      });
                    }
                  }}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {filters.propertyType === "hotel" ? (
                      <>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="rented">Rented</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </AccordionContent>
            </AccordionItem>

            {/* Rooms (if hotel or both) */}
            {(filters.propertyType === "hotel" ||
              filters.propertyType === "both") && (
              <AccordionItem value="rooms">
                <AccordionTrigger className="text-sm font-semibold">
                  Rooms
                </AccordionTrigger>
                <AccordionContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs mb-1 block">Min</Label>
                      <Input
                        type="number"
                        placeholder="Min"
                        value={filters.hotelFilters.rooms?.min || ""}
                        onChange={(e) =>
                          onHotelFiltersChange({
                            rooms: {
                              min: e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                              max: filters.hotelFilters.rooms?.max,
                            },
                          })
                        }
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs mb-1 block">Max</Label>
                      <Input
                        type="number"
                        placeholder="Max"
                        value={filters.hotelFilters.rooms?.max || ""}
                        onChange={(e) =>
                          onHotelFiltersChange({
                            rooms: {
                              min: filters.hotelFilters.rooms?.min,
                              max: e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                            },
                          })
                        }
                        className="text-sm"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Hotel Amenities (if hotel or both) */}
            {(filters.propertyType === "hotel" ||
              filters.propertyType === "both") && (
              <AccordionItem value="hotel-amenities">
                <AccordionTrigger className="text-sm font-semibold">
                  Amenities
                </AccordionTrigger>
                <AccordionContent className="space-y-3">
                  {[
                    { id: "wifi", label: "WiFi" },
                    { id: "parking", label: "Parking" },
                    { id: "pool", label: "Swimming Pool" },
                    { id: "gym", label: "Gym" },
                    { id: "spa", label: "Spa" },
                    { id: "restaurant", label: "Restaurant" },
                    { id: "bar", label: "Bar" },
                  ].map((amenity) => (
                    <div
                      key={amenity.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={amenity.id}
                        checked={
                          filters.hotelFilters.amenities?.[
                            amenity.id as keyof typeof filters.hotelFilters.amenities
                          ] || false
                        }
                        onCheckedChange={(checked) =>
                          onHotelFiltersChange({
                            amenities: {
                              ...filters.hotelFilters.amenities,
                              [amenity.id]: checked,
                            },
                          })
                        }
                      />
                      <Label
                        htmlFor={amenity.id}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {amenity.label}
                      </Label>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Apartment Rooms (if apartment or both) */}
            {(filters.propertyType === "apartment" ||
              filters.propertyType === "both") && (
              <>
                <AccordionItem value="apt-rooms">
                  <AccordionTrigger className="text-sm font-semibold">
                    Rooms
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs mb-1 block">Min</Label>
                        <Input
                          type="number"
                          placeholder="Min"
                          value={
                            filters.appartmentFilters.rooms?.min ||
                            filters.rooms ||
                            ""
                          }
                          onChange={(e) =>
                            onAppartmentFiltersChange({
                              rooms: {
                                min: e.target.value
                                  ? parseInt(e.target.value)
                                  : undefined,
                                max: filters.appartmentFilters.rooms?.max,
                              },
                            })
                          }
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs mb-1 block">Max</Label>
                        <Input
                          type="number"
                          placeholder="Max"
                          value={filters.appartmentFilters.rooms?.max || ""}
                          onChange={(e) =>
                            onAppartmentFiltersChange({
                              rooms: {
                                min: filters.appartmentFilters.rooms?.min,
                                max: e.target.value
                                  ? parseInt(e.target.value)
                                  : undefined,
                              },
                            })
                          }
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="apt-beds">
                  <AccordionTrigger className="text-sm font-semibold">
                    Beds
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs mb-1 block">Min</Label>
                        <Input
                          type="number"
                          placeholder="Min"
                          value={filters.appartmentFilters.beds?.min || ""}
                          onChange={(e) =>
                            onAppartmentFiltersChange({
                              beds: {
                                min: e.target.value
                                  ? parseInt(e.target.value)
                                  : undefined,
                                max: filters.appartmentFilters.beds?.max,
                              },
                            })
                          }
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs mb-1 block">Max</Label>
                        <Input
                          type="number"
                          placeholder="Max"
                          value={filters.appartmentFilters.beds?.max || ""}
                          onChange={(e) =>
                            onAppartmentFiltersChange({
                              beds: {
                                min: filters.appartmentFilters.beds?.min,
                                max: e.target.value
                                  ? parseInt(e.target.value)
                                  : undefined,
                              },
                            })
                          }
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="apt-bathrooms">
                  <AccordionTrigger className="text-sm font-semibold">
                    Bathrooms
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs mb-1 block">Min</Label>
                        <Input
                          type="number"
                          placeholder="Min"
                          value={filters.appartmentFilters.bathrooms?.min || ""}
                          onChange={(e) =>
                            onAppartmentFiltersChange({
                              bathrooms: {
                                min: e.target.value
                                  ? parseInt(e.target.value)
                                  : undefined,
                                max: filters.appartmentFilters.bathrooms?.max,
                              },
                            })
                          }
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs mb-1 block">Max</Label>
                        <Input
                          type="number"
                          placeholder="Max"
                          value={filters.appartmentFilters.bathrooms?.max || ""}
                          onChange={(e) =>
                            onAppartmentFiltersChange({
                              bathrooms: {
                                min: filters.appartmentFilters.bathrooms?.min,
                                max: e.target.value
                                  ? parseInt(e.target.value)
                                  : undefined,
                              },
                            })
                          }
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </>
            )}
          </Accordion>
        </div>

        {/* Apply Button */}
        <div className="pt-4 border-t">
          <Button
            onClick={onApplyFilters}
            disabled={loading}
            className="w-full"
            size="sm"
          >
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>
      </aside>
    </>
  );
};

export default FilterBar;
