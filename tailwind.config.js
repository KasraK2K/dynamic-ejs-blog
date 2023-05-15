const withMT = require('@material-tailwind/html/utils/withMT')
const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ejs,js,sass,scss,css}', './statics/**/*.{ejs,js,sass,scss,css}'],
  theme: {
    extend: {
      screens: {},
      colors: {
        'deep-pb1': '#0F1637',
      },
      fontFamily: {},
    },
  },
  plugins: [plugin(({ addBase, addComponents, addUtilities, theme, e, config }) => {})],
}
