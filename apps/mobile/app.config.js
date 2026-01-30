const path = require("path");

// Set EXPO_ROUTER_APP_ROOT before anything else loads
// This is required for expo-router to work in monorepo setups
process.env.EXPO_ROUTER_APP_ROOT = "./app";

module.exports = {
  expo: {
    name: "Discover Albania",
    slug: "discover-albania-mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.discoveralbania.mobile",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.discoveralbania.mobile",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/icon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-web-browser",
        {
          experimentalLaunchMode: "ephemeral",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    scheme: "discoveralbania",
  },
};
