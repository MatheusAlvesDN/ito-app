/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        outfit: ['"Outfit"', 'system-ui', 'sans-serif'],
      },
      colors: {
        slate: {
          955: '#050814',
          855: '#111b2e',
          850: '#152035',
          655: '#3f4f66',
          450: '#7e8fa6',
          355: '#97a8c0',
          350: '#a3b3c9',
        },
        yellow: {
          450: '#eab308',
          350: '#fde047',
        },
        purple: {
          650: '#7e22ce',
        },
        red: {
          650: '#dc2626',
          955: '#1f0606',
        },
      },
    },
  },
  plugins: [],
}