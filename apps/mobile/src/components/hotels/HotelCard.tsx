import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Card } from "../ui/Card";
import type { Hotel } from "@albania/shared-types";

interface HotelCardProps {
  hotel: Hotel;
  onPress: () => void;
}

export function HotelCard({ hotel, onPress }: HotelCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card style={styles.card}>
        {hotel.imageUrls?.[0] && (
          <Image
            source={{ uri: hotel.imageUrls[0] }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.name} numberOfLines={1}>
              {hotel.name}
            </Text>
            {hotel.rating && (
              <View style={styles.rating}>
                <Text style={styles.ratingText}>⭐ {hotel.rating}</Text>
              </View>
            )}
          </View>
          {hotel.location && (
            <View style={styles.locationRow}>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.location} numberOfLines={1}>
                {hotel.location}
              </Text>
            </View>
          )}
          {hotel.price && (
            <Text style={styles.price}>
              ${hotel.price}
              <Text style={styles.priceUnit}> / night</Text>
            </Text>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: "hidden",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 160,
  },
  content: {
    padding: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginRight: 8,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    color: "#f59e0b",
    fontWeight: "500",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  location: {
    flex: 1,
    fontSize: 13,
    color: "#6b7280",
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2563eb",
  },
  priceUnit: {
    fontSize: 14,
    fontWeight: "400",
    color: "#6b7280",
  },
});
