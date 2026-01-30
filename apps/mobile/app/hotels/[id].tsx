import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../src/components/ui/Card";
import { Button } from "../../src/components/ui/Button";
import { LoadingSpinner } from "../../src/components/ui/LoadingSpinner";
import { useHotel } from "../../src/hooks/useHotels";

export default function HotelDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { hotel, loading, error } = useHotel(id || "");

  // Build amenities list from boolean fields and amenities array
  const getAmenitiesList = () => {
    if (!hotel) return [];
    const amenities: string[] = [];
    if (hotel.wifi) amenities.push("Free WiFi");
    if (hotel.parking) amenities.push("Free Parking");
    if (hotel.pool) amenities.push("Swimming Pool");
    if (hotel.gym) amenities.push("Fitness Center");
    if (hotel.spa) amenities.push("Spa");
    if (hotel.restaurant) amenities.push("Restaurant");
    if (hotel.bar) amenities.push("Bar");
    if (hotel.amenities) amenities.push(...hotel.amenities);
    return amenities;
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading hotel..." />;
  }

  if (error || !hotel) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error?.message || "Hotel not found"}
          </Text>
          <Button title="Go Back" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const amenitiesList = getAmenitiesList();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          {hotel.imageUrls?.[0] ? (
            <Image source={{ uri: hotel.imageUrls[0] }} style={styles.image} />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderIcon}>🏨</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          {/* Title & Rating */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{hotel.name}</Text>
              {hotel.rating > 0 && (
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>⭐ {hotel.rating}</Text>
                </View>
              )}
            </View>
            <View style={styles.locationRow}>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.location}>{hotel.location}</Text>
            </View>
          </View>

          {/* Price */}
          <Card style={styles.priceCard}>
            <View style={styles.priceRow}>
              <View>
                <Text style={styles.priceLabel}>Price per night</Text>
                <Text style={styles.price}>${hotel.price}</Text>
              </View>
              {hotel.rooms > 0 && (
                <Text style={styles.availability}>
                  {hotel.rooms} rooms available
                </Text>
              )}
            </View>
          </Card>

          {/* Description */}
          {hotel.description && (
            <Card style={styles.descriptionCard}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.description}>{hotel.description}</Text>
            </Card>
          )}

          {/* Contact Info */}
          {(hotel.contactEmail || hotel.contactPhone || hotel.address) && (
            <Card style={styles.contactCard}>
              <Text style={styles.sectionTitle}>Contact</Text>
              {hotel.address && (
                <View style={styles.contactItem}>
                  <Text style={styles.contactIcon}>📍</Text>
                  <Text style={styles.contactText}>{hotel.address}</Text>
                </View>
              )}
              {hotel.contactPhone && (
                <View style={styles.contactItem}>
                  <Text style={styles.contactIcon}>📞</Text>
                  <Text style={styles.contactText}>{hotel.contactPhone}</Text>
                </View>
              )}
              {hotel.contactEmail && (
                <View style={styles.contactItem}>
                  <Text style={styles.contactIcon}>✉️</Text>
                  <Text style={styles.contactText}>{hotel.contactEmail}</Text>
                </View>
              )}
            </Card>
          )}

          {/* Amenities */}
          {amenitiesList.length > 0 && (
            <Card style={styles.amenitiesCard}>
              <Text style={styles.sectionTitle}>Amenities</Text>
              <View style={styles.amenitiesGrid}>
                {amenitiesList.map((amenity, index) => (
                  <View key={index} style={styles.amenityItem}>
                    <Text style={styles.amenityIcon}>✓</Text>
                    <Text style={styles.amenityText}>{amenity}</Text>
                  </View>
                ))}
              </View>
            </Card>
          )}
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPrice}>
          <Text style={styles.bottomPriceValue}>${hotel.price}</Text>
          <Text style={styles.bottomPriceUnit}>/ night</Text>
        </View>
        <Button
          title="Book Now"
          onPress={() => router.push(`/hotels/${id}/book` as any)}
          style={styles.bookButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  imageContainer: {
    height: 250,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderIcon: {
    fontSize: 80,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginRight: 12,
  },
  ratingBadge: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#b45309",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  location: {
    fontSize: 14,
    color: "#6b7280",
  },
  priceCard: {
    marginBottom: 16,
    backgroundColor: "#2563eb",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 13,
    color: "#bfdbfe",
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
  },
  availability: {
    fontSize: 13,
    color: "#bfdbfe",
  },
  descriptionCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: "#4b5563",
    lineHeight: 24,
  },
  contactCard: {
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  contactIcon: {
    fontSize: 14,
    marginRight: 10,
  },
  contactText: {
    fontSize: 14,
    color: "#4b5563",
    flex: 1,
  },
  amenitiesCard: {
    marginBottom: 16,
  },
  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  amenityItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    marginBottom: 10,
  },
  amenityIcon: {
    fontSize: 12,
    color: "#10b981",
    marginRight: 8,
  },
  amenityText: {
    fontSize: 14,
    color: "#4b5563",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  bottomPrice: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  bottomPriceValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
  },
  bottomPriceUnit: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 4,
  },
  bookButton: {
    paddingHorizontal: 32,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#6b7280",
    marginBottom: 20,
  },
});
