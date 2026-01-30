import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Input } from "../../src/components/ui/Input";
import { Button } from "../../src/components/ui/Button";
import { useAuthContext } from "../../src/context/AuthContext";

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp, signInWithGoogle } = useAuthContext();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError("");

    const result = await signInWithGoogle();
    setGoogleLoading(false);

    if (result.success) {
      router.replace("/(tabs)");
    } else if (result.error !== "Sign in was cancelled") {
      setError(result.error || "Google sign in failed");
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    const result = await signUp(email, password, {
      full_name: fullName,
    });
    setLoading(false);

    if (result.success) {
      router.replace("/(tabs)");
    } else {
      setError(result.error || "Sign up failed");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Start your journey with us</Text>
          </View>

          <View style={styles.form}>
            {error ? <Text style={styles.error}>{error}</Text> : null}

            <View style={styles.nameRow}>
              <View style={styles.nameInput}>
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <Input
              label="Email *"
              placeholder="john@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <Input
              label="Password *"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="new-password"
            />

            <Input
              label="Confirm Password *"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoComplete="new-password"
            />

            <Text style={styles.terms}>
              By signing up, you agree to our{" "}
              <Text style={styles.link}>Terms of Service</Text> and{" "}
              <Text style={styles.link}>Privacy Policy</Text>
            </Text>

            <Button
              title="Create Account"
              onPress={handleSignUp}
              loading={loading}
              style={styles.signUpButton}
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleSignIn}
              disabled={googleLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.googleButtonText}>
                {googleLoading ? "Signing up..." : "Continue with Google"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace("/(auth)/sign-in")}>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    color: "#2563eb",
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
  },
  form: {
    flex: 1,
  },
  error: {
    color: "#ef4444",
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
    backgroundColor: "#fef2f2",
    padding: 12,
    borderRadius: 8,
  },
  nameRow: {
    flexDirection: "row",
    gap: 12,
  },
  nameInput: {
    flex: 1,
  },
  terms: {
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  link: {
    color: "#2563eb",
  },
  signUpButton: {
    marginTop: 8,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e7eb",
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: "#6b7280",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4285F4",
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#6b7280",
  },
  signInLink: {
    fontSize: 14,
    color: "#2563eb",
    fontWeight: "600",
  },
});
