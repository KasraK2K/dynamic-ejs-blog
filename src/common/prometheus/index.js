const express = require('express')
const client = require('prom-client')

const app = express()
const register = new client.Registry()

const startMetricsServer = (port) => {
  client.collectDefaultMetrics(register)

  app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType)
    return res.send(await client.register.metrics())
  })
  app.listen(port, () =>
    console.log(`Blog Generator Metric server started at http://localhost:${port}`)
  )
}

module.exports = startMetricsServer
