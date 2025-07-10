
export const Colors = {
  background: "#0D0A19",
  cardBackground: "#16112B",
  border: "#2C1E51",
  white: "#FFFFFF",
  gray: "#9CA3AF",
  accent: "#7B68EE",
  green: "#4ECDC4",
  navInactive: "#6B7280",
};

export const FontSizes = {
  xs: 11,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 28,
  xxl: 36,
};

export const FontWeights = {
  regular: "400",
  medium: "500",
  semiBold: "600",
  bold: "bold",
};

export const Spacing = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  xxxl: 25,
  huge: 30,
  massive: 40,
  giant: 100,
};

export const CommonStyles = {
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.white,
  },
  subtitle: {
    fontSize: FontSizes.base,
    color: Colors.gray,
  },
  button: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
};
