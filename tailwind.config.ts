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
          muted: "var(--color-action-muted)",
        },
        critical: {
          DEFAULT: "var(--color-critical)",
          soft: "var(--color-critical-soft)",
        },
        hazard: {
          DEFAULT: "var(--color-hazard)",
          soft: "var(--color-hazard-soft)",
        },
        caution: { DEFAULT: "var(--color-caution)" },
        safe: {
          DEFAULT: "var(--color-safe)",
          soft: "var(--color-safe-soft)",
        },
        steady: {
          DEFAULT: "var(--color-steady)",
          soft: "var(--color-steady-soft)",
        },
        ground: { DEFAULT: "var(--color-ground)" },
        surface: {
          DEFAULT: "var(--color-surface)",
          dim: "var(--color-surface-dim)",
          raised: "var(--color-surface-raised)",
        },
        border: {
          DEFAULT: "var(--color-border)",
          strong: "var(--color-border-strong)",
        },
        ink: {
          DEFAULT: "var(--color-ink)",
          secondary: "var(--color-ink-secondary)",
          tertiary: "var(--color-ink-tertiary)",
          ghost: "var(--color-ink-ghost)",
        },
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        glow: "var(--shadow-glow)",
        card: "var(--shadow-card)",
      },
    },
  },
  plugins: [],
};

export default config;
