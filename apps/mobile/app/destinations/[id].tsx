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

// Placeholder - replace with useDestination hook
const mockDestination = {
  id: "1",
  name: "Albanian Alps",
  description:
    "The Albanian Alps, also known as the Accursed Mountains, offer some of the most dramatic and unspoiled mountain scenery in Europe. With peaks reaching over 2,500 meters, pristine glacial lakes, and traditional villages, this is a paradise for hikers and nature lovers.",
  location: "Northern Albania",
  image_url: null,
  highlights: [
    "Hiking trails through pristine nature",
    "Traditional mountain villages",
    "Stunning glacial lakes",
    "Rich wildlife and flora",
  ],
};

export default function DestinationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const loading = false;
  const destination = mockDestination;

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading destination..." />;
  }

  if (!destination) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Destination not found</Text>
          <Button title="Go Back" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Image */}
      <View style={styles.imageContainer}>
        {destination.image_url ? (
          <Image source={{ uri: destination.image_url }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderIcon}>🏔️</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        {/* Title & Location */}
        <View style={styles.header}>
          <Text style={styles.title}>{destination.name}</Text>
          <View style={styles.locationRow}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.location}>{destination.location}</Text>
          </View>
        </View>

        {/* Description */}
        <Card style={styles.descriptionCard}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{destination.description}</Text>
        </Card>

        {/* Highlights */}
        {destination.highlights && destination.highlights.length > 0 && (
          <Card style={styles.highlightsCard}>
            <Text style={styles.sectionTitle}>Highlights</Text>
            {destination.highlights.map((highlight, index) => (
              <View key={index} style={styles.highlightItem}>
                <Text style={styles.highlightIcon}>✓</Text>
                <Text style={styles.highlightText}>{highlight}</Text>
              </View>
            ))}
          </Card>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.wishlistButton}>
            <Text style={styles.wishlistIcon}>❤️</Text>
            <Text style={styles.wishlistText}>Add to Wishlist</Text>
          </TouchableOpacity>
          <Button
            title="Explore Hotels Nearby"
            onPress={() => router.push("/(tabs)/explore")}
            style={styles.exploreButton}
          />
        </View>
      </View>
    </ScrollView>
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
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  location: {
    fontSize: 16,
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
  highlightsCard: {
    marginBottom: 20,
  },
  highlightItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  highlightIcon: {
    fontSize: 14,
    color: "#10b981",
    marginRight: 10,
    marginTop: 2,
  },
  highlightText: {
    flex: 1,
    fontSize: 15,
    color: "#4b5563",
  },
  actions: {
    gap: 12,
  },
  wishlistButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  wishlistIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  wishlistText: {
    fontSize: 16,
    color: "#1f2937",
    fontWeight: "500",
  },
  exploreButton: {
    marginTop: 4,
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
