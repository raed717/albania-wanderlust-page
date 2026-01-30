import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: {
    label: string;
    onPress: () => void;
  };
}

export function Header({ title, showBack = false, rightAction }: HeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.right}>
        {rightAction && (
          <TouchableOpacity onPress={rightAction.onPress}>
            <Text style={styles.actionText}>{rightAction.label}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  left: {
    width: 60,
  },
  right: {
    width: 60,
    alignItems: "flex-end",
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    textAlign: "center",
  },
  backButton: {
    padding: 4,
  },
  backText: {
    fontSize: 24,
    color: "#2563eb",
  },
  actionText: {
    fontSize: 16,
    color: "#2563eb",
    fontWeight: "500",
  },
});
