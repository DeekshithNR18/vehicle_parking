/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        deep: "#0B0F1A",
        panel: "#121828",
        elevated: "#1A2238",
        mint: "#00E5A0",
        azure: "#5B8CFF",
        warn: "#FFB020",
        danger: "#FF4D6D",
        textp: "#E8ECF4",
        muted: "#8A93A6",
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.8s infinite",
      },
    },
  },
  plugins: [],
}
