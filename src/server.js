const express = require('express')
const http = require('http')
const compression = require('compression')
const cors = require('cors')
const _ = require('lodash')
const responseTime = require('response-time')
const { restResponseTimeHistogram } = require('./common/prometheus/metrics')
const startMetricsServer = require('./common/prometheus')
const Sentry = require('@sentry/node')
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

Sentry.init({
  enabled: true,
  environment: process.env.NODE_ENV,
  dsn: process.env.SENTRY_DSN,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app }),
    // Automatically instrument Node.js libraries and frameworks
    ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
})
// RequestHandler creates a separate execution context, so that all
// transactions/spans/breadcrumbs are isolated across requests
app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

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
app.use(express.static('statics'))
app.use('/components', express.static('src/views/components'))
app.use(express.static('uploads'))
app.use('/v1', v1)

// Sentry
app.use(Sentry.Handlers.errorHandler())
// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500
  res.end(res.sentry + '\n')
})

// Prometheus Sub App
startMetricsServer(process.env.METRIC_PORT)

server.listen(process.env.PORT, () =>
  console.log(`Server running on ${process.env.SERVER_ADDRESS}`)
)
