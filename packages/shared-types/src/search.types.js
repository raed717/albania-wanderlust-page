/**
 * Search and Filter Type Definitions
 *
 * Unified types for search results page with dynamic filtering
 */
/**
 * Default filter values
 */
export const defaultSearchFilters = {
    propertyType: "both",
    hotelFilters: {
        searchTerm: "",
        priceRange: { min: 0, max: 500 },
        rating: "all",
        status: "all",
        rooms: { min: undefined, max: undefined },
        amenities: {
            wifi: false,
            parking: false,
            pool: false,
            gym: false,
            spa: false,
            restaurant: false,
            bar: false,
        },
    },
    appartmentFilters: {
        searchTerm: "",
        priceRange: { min: 0, max: 500 },
        rating: "all",
        status: "all",
        rooms: { min: undefined, max: undefined },
        beds: { min: undefined, max: undefined },
        bathrooms: { min: undefined, max: undefined },
        amenities: [],
    },
    destination: "",
    checkInDate: null,
    checkOutDate: null,
    adults: 2,
    children: 0,
    rooms: 1,
};
