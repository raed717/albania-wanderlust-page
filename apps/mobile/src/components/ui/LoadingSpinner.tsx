import { View, ActivityIndicator, StyleSheet, Text } from "react-native";

interface LoadingSpinnerProps {
  size?: "small" | "large";
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({
  size = "large",
  color = "#2563eb",
  text,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const content = (
    <>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
    </>
  );

  if (fullScreen) {
    return <View style={styles.fullScreen}>{content}</View>;
  }

  return <View style={styles.container}>{content}</View>;
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  fullScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    color: "#6b7280",
  },
});
