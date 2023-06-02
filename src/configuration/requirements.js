const assert = require('assert').strict

const REQUIRED_ENVIRONMENTS = [
  'NODE_ENV',
  'MONGO_URI',
  'PORT',
  'SERVER_ADDRESS',
  'METRIC_PORT',
  'BUSINESS_NAME',
  'APP_NAME',
  'SENTRY_DSN',
]

for (const key of REQUIRED_ENVIRONMENTS)
  assert.ok(process.env[key], `The ${key} environment variable is required`)
