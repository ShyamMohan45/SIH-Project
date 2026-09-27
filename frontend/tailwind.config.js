/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        goi: {
          navy: '#0b2545',
          saffron: '#ff9933',
          green: '#138808',
          blue: '#0056b3',
          lightBg: '#f4f7f6',
          card: '#ffffff',
          gold: '#d4af37'
        }
      }
    },
  },
  plugins: [],
}
