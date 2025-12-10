/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Default sans stack: Noto Sans Tamil first, then Inter, then system
        sans: ["Noto Sans Tamil", "Inter", "system-ui", "sans-serif"],
        // Optional: dedicated Tamil class `font-tamil`
        tamil: ["Noto Sans Tamil", "system-ui", "sans-serif"],
      },
      colors: {
        primary: "#38E07B",
        dark: "#122017",
      },
    },
  },
  plugins: [],
};