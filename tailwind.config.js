/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: "#4f46e5", // Indigo
        secondary: "#ec4899", // Pink
        background: "#f9fafb", // Light gray
        accent: "#10b981", // Emerald
        muted: "#6b7280", // Gray
      },
      spacing: {
        "screen-padding": "1.5rem",
        "header-height": "4rem",
      },
      fontFamily: {
        sans: ["Inter", "System"],
        display: ["Poppins", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        btn: "0.75rem",
      },
    },
  },
  plugins: [],
};
