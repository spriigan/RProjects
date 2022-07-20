/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
    colors: {
      'colorNavBar': '#472e8c',
      'white': '#ffffff',
      'gray': '#6B7378',
      'black': '#000000'
    },
    
  },
  plugins: [],
}
