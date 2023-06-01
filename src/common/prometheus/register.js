const express = require('express')
const router = express.Router()
const client = require('prom-client')
const register = new client.Registry()

const { restResponseTimeHistogram } = require('./metrics')

const startMetricsServer = () => {
  client.collectDefaultMetrics(register)

  router.get('/', async (req, res) => {
    res.set('Content-Type', client.register.contentType)
    return res.send(await client.register.metrics())
  })
}

module.exports = router
