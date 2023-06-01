const express = require('express')
const http = require('http')
const compression = require('compression')
const cors = require('cors')
const _ = require('lodash')
const responseTime = require('response-time')
const { restResponseTimeHistogram } = require('./common/prometheus/metrics')
const registerPrometheus = require('./common/prometheus/register')
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
app.use(express.static('uploads'))
app.use('/v1', v1)
// Prometheus
app.use('/metrics', registerPrometheus)
app.use(
  responseTime((req, res, time) => {
    if (req?.route?.path) {
      restResponseTimeHistogram.observe(
        {
          business_name: process.env.BUSINESS_NAME,
          app_name: process.env.APP_NAME,
          method: req.method,
          route: req.route.path,
          status_code: res.statusCode,
        },
        time * 1000
      )
    }
  })
)

server.listen(process.env.PORT, () =>
  console.log(`Server running on ${process.env.SERVER_ADDRESS}`)
)
