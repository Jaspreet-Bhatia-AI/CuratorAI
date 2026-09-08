/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        google: {
          dark: '#0f0f11',
          surface: '#1c1c1f',
          border: '#2d2d33',
          purple: '#bbaaff',
          glow: 'rgba(187, 170, 255, 0.15)'
        }
      }
    },
  },
  plugins: [],
}
