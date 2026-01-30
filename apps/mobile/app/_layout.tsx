import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../src/context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen
          name="destinations/[id]"
          options={{ headerShown: true, title: "Destination" }}
        />
        <Stack.Screen
          name="hotels/[id]"
          options={{ headerShown: true, title: "Hotel" }}
        />
        <Stack.Screen
          name="apartments/[id]"
          options={{ headerShown: true, title: "Apartment" }}
        />
        <Stack.Screen
          name="cars/[id]"
          options={{ headerShown: true, title: "Car" }}
        />
        <Stack.Screen
          name="bookings/[id]"
          options={{ headerShown: true, title: "Booking Details" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
