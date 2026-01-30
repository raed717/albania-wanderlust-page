import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Card } from "../ui/Card";
import type { Booking } from "@albania/shared-types";

interface BookingCardProps {
  booking: Booking;
  onPress: () => void;
}

export function BookingCard({ booking, onPress }: BookingCardProps) {
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

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.typeContainer}>
            <Text style={styles.type}>
              {booking.propertyType || "Booking"}
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
        <View style={styles.content}>
          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>Check-in</Text>
            <Text style={styles.date}>
              {new Date(booking.startDate).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>Check-out</Text>
            <Text style={styles.date}>
              {new Date(booking.endDate).toLocaleDateString()}
            </Text>
          </View>
          {booking.totalPrice && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Total</Text>
              <Text style={styles.price}>${booking.totalPrice}</Text>
            </View>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  typeContainer: {
    flex: 1,
  },
  type: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
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
  content: {
    gap: 8,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  date: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1f2937",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2563eb",
  },
});
