import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        minimal: {
          bg: "#A1B5C4",
          surface: "rgba(255, 255, 255, 0.15)",
          card: "#BDD1DE",
          dark: "#537180",
          accent: "#D95232",
          text: "#FFFFFF",
          muted: "rgba(255, 255, 255, 0.75)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;