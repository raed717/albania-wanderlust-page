import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Card } from "../ui/Card";
import type { Car } from "@albania/shared-types";

interface CarCardProps {
  car: Car;
  onPress: () => void;
}

export function CarCard({ car, onPress }: CarCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card style={styles.card}>
        {car.imageUrls?.[0] && (
          <Image
            source={{ uri: car.imageUrls[0] }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={1}>
            {car.brand} {car.brand}
          </Text>
          <View style={styles.features}>
            {car.seats && (
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>👥</Text>
                <Text style={styles.featureText}>{car.seats} seats</Text>
              </View>
            )}
            {car.transmission && (
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>⚙️</Text>
                <Text style={styles.featureText}>{car.transmission}</Text>
              </View>
            )}
          </View>
          {car.pricePerDay && (
            <Text style={styles.price}>
              ${car.pricePerDay}
              <Text style={styles.priceUnit}> / day</Text>
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
    height: 140,
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 8,
  },
  features: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 8,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
  },
  featureIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  featureText: {
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
