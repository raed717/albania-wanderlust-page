import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Card } from "../../src/components/ui/Card";
import { Button } from "../../src/components/ui/Button";
import { LoadingSpinner } from "../../src/components/ui/LoadingSpinner";

// Placeholder - replace with useApartment hook
const mockApartment = {
  id: "1",
  name: "Seaside Apartment",
  description:
    "Beautiful seaside apartment with stunning views of the Albanian Riviera. Perfect for couples or small families looking for a relaxing getaway.",
  location: "Saranda, Albania",
  rating: 4.6,
  price_per_night: 105,
  images: [],
  bedrooms: 2,
  bathrooms: 1,
  max_guests: 4,
  amenities: [
    "Free WiFi",
    "Kitchen",
    "Air conditioning",
    "Sea view",
    "Balcony",
    "Washing machine",
  ],
};

export default function ApartmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const loading = false;
  const apartment = mockApartment;

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading apartment..." />;
  }

  if (!apartment) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Apartment not found</Text>
          <Button title="Go Back" onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          {apartment.images?.[0] ? (
            <Image source={{ uri: apartment.images[0] }} style={styles.image} />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderIcon}>🏢</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          {/* Title & Rating */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{apartment.name}</Text>
              {apartment.rating && (
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>⭐ {apartment.rating}</Text>
                </View>
              )}
            </View>
            <View style={styles.locationRow}>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.location}>{apartment.location}</Text>
            </View>
          </View>

          {/* Quick Info */}
          <Card style={styles.quickInfoCard}>
            <View style={styles.quickInfoRow}>
              <View style={styles.quickInfoItem}>
                <Text style={styles.quickInfoIcon}>🛏️</Text>
                <Text style={styles.quickInfoValue}>{apartment.bedrooms}</Text>
                <Text style={styles.quickInfoLabel}>Bedrooms</Text>
              </View>
              <View style={styles.quickInfoItem}>
                <Text style={styles.quickInfoIcon}>🚿</Text>
                <Text style={styles.quickInfoValue}>{apartment.bathrooms}</Text>
                <Text style={styles.quickInfoLabel}>Bathrooms</Text>
              </View>
              <View style={styles.quickInfoItem}>
                <Text style={styles.quickInfoIcon}>👥</Text>
                <Text style={styles.quickInfoValue}>
                  {apartment.max_guests}
                </Text>
                <Text style={styles.quickInfoLabel}>Guests</Text>
              </View>
            </View>
          </Card>

          {/* Description */}
          <Card style={styles.descriptionCard}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{apartment.description}</Text>
          </Card>

          {/* Amenities */}
          {apartment.amenities && apartment.amenities.length > 0 && (
            <Card style={styles.amenitiesCard}>
              <Text style={styles.sectionTitle}>Amenities</Text>
              <View style={styles.amenitiesGrid}>
                {apartment.amenities.map((amenity, index) => (
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
          <Text style={styles.bottomPriceValue}>
            ${apartment.price_per_night}
          </Text>
          <Text style={styles.bottomPriceUnit}>/ night</Text>
        </View>
        <Button title="Book Now" onPress={() => {}} style={styles.bookButton} />
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
  quickInfoCard: {
    marginBottom: 16,
  },
  quickInfoRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  quickInfoItem: {
    alignItems: "center",
  },
  quickInfoIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  quickInfoValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  quickInfoLabel: {
    fontSize: 12,
    color: "#6b7280",
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
