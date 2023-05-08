const assert = require('assert').strict

const REQUIRED_ENVIRONMENTS = ['NODE_ENV', 'MONGO_URI', 'PORT', 'SERVER_ADDRESS']

for (const key of REQUIRED_ENVIRONMENTS)
  assert.ok(process.env[key], `The ${key} environment variable is required`)
