const express = require('express')
const http = require('http')
const compression = require('compression')
const cors = require('cors')
const _ = require('lodash')
require('./configuration')

_.assign(global, {})

const app = express()
const server = http.createServer(app)
const v1 = require('./http/routes/v1')

app.set('view engine', 'ejs')
app.set('views', './src/views/pages')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(compression())
app.use(cors())
app.use(express.static('statics'))
app.use('/components', express.static('src/views/components'))
app.use('/v1', v1)

server.listen(process.env.PORT, () =>
  console.log(`Server running on http://localhost:${process.env.PORT}`)
)
