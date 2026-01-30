import { View, StyleSheet, ViewStyle } from "react-native";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  variant?: "elevated" | "outlined";
}

export function Card({ children, style, variant = "elevated" }: CardProps) {
  return <View style={[styles.base, styles[variant], style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  elevated: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  outlined: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
});
