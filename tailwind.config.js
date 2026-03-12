/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {
      colors: {
        // Light, harmonious palette — warm and pleasing
        cinema: {
          dark: '#f5f4f0',      // page background (warm off-white)
          panel: '#ffffff',    // cards, sidebar
          border: '#e5e2dc',   // borders (warm gray)
          gold: '#b8860b',     // accent — dark goldenrod
          goldDim: '#9a7b3c',  // accent muted
          muted: '#6b6560',    // secondary text (warm gray)
          surface: '#faf9f7',  // table rows, inputs (slightly tinted)
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
