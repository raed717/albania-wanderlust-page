import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../src/components/ui/Card";
import { EmptyState } from "../../src/components/common/EmptyState";
import { useAuthContext } from "../../src/context/AuthContext";

// Placeholder data
const mockWishlist = [
  {
    id: "1",
    type: "hotel",
    name: "Mountain View Hotel",
    location: "Albanian Alps",
    price: 89,
  },
  {
    id: "2",
    type: "destination",
    name: "Blue Eye Spring",
    location: "Saranda",
  },
];

export default function WishlistScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuthContext();
  const wishlist = mockWishlist; // Replace with actual wishlist data

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <EmptyState
          icon="🔐"
          title="Sign in required"
          description="Please sign in to view your wishlist"
          actionLabel="Sign In"
          onAction={() => router.push("/(auth)/sign-in")}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Wishlist</Text>
        <Text style={styles.subtitle}>Places you want to visit</Text>
      </View>

      {wishlist.length === 0 ? (
        <EmptyState
          icon="❤️"
          title="Your wishlist is empty"
          description="Save your favorite places to visit later"
          actionLabel="Explore"
          onAction={() => router.push("/(tabs)/explore")}
        />
      ) : (
        <FlatList
          data={wishlist}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push(
                  item.type === "hotel"
                    ? (`/hotels/${item.id}` as any)
                    : (`/destinations/${item.id}` as any),
                )
              }
              activeOpacity={0.8}
            >
              <Card style={styles.wishlistCard}>
                <View style={styles.cardContent}>
                  <View style={styles.iconContainer}>
                    <Text style={styles.icon}>
                      {item.type === "hotel" ? "🏨" : "🏔️"}
                    </Text>
                  </View>
                  <View style={styles.info}>
                    <Text style={styles.type}>{item.type}</Text>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.location}>📍 {item.location}</Text>
                    {item.price && (
                      <Text style={styles.price}>${item.price} / night</Text>
                    )}
                  </View>
                  <TouchableOpacity style={styles.heartButton}>
                    <Text style={styles.heart}>❤️</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            </TouchableOpacity>
          )}
        />
      )}
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
  list: {
    padding: 20,
    paddingTop: 10,
  },
  wishlistCard: {
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 60,
    height: 60,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  icon: {
    fontSize: 28,
  },
  info: {
    flex: 1,
  },
  type: {
    fontSize: 11,
    color: "#6b7280",
    textTransform: "uppercase",
    fontWeight: "500",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginTop: 2,
  },
  location: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563eb",
    marginTop: 4,
  },
  heartButton: {
    padding: 8,
  },
  heart: {
    fontSize: 20,
  },
});
