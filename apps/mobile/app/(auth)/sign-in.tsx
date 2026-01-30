import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Input } from "../../src/components/ui/Input";
import { Button } from "../../src/components/ui/Button";
import { useAuthContext } from "../../src/context/AuthContext";

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, signInWithGoogle } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    const result = await signIn(email, password);
    setLoading(false);

    if (result.success) {
      router.replace("/(tabs)");
    } else {
      setError(result.error || "Sign in failed");
    }
  };

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

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        <View style={styles.form}>
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
          />

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>

          <Button
            title="Sign In"
            onPress={handleSignIn}
            loading={loading}
            style={styles.signInButton}
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
              {googleLoading ? "Signing in..." : "Continue with Google"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.replace("/(auth)/sign-up")}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#2563eb",
  },
  signInButton: {
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
  signUpLink: {
    fontSize: 14,
    color: "#2563eb",
    fontWeight: "600",
  },
});
