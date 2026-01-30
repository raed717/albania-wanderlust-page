import { FlatList, StyleSheet, View } from "react-native";
import { DestinationCard } from "./DestinationCard";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { EmptyState } from "../common/EmptyState";
import type { Destination } from "@albania/shared-types";

interface DestinationListProps {
  destinations: Destination[];
  loading?: boolean;
  onDestinationPress: (destination: Destination) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export function DestinationList({
  destinations,
  loading = false,
  onDestinationPress,
  onRefresh,
  refreshing = false,
}: DestinationListProps) {
  if (loading) {
    return <LoadingSpinner fullScreen text="Loading destinations..." />;
  }

  if (destinations.length === 0) {
    return (
      <EmptyState
        icon="🏔️"
        title="No destinations found"
        description="Check back later for new destinations to explore"
      />
    );
  }

  return (
    <FlatList
      data={destinations}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <DestinationCard
          destination={item}
          onPress={() => onDestinationPress(item)}
        />
      )}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      onRefresh={onRefresh}
      refreshing={refreshing}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
});
