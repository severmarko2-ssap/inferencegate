import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0a",
        muted: "#555555",
        border: "#e5e7eb",
      },
    },
  },
  plugins: [],
};

export default config;
