/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#fdf9f6",
          100: "#f7efe9",
          200: "#ead9c6",
          300: "#d8b795",
          400: "#c2956c",
          500: "#8b5e3c",  // TU MARRON PRINCIPAL
          600: "#734b2f",
          700: "#5c3c28",
          800: "#3e281c",
          900: "#2b1b13",
        },
        accent: {
          100: "#f5e6cc",
          200: "#e0c79a",
          300: "#cca462",
        },
      },
      boxShadow: {
        soft: "0 2px 6px rgba(0,0,0,0.08)",
      },
      borderRadius: {
        xl: "1rem",
      },
    },
  },
  plugins: [],
};
