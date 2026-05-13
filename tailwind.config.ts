import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        trust: {
          DEFAULT: "var(--color-trust)",
          light: "var(--color-trust-light)",
          soft: "var(--color-trust-soft)",
        },
        action: {
          DEFAULT: "var(--color-action)",
          soft: "var(--color-action-soft)",
        },
        critical: {
          DEFAULT: "var(--color-critical)",
        },
        hazard: {
          DEFAULT: "var(--color-hazard)",
        },
        caution: {
          DEFAULT: "var(--color-caution)",
        },
        safe: {
          DEFAULT: "var(--color-safe)",
        },
        steady: {
          DEFAULT: "var(--color-steady)",
        },
        ground: {
          DEFAULT: "var(--color-ground)",
        },
        surface: {
          DEFAULT: "var(--color-surface)",
          dim: "var(--color-surface-dim)",
        },
        border: {
          DEFAULT: "var(--color-border)",
          strong: "var(--color-border-strong)",
        },
        ink: {
          DEFAULT: "var(--color-ink)",
          secondary: "var(--color-ink-secondary)",
          tertiary: "var(--color-ink-tertiary)",
        },
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        tactical: "var(--shadow-tactical)",
      },
      animation: {
        "skeleton-pulse": "skeleton-pulse 1.8s ease-in-out infinite",
        "subtle-pulse": "subtle-pulse 2s ease-in-out infinite",
        "live-pulse": "live-pulse 1.5s infinite",
      },
      keyframes: {
        "skeleton-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "subtle-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "live-pulse": {
          "0%": { opacity: "1" },
          "50%": { opacity: "0.5" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
