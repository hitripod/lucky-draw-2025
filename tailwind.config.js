/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        game: {
          bg: '#0a0225',
          card: '#1a0f37',
          accent: '#00f2ea',
          highlight: '#ff0f7b',
          secondary: '#4b2571',
        },
      },
    },
  },
  plugins: [],
};