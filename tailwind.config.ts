
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#9370DB", // Soft purple
          foreground: "#FFFFFF",
          100: "#E5DEFF",
        },
        secondary: {
          DEFAULT: "#8E9196",
          foreground: "#FFFFFF",
        },
        success: {
          DEFAULT: "#4CAF50", // Adjusted green
          foreground: "#FFFFFF",
        },
        warning: {
          DEFAULT: "#FF9800", // Adjusted orange
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#F44336", // Adjusted red
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#1E1E1E", // Darker for black theme
          foreground: "#A0A0A0", // Lighter gray for contrast
        },
        accent: {
          DEFAULT: "#2A2A2A", // Soft dark accent
          foreground: "#E0E0E0", // Light text for contrast
        },
        // Page-specific colors updated for black theme
        dashboard: {
          primary: "#9370DB", // Soft purple
          accent: "#2D2B55", // Dark purple accent
          background: "#121212",
        },
        inventory: {
          primary: "#4C83FF", // Royal blue
          accent: "#1F2B3E", // Dark blue accent
          background: "#121212",
        },
        finance: {
          primary: "#4CAF50", // Green
          accent: "#1E3B2C", // Dark green accent
          background: "#121212",
        },
        suppliers: {
          primary: "#FF9800", // Orange
          accent: "#3B2E1F", // Dark orange accent
          background: "#121212",
        },
        analytics: {
          primary: "#F06292", // Pink
          accent: "#3D2E36", // Dark pink accent
          background: "#121212",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "pulse-subtle": "pulse-subtle 4s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
