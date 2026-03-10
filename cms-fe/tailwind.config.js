/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {
      colors: {
        cinema: {
          dark: '#0d0d0f',
          panel: '#16161a',
          border: '#2a2a2e',
          gold: '#c9a227',
          goldDim: '#8b7355',
          muted: '#71717a',
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
