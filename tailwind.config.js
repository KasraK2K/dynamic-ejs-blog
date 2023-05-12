const withMT = require('@material-tailwind/html/utils/withMT')
const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ejs,js,sass,scss,css}'],
  theme: {
    extend: {
      screens: {},
      colors: {},
      fontFamily: {},
    },
  },
  plugins: [plugin(({ addBase, addComponents, addUtilities, theme, e, config }) => {})],
}
