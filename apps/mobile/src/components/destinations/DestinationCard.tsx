import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Card } from "../ui/Card";
import type { Destination } from "@albania/shared-types";

interface DestinationCardProps {
  destination: Destination;
  onPress: () => void;
}

export function DestinationCard({
  destination,
  onPress,
}: DestinationCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card style={styles.card}>
        {destination.imageUrls?.[0] && (
          <Image
            source={{ uri: destination.imageUrls[0] }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        <View style={styles.content}>
          <Text style={styles.name}>{destination.name}</Text>
          {destination.description && (
            <Text style={styles.description} numberOfLines={2}>
              {destination.description}
            </Text>
          )}
          {destination.name && (
            <View style={styles.locationRow}>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.location}>{destination.name}</Text>
            </View>
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
    height: 180,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  location: {
    fontSize: 14,
    color: "#6b7280",
  },
});
