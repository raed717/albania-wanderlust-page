import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../src/components/ui/Card";

export default function HomeScreen() {
  const router = useRouter();

  const categories = [
    {
      id: "destinations",
      title: "Destinations",
      icon: "🏔️",
      route: "/explore",
    },
    { id: "hotels", title: "Hotels", icon: "🏨", route: "/explore" },
    { id: "apartments", title: "Apartments", icon: "🏢", route: "/explore" },
    { id: "cars", title: "Car Rentals", icon: "🚗", route: "/explore" },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome to</Text>
          <Text style={styles.title}>Discover Albania</Text>
          <Text style={styles.subtitle}>
            Find your perfect travel experience
          </Text>
        </View>

        {/* Search Bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => router.push("/explore")}
          activeOpacity={0.8}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Where do you want to go?</Text>
        </TouchableOpacity>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explore by Category</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => router.push(category.route as any)}
                activeOpacity={0.7}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryTitle}>{category.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Destinations</Text>
            <TouchableOpacity onPress={() => router.push("/explore")}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <Card style={styles.featuredCard}>
            <View style={styles.featuredContent}>
              <Text style={styles.featuredIcon}>🏔️</Text>
              <View style={styles.featuredText}>
                <Text style={styles.featuredTitle}>Discover Albanian Alps</Text>
                <Text style={styles.featuredSubtitle}>
                  Explore stunning mountain landscapes
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/(tabs)/bookings")}
            >
              <Text style={styles.actionIcon}>📋</Text>
              <Text style={styles.actionText}>My Bookings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/(tabs)/wishlist")}
            >
              <Text style={styles.actionIcon}>❤️</Text>
              <Text style={styles.actionText}>Wishlist</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/(tabs)/profile")}
            >
              <Text style={styles.actionIcon}>⚙️</Text>
              <Text style={styles.actionText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    paddingTop: 10,
  },
  greeting: {
    fontSize: 16,
    color: "#6b7280",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: "#9ca3af",
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    color: "#2563eb",
    fontWeight: "500",
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryCard: {
    width: "47%",
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1f2937",
  },
  featuredCard: {
    marginTop: -8,
  },
  featuredContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  featuredIcon: {
    fontSize: 48,
    marginRight: 16,
  },
  featuredText: {
    flex: 1,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  featuredSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -8,
  },
  actionButton: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    width: "30%",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
});
