import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Card } from "../../src/components/ui/Card";
import { Button } from "../../src/components/ui/Button";
import { LoadingSpinner } from "../../src/components/ui/LoadingSpinner";

// Placeholder data
const mockBooking = {
  id: "1",
  property_type: "Hotel",
  property_name: "Mountain View Hotel",
  check_in: "2026-02-15",
  check_out: "2026-02-18",
  status: "confirmed",
  total_price: 267,
  guests: 2,
  nights: 3,
  price_per_night: 89,
  confirmation_code: "ALB-2026-001234",
};

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const loading = false;
  const booking = mockBooking;

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

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading booking..." />;
  }

  if (!booking) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Booking not found</Text>
          <Button title="Go Back" onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Status Header */}
        <Card
          style={{
            ...styles.statusCard,
            borderLeftColor: getStatusColor(booking.status),
          }}
        >
          <View style={styles.statusRow}>
            <View>
              <Text style={styles.confirmationLabel}>Confirmation Code</Text>
              <Text style={styles.confirmationCode}>
                {booking.confirmation_code}
              </Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(booking.status) },
              ]}
            >
              <Text style={styles.statusText}>{booking.status}</Text>
            </View>
          </View>
        </Card>

        {/* Property Info */}
        <Card style={styles.propertyCard}>
          <View style={styles.propertyHeader}>
            <View style={styles.propertyIcon}>
              <Text style={styles.propertyIconText}>
                {booking.property_type === "Hotel" ? "🏨" : "🏢"}
              </Text>
            </View>
            <View style={styles.propertyInfo}>
              <Text style={styles.propertyType}>{booking.property_type}</Text>
              <Text style={styles.propertyName}>{booking.property_name}</Text>
            </View>
          </View>
        </Card>

        {/* Dates */}
        <Card style={styles.datesCard}>
          <Text style={styles.sectionTitle}>Stay Details</Text>
          <View style={styles.dateGrid}>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Check-in</Text>
              <Text style={styles.dateValue}>
                {new Date(booking.check_in).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
              <Text style={styles.dateTime}>After 3:00 PM</Text>
            </View>
            <View style={styles.dateDivider} />
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Check-out</Text>
              <Text style={styles.dateValue}>
                {new Date(booking.check_out).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
              <Text style={styles.dateTime}>Before 11:00 AM</Text>
            </View>
          </View>
          <View style={styles.stayInfo}>
            <Text style={styles.stayText}>
              {booking.nights} nights · {booking.guests} guests
            </Text>
          </View>
        </Card>

        {/* Price Breakdown */}
        <Card style={styles.priceCard}>
          <Text style={styles.sectionTitle}>Price Details</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              ${booking.price_per_night} × {booking.nights} nights
            </Text>
            <Text style={styles.priceValue}>
              ${booking.price_per_night * booking.nights}
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Service fee</Text>
            <Text style={styles.priceValue}>$0</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${booking.total_price}</Text>
          </View>
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          {booking.status !== "cancelled" && (
            <>
              <Button
                title="Contact Host"
                variant="outline"
                onPress={() => {}}
                style={styles.actionButton}
              />
              <Button
                title="Get Directions"
                variant="outline"
                onPress={() => {}}
                style={styles.actionButton}
              />
              {booking.status === "pending" && (
                <Button
                  title="Cancel Booking"
                  variant="outline"
                  onPress={() => {}}
                  style={{ ...styles.actionButton, ...styles.cancelButton }}
                  textStyle={{ color: "#ef4444" }}
                />
              )}
            </>
          )}
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
  content: {
    padding: 20,
  },
  statusCard: {
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  confirmationLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  confirmationCode: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#ffffff",
    textTransform: "capitalize",
  },
  propertyCard: {
    marginBottom: 16,
  },
  propertyHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  propertyIcon: {
    width: 60,
    height: 60,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  propertyIconText: {
    fontSize: 28,
  },
  propertyInfo: {
    flex: 1,
  },
  propertyType: {
    fontSize: 12,
    color: "#6b7280",
    textTransform: "uppercase",
  },
  propertyName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginTop: 2,
  },
  datesCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
  },
  dateGrid: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateItem: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1f2937",
  },
  dateTime: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  dateDivider: {
    width: 1,
    height: 50,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 16,
  },
  stayInfo: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  stayText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  priceCard: {
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  priceValue: {
    fontSize: 14,
    color: "#1f2937",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2563eb",
  },
  actions: {
    gap: 12,
  },
  actionButton: {
    backgroundColor: "#ffffff",
  },
  cancelButton: {
    borderColor: "#ef4444",
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
