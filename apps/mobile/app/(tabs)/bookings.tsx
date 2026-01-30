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
import { LoadingSpinner } from "../../src/components/ui/LoadingSpinner";
import { EmptyState } from "../../src/components/common/EmptyState";
import { useAuthContext } from "../../src/context/AuthContext";

// Placeholder data - replace with useBookings hook
const mockBookings = [
  {
    id: "1",
    property_type: "Hotel",
    property_name: "Mountain View Hotel",
    check_in: "2026-02-15",
    check_out: "2026-02-18",
    status: "confirmed",
    total_price: 267,
  },
  {
    id: "2",
    property_type: "Apartment",
    property_name: "Seaside Apartment",
    check_in: "2026-03-01",
    check_out: "2026-03-05",
    status: "pending",
    total_price: 420,
  },
];

export default function BookingsScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuthContext();
  const loading = false; // Replace with actual loading state
  const bookings = mockBookings; // Replace with actual bookings data

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "#10b981";
      case "pending":
        return "#f59e0b";
      case "cancelled":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <EmptyState
          icon="🔐"
          title="Sign in required"
          description="Please sign in to view your bookings"
          actionLabel="Sign In"
          onAction={() => router.push("/(auth)/sign-in")}
        />
      </SafeAreaView>
    );
  }

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading bookings..." />;
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
        <Text style={styles.subtitle}>Manage your reservations</Text>
      </View>

      {bookings.length === 0 ? (
        <EmptyState
          icon="📅"
          title="No bookings yet"
          description="Start exploring and book your first adventure!"
          actionLabel="Explore"
          onAction={() => router.push("/(tabs)/explore")}
        />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/bookings/${item.id}` as any)}
              activeOpacity={0.8}
            >
              <Card style={styles.bookingCard}>
                <View style={styles.bookingHeader}>
                  <View>
                    <Text style={styles.propertyType}>
                      {item.property_type}
                    </Text>
                    <Text style={styles.propertyName}>
                      {item.property_name}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(item.status) },
                    ]}
                  >
                    <Text style={styles.statusText}>{item.status}</Text>
                  </View>
                </View>

                <View style={styles.dateRow}>
                  <View style={styles.dateItem}>
                    <Text style={styles.dateLabel}>Check-in</Text>
                    <Text style={styles.dateValue}>
                      {new Date(item.check_in).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </Text>
                  </View>
                  <Text style={styles.arrow}>→</Text>
                  <View style={styles.dateItem}>
                    <Text style={styles.dateLabel}>Check-out</Text>
                    <Text style={styles.dateValue}>
                      {new Date(item.check_out).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </Text>
                  </View>
                </View>

                <View style={styles.priceRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalPrice}>${item.total_price}</Text>
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
  bookingCard: {
    marginBottom: 16,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  propertyType: {
    fontSize: 12,
    color: "#6b7280",
    textTransform: "uppercase",
    fontWeight: "500",
  },
  propertyName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
    textTransform: "capitalize",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  dateItem: {
    alignItems: "center",
  },
  dateLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  arrow: {
    fontSize: 16,
    color: "#9ca3af",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  totalLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2563eb",
  },
});
