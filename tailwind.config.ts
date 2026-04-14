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
        primary: {
          DEFAULT: "#0f766e",
          hover: "#0d9488",
          soft: "#ccfbf1",
          deep: "#115e59",
        },
        canvas: {
          DEFAULT: "#f8fafc",
          line: "#e2e8f0",
          deep: "#cbd5e1",
        },
        surface: {
          DEFAULT: "#ffffff",
          mute: "#f1f5f9",
        },
        ink: {
          DEFAULT: "#0f172a",
          muted: "#475569",
          faint: "#94a3b8",
        },
        accent: {
          DEFAULT: "#e11d48",
        },
      },
      boxShadow: {
        lift: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        inset: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
