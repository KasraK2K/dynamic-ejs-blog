const express = require('express')
const compression = require('compression')
const _ = require('lodash')
const app = express()
const v1 = require('./http/routes/v1')
require('./configuration')

const port = process.env.PORT || 8000
const serverAddress =
  process.env.NODE_ENV === 'production'
    ? 'firstdash.com'
    : process.env.NODE_ENV === 'development'
    ? 'dev.firstdash.com'
    : `http://localhost:${port}`
_.assign(global, { port, serverAddress })

app.set('view engine', 'ejs')
app.set('views', './src/views/pages')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(compression())
app.use(express.static('statics'))
app.use('/v1', v1)

app.listen(port, () => console.log(`Server running on http://localhost:${port}`))
