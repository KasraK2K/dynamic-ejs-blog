const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand')

const env = dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
})
dotenvExpand.expand(env)
