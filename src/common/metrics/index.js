const express = require('express')
const client = require('prom-client')
const register = new client.Registry()
const app = express()
const port = process.env.METRIC_PORT

const restResponseTimeHistogram = new client.Histogram({
  name: 'rest_response_time_duration_seconds',
  help: 'REST API response time in seconds.',
  labelNames: ['business_name', 'app_name', 'method', 'route', 'status_code'],
})

const startMetricsServer = () => {
  client.collectDefaultMetrics(register)

  app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType)
    return res.send(await client.register.metrics())
  })
  app.listen(port, () => console.log(`Metric server started att http://localhost:${port}`))
}
