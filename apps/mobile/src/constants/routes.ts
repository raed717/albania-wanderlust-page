export const ROUTES = {
  // Auth
  AUTH: "/(auth)",
  SIGN_IN: "/(auth)/sign-in",
  SIGN_UP: "/(auth)/sign-up",

  // Main tabs
  HOME: "/(tabs)",
  EXPLORE: "/(tabs)/explore",
  BOOKINGS: "/(tabs)/bookings",
  WISHLIST: "/(tabs)/wishlist",
  PROFILE: "/(tabs)/profile",

  // Destinations
  DESTINATIONS: "/destinations",
  DESTINATION_DETAILS: "/destinations/[id]",

  // Hotels
  HOTELS: "/hotels",
  HOTEL_DETAILS: "/hotels/[id]",
  HOTEL_BOOKING: "/hotels/[id]/book",

  // Apartments
  APARTMENTS: "/apartments",
  APARTMENT_DETAILS: "/apartments/[id]",

  // Cars
  CARS: "/cars",
  CAR_DETAILS: "/cars/[id]",

  // Bookings
  BOOKING_DETAILS: "/bookings/[id]",

  // Search
  SEARCH: "/search",
  SEARCH_RESULTS: "/search/results",
} as const;
