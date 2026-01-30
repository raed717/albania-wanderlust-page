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
import { useCar } from "../../src/hooks/useCars";

export default function CarDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { car, loading, error } = useCar(id || "");

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading car details..." />;
  }

  if (error || !car) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error?.message || "Car not found"}
          </Text>
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
          {car.imageUrls?.[0] ? (
            <Image source={{ uri: car.imageUrls[0] }} style={styles.image} />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderIcon}>🚗</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          {/* Title */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {car.brand} {car.name}
            </Text>
            <Text style={styles.year}>{car.year}</Text>
            <View style={styles.locationRow}>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.location}>Pick up: {car.pickUpLocation}</Text>
            </View>
          </View>

          {/* Quick Info */}
          <Card style={styles.quickInfoCard}>
            <View style={styles.quickInfoRow}>
              <View style={styles.quickInfoItem}>
                <Text style={styles.quickInfoIcon}>👥</Text>
                <Text style={styles.quickInfoValue}>{car.seats}</Text>
                <Text style={styles.quickInfoLabel}>Seats</Text>
              </View>
              <View style={styles.quickInfoItem}>
                <Text style={styles.quickInfoIcon}>⚙️</Text>
                <Text style={styles.quickInfoValue}>{car.transmission}</Text>
                <Text style={styles.quickInfoLabel}>Transmission</Text>
              </View>
              <View style={styles.quickInfoItem}>
                <Text style={styles.quickInfoIcon}>⛽</Text>
                <Text style={styles.quickInfoValue}>{car.fuelType}</Text>
                <Text style={styles.quickInfoLabel}>Fuel</Text>
              </View>
            </View>
          </Card>

          {/* Additional Info */}
          <Card style={styles.descriptionCard}>
            <Text style={styles.sectionTitle}>Details</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Type</Text>
                <Text style={styles.detailValue}>{car.type}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Color</Text>
                <Text style={styles.detailValue}>{car.color}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Mileage</Text>
                <Text style={styles.detailValue}>
                  {car.mileage.toLocaleString()} km
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Status</Text>
                <Text style={styles.detailValue}>{car.status}</Text>
              </View>
            </View>
          </Card>

          {/* Features */}
          {car.features && car.features.length > 0 && (
            <Card style={styles.featuresCard}>
              <Text style={styles.sectionTitle}>Features</Text>
              <View style={styles.featuresGrid}>
                {car.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Text style={styles.featureIcon}>✓</Text>
                    <Text style={styles.featureText}>{feature}</Text>
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
          <Text style={styles.bottomPriceValue}>${car.pricePerDay}</Text>
          <Text style={styles.bottomPriceUnit}>/ day</Text>
        </View>
        <Button title="Rent Now" onPress={() => {}} style={styles.rentButton} />
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
  },
  year: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 2,
    marginBottom: 8,
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
    fontSize: 14,
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
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  detailItem: {
    width: "50%",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    textTransform: "capitalize",
  },
  description: {
    fontSize: 15,
    color: "#4b5563",
    lineHeight: 24,
  },
  featuresCard: {
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    marginBottom: 10,
  },
  featureIcon: {
    fontSize: 12,
    color: "#10b981",
    marginRight: 8,
  },
  featureText: {
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
  rentButton: {
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
