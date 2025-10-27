import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0F172A",
        secondary: "#1E293B",
        accent: {
          DEFAULT: "#2F7939",
          light: "#3D8B47",
          dark: "#1E5928",
        },
        bg: {
          DEFAULT: "#F8FAFC",
          alt: "#F1F5F9",
        },
        surface: "#FFFFFF",
        border: "#E2E8F0",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        brutal: "0.5rem 0.5rem 0 0 rgba(15, 23, 42, 0.1)",
        "brutal-sm": "0.25rem 0.25rem 0 0 rgba(15, 23, 42, 0.1)",
        "brutal-lg": "0.75rem 0.75rem 0 0 rgba(15, 23, 42, 0.1)",
      },
      borderWidth: {
        DEFAULT: "3px",
      },
      borderRadius: {
        DEFAULT: "4px",
      },
    },
  },
  plugins: [],
};

export default config;
