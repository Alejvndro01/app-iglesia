/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Habilita el modo oscuro basado en clases
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};