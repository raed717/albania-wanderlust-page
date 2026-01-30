import { Dimensions, Platform, PixelRatio } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Base dimensions for scaling (iPhone 14 Pro)
const BASE_WIDTH = 393;
const BASE_HEIGHT = 852;

/**
 * Scale a value based on screen width
 */
export function scaleWidth(size: number): number {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
}

/**
 * Scale a value based on screen height
 */
export function scaleHeight(size: number): number {
  return (SCREEN_HEIGHT / BASE_HEIGHT) * size;
}

/**
 * Moderate scale - useful for fonts and paddings
 */
export function moderateScale(size: number, factor = 0.5): number {
  return size + (scaleWidth(size) - size) * factor;
}

/**
 * Normalize font size for consistent sizing across devices
 */
export function normalizeFont(size: number): number {
  const newSize = moderateScale(size);
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

export const dimensions = {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  isSmallDevice: SCREEN_WIDTH < 375,
  isLargeDevice: SCREEN_WIDTH >= 414,
} as const;
