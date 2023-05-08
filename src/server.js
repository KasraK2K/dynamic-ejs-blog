const express = require('express')
const compression = require('compression')
const _ = require('lodash')
require('./configuration')

_.assign(global, {})

const app = express()
const v1 = require('./http/routes/v1')

app.set('view engine', 'ejs')
app.set('views', './src/views/pages')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(compression())
app.use(express.static('statics'))
app.use('/v1', v1)

app.listen(process.env.PORT, () =>
  console.log(`Server running on http://localhost:${process.env.PORT}`)
)
