import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        display: ["var(--font-display)", "serif"],
      },
      colors: {
        trust: {
          DEFAULT: "#0f172a",
          light: "#1e293b",
          soft: "#f1f5f9",
        },
        action: {
          DEFAULT: "#0d9488",
          soft: "#f0fdfa",
          muted: "#5eead4",
        },
        critical: {
          DEFAULT: "#dc2626",
          soft: "#fef2f2",
        },
        hazard: {
          DEFAULT: "#d97706",
          soft: "#fffbeb",
        },
        caution: { DEFAULT: "#ca8a04" },
        safe: {
          DEFAULT: "#059669",
          soft: "#ecfdf5",
        },
        steady: {
          DEFAULT: "#0284c7",
          soft: "#f0f9ff",
        },
        ground: { DEFAULT: "#f8fafc" },
        surface: {
          DEFAULT: "#ffffff",
          dim: "#f1f5f9",
          raised: "#ffffff",
        },
        border: {
          DEFAULT: "#e2e8f0",
          strong: "#cbd5e1",
        },
        ink: {
          DEFAULT: "#0f172a",
          secondary: "#475569",
          tertiary: "#94a3b8",
          ghost: "#cbd5e1",
        },
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.04), 0 0 0 1px rgb(0 0 0 / 0.02)",
        glow: "0 0 40px -8px rgba(13, 148, 136, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
