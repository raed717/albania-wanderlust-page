const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

// Set EXPO_ROUTER_APP_ROOT for expo-router in monorepo
process.env.EXPO_ROUTER_APP_ROOT = path.resolve(projectRoot, "app");

const config = getDefaultConfig(projectRoot);

// Watch all files in the monorepo
config.watchFolders = [monorepoRoot];

// Let Metro know where to resolve packages
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

// Allow hierarchical lookup for proper dependency resolution in monorepo
config.resolver.disableHierarchicalLookup = false;

// Ensure react-native internal dependencies are resolved from the mobile app's node_modules
config.resolver.extraNodeModules = {
  "@react-native/virtualized-lists": path.resolve(projectRoot, "node_modules/@react-native/virtualized-lists"),
};

module.exports = config;
