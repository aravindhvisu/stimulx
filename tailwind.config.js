/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#12111A",
          dark: "#12111A",
          2: "#1E1D29",
          mid: "#1E1D29",
          soft: "#6B6A75",
        },
        red: {
          DEFAULT: "#D7263D",
          dark: "#A81C2E",
          hover: "#A81C2E",
        },
        paper: {
          DEFAULT: "#FFFFFF",
          2: "#F5F5F7",
        },
        line: "#E4E4E9",
        text: "#1B1A22",
        muted: "#6B6A75",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        mono: ["monospace"],
      },
    },
  },
  plugins: [],
};
