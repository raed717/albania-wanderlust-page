import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Input } from "../../src/components/ui/Input";
import { Card } from "../../src/components/ui/Card";
import { useDestinations } from "../../src/hooks/useDestinations";
import { useHotels } from "../../src/hooks/useHotels";
import { useCars } from "../../src/hooks/useCars";

type CategoryType = "all" | "destinations" | "hotels" | "apartments" | "cars";

export default function ExploreScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryType>("all");

  const { destinations, loading: destinationsLoading } = useDestinations();
  const { hotels, loading: hotelsLoading } = useHotels();
  const { cars, loading: carsLoading } = useCars();

  const isLoading = destinationsLoading || hotelsLoading || carsLoading;

  // Filter data based on search query
  const filteredDestinations = destinations.filter(
    (d) =>
      d.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredHotels = hotels.filter(
    (h) =>
      h.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.location?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredCars = cars.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.pickUpLocation?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const categories: { id: CategoryType; label: string; icon: string }[] = [
    { id: "all", label: "All", icon: "🌍" },
    { id: "destinations", label: "Destinations", icon: "🏔️" },
    { id: "hotels", label: "Hotels", icon: "🏨" },
    { id: "apartments", label: "Apartments", icon: "🏢" },
    { id: "cars", label: "Cars", icon: "🚗" },
  ];

  const showDestinations =
    activeCategory === "all" || activeCategory === "destinations";
  const showHotels = activeCategory === "all" || activeCategory === "hotels";
  const showCars = activeCategory === "all" || activeCategory === "cars";

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.subtitle}>Find amazing places to visit</Text>
      </View>

      <View style={styles.searchContainer}>
        <Input
          placeholder="Search destinations, hotels..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={styles.searchInput}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              activeCategory === category.id && styles.categoryChipActive,
            ]}
            onPress={() => setActiveCategory(category.id)}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text
              style={[
                styles.categoryLabel,
                activeCategory === category.id && styles.categoryLabelActive,
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          <>
            {/* Destinations Section */}
            {showDestinations && filteredDestinations.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Popular Destinations</Text>
                {filteredDestinations.slice(0, 5).map((destination) => (
                  <TouchableOpacity
                    key={destination.id}
                    onPress={() =>
                      router.push(`/destinations/${destination.id}` as any)
                    }
                    activeOpacity={0.8}
                  >
                    <Card style={styles.placeCard}>
                      {destination.imageUrls?.[0] ? (
                        <Image
                          source={{ uri: destination.imageUrls[0] }}
                          style={styles.cardImage}
                        />
                      ) : (
                        <View style={styles.placeholderImage}>
                          <Text style={styles.placeholderIcon}>🏔️</Text>
                        </View>
                      )}
                      <View style={styles.placeInfo}>
                        <Text style={styles.placeName}>{destination.name}</Text>
                        <Text style={styles.placeLocation}>
                          📍 {destination.name}
                        </Text>
                      </View>
                    </Card>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Hotels Section */}
            {showHotels && filteredHotels.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Featured Hotels</Text>
                {filteredHotels.slice(0, 5).map((hotel) => (
                  <TouchableOpacity
                    key={hotel.id}
                    onPress={() => router.push(`/hotels/${hotel.id}` as any)}
                    activeOpacity={0.8}
                  >
                    <Card style={styles.placeCard}>
                      {hotel.imageUrls?.[0] ? (
                        <Image
                          source={{ uri: hotel.imageUrls[0] }}
                          style={styles.cardImage}
                        />
                      ) : (
                        <View style={styles.placeholderImage}>
                          <Text style={styles.placeholderIcon}>🏨</Text>
                        </View>
                      )}
                      <View style={styles.placeInfo}>
                        <Text style={styles.placeName}>{hotel.name}</Text>
                        <Text style={styles.placeLocation}>
                          📍 {hotel.location}
                        </Text>
                        <View style={styles.priceRatingRow}>
                          <Text style={styles.placePrice}>
                            ${hotel.price} / night
                          </Text>
                          {hotel.rating > 0 && (
                            <Text style={styles.rating}>⭐ {hotel.rating}</Text>
                          )}
                        </View>
                      </View>
                    </Card>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Cars Section */}
            {showCars && filteredCars.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Available Cars</Text>
                {filteredCars.slice(0, 5).map((car) => (
                  <TouchableOpacity
                    key={car.id}
                    onPress={() => router.push(`/cars/${car.id}` as any)}
                    activeOpacity={0.8}
                  >
                    <Card style={styles.placeCard}>
                      {car.imageUrls?.[0] ? (
                        <Image
                          source={{ uri: car.imageUrls[0] }}
                          style={styles.cardImage}
                        />
                      ) : (
                        <View style={styles.placeholderImage}>
                          <Text style={styles.placeholderIcon}>🚗</Text>
                        </View>
                      )}
                      <View style={styles.placeInfo}>
                        <Text style={styles.placeName}>
                          {car.brand} {car.name}
                        </Text>
                        <Text style={styles.placeLocation}>
                          📍 {car.pickUpLocation}
                        </Text>
                        <View style={styles.priceRatingRow}>
                          <Text style={styles.placePrice}>
                            ${car.pricePerDay} / day
                          </Text>
                          <Text style={styles.carDetails}>
                            {car.transmission} · {car.seats} seats
                          </Text>
                        </View>
                      </View>
                    </Card>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Empty state */}
            {!isLoading &&
              filteredDestinations.length === 0 &&
              filteredHotels.length === 0 &&
              filteredCars.length === 0 && (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyIcon}>🔍</Text>
                  <Text style={styles.emptyText}>No results found</Text>
                  <Text style={styles.emptySubtext}>
                    Try adjusting your search or filters
                  </Text>
                </View>
              )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
  },
  searchInput: {
    marginBottom: 0,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 10,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginRight: 10,
  },
  categoryChipActive: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryLabel: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  categoryLabelActive: {
    color: "#ffffff",
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6b7280",
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 12,
  },
  placeCard: {
    padding: 0,
    marginBottom: 12,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 120,
  },
  placeholderImage: {
    height: 120,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderIcon: {
    fontSize: 48,
  },
  placeInfo: {
    padding: 12,
  },
  placeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  placeLocation: {
    fontSize: 13,
    color: "#6b7280",
  },
  priceRatingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  placePrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2563eb",
  },
  rating: {
    fontSize: 13,
    color: "#b45309",
    fontWeight: "600",
  },
  carDetails: {
    fontSize: 12,
    color: "#6b7280",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
});
