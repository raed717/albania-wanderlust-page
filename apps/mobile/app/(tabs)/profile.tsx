import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../src/components/ui/Card";
import { Button } from "../../src/components/ui/Button";
import { useAuthContext } from "../../src/context/AuthContext";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, signOut } = useAuthContext();

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/(tabs)");
        },
      },
    ]);
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>
        <View style={styles.authPrompt}>
          <Text style={styles.authIcon}>👤</Text>
          <Text style={styles.authTitle}>Welcome to Discover Albania</Text>
          <Text style={styles.authSubtitle}>
            Sign in to manage your bookings and save your favorite places
          </Text>
          <Button
            title="Sign In"
            onPress={() => router.push("/(auth)/sign-in")}
            style={styles.signInButton}
          />
          <TouchableOpacity onPress={() => router.push("/(auth)/sign-up")}>
            <Text style={styles.signUpLink}>
              Don't have an account?{" "}
              <Text style={styles.signUpText}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const menuItems = [
    {
      id: "account",
      icon: "👤",
      label: "Account Settings",
      route: "/profile/account",
    },
    {
      id: "bookings",
      icon: "📋",
      label: "My Bookings",
      route: "/(tabs)/bookings",
    },
    {
      id: "wishlist",
      icon: "❤️",
      label: "Wishlist",
      route: "/(tabs)/wishlist",
    },
    {
      id: "payments",
      icon: "💳",
      label: "Payment Methods",
      route: "/profile/payments",
    },
    {
      id: "notifications",
      icon: "🔔",
      label: "Notifications",
      route: "/profile/notifications",
    },
    { id: "help", icon: "❓", label: "Help & Support", route: "/profile/help" },
    { id: "about", icon: "ℹ️", label: "About", route: "/profile/about" },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* User Info */}
        <Card style={styles.userCard}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.user_metadata?.full_name?.[0]?.toUpperCase() ||
                  user?.email?.[0]?.toUpperCase() ||
                  "U"}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>
                {user?.user_metadata?.full_name || user?.email}
              </Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
            </View>
          </View>
        </Card>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.7}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out */}
        <View style={styles.signOutContainer}>
          <Button
            title="Sign Out"
            onPress={handleSignOut}
            variant="outline"
            style={styles.signOutButton}
          />
        </View>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
  },
  authPrompt: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  authIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  authTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 8,
  },
  authSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 20,
  },
  signInButton: {
    width: "100%",
    marginBottom: 16,
  },
  signUpLink: {
    fontSize: 14,
    color: "#6b7280",
  },
  signUpText: {
    color: "#2563eb",
    fontWeight: "600",
  },
  userCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#ffffff",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  userEmail: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  menuContainer: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    color: "#1f2937",
  },
  menuArrow: {
    fontSize: 20,
    color: "#9ca3af",
  },
  signOutContainer: {
    padding: 20,
  },
  signOutButton: {
    borderColor: "#ef4444",
  },
  version: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 32,
  },
});
