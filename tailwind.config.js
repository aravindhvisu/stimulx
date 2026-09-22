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
          DEFAULT: "#1a1633",
          mid: "#2e2a50",
          soft: "#6b6890",
          faint: "#a09ec0",
        },
        saffron: {
          DEFAULT: "#e8852b",
          light: "#f9a94e",
          bg: "rgba(232, 133, 43, 0.09)",
        },
        surface: {
          DEFAULT: "#f5f3ef",
          secondary: "#eceae4",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "sans-serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
        serif: ["var(--font-playfair)", "serif"],
      },
    },
  },
  plugins: [],
};
