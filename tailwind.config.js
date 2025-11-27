// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       fontFamily: {
//         sans: ['Inter', 'sans-serif'],
//       },
      
//       colors: {
//         primary: "#38E07B",
//         dark: "#122017",
//       }
//     },
//   },
//   plugins: [],
// }

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Make all font-sans text Tamil-capable
        sans: ['"Noto Sans Tamil"', 'Inter', 'system-ui', 'sans-serif'],
        // Optional: dedicated Tamil font class
        tamil: ['"Noto Sans Tamil"', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: "#38E07B",
        dark: "#122017",
      },
    },
  },
  plugins: [],
};