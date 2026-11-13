/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        azure: '#65B9EB',
        skyBlue: '#91D4F2',
        iceBlue: '#B9E5F5',
        cloudWhite: '#EAF8FF',
        blueGrey: '#6D9EBF',
        deepNavy: '#142B43',
      },
      fontFamily: {
        sans: ['Montserrat', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
