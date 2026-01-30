import { FlatList, StyleSheet } from "react-native";
import { HotelCard } from "./HotelCard";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { EmptyState } from "../common/EmptyState";
import type { Hotel } from "@albania/shared-types";

interface HotelListProps {
  hotels: Hotel[];
  loading?: boolean;
  onHotelPress: (hotel: Hotel) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  horizontal?: boolean;
}

export function HotelList({
  hotels,
  loading = false,
  onHotelPress,
  onRefresh,
  refreshing = false,
  horizontal = false,
}: HotelListProps) {
  if (loading) {
    return <LoadingSpinner fullScreen text="Loading hotels..." />;
  }

  if (hotels.length === 0) {
    return (
      <EmptyState
        icon="🏨"
        title="No hotels found"
        description="Try adjusting your search filters"
      />
    );
  }

  return (
    <FlatList
      data={hotels}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <HotelCard hotel={item} onPress={() => onHotelPress(item)} />
      )}
      contentContainerStyle={horizontal ? styles.horizontalList : styles.list}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      horizontal={horizontal}
      onRefresh={!horizontal ? onRefresh : undefined}
      refreshing={refreshing}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  horizontalList: {
    paddingHorizontal: 16,
    gap: 12,
  },
});
