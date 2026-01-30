import { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { apiClient } from "@albania/api-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthContext } from "../../src/context/AuthContext";
import * as WebBrowser from "expo-web-browser";

// Ensure any open browser sessions are closed
WebBrowser.maybeCompleteAuthSession();

export default function AuthCallbackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    handleCallback();
  }, []);

  async function handleCallback() {
    try {
      console.log("=== Auth Callback ===");
      console.log("Params:", params);

      // The tokens might be in the URL fragment (hash) or query params
      // expo-router should have parsed them for us
      const accessToken = params.access_token as string;
      const refreshToken = params.refresh_token as string;

      if (accessToken) {
        console.log("Found access token, setting session...");

        const { data, error } = await apiClient.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || "",
        });

        if (error) {
          console.error("Error setting session:", error);
          router.replace("/(auth)/sign-in");
          return;
        }

        if (data.session) {
          await AsyncStorage.setItem("access_token", accessToken);
          console.log("Session set successfully, redirecting to home...");
          router.replace("/(tabs)");
          return;
        }
      }

      // If no token, check if there's already a session
      const { data: sessionData } = await apiClient.auth.getSession();
      if (sessionData.session) {
        console.log("Found existing session, redirecting to home...");
        router.replace("/(tabs)");
        return;
      }

      // No session found, redirect to sign in
      console.log("No session found, redirecting to sign in...");
      router.replace("/(auth)/sign-in");
    } catch (error) {
      console.error("Callback error:", error);
      router.replace("/(auth)/sign-in");
    }
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#DC2626" />
      <Text style={styles.text}>Completing sign in...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
});
