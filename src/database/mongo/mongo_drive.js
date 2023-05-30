const { MongoClient } = require('mongodb')

const mongoClient = new MongoClient(process.env.MONGO_URI)
const defaultDatabase = process.env.MONGO_DATABASE
const defaultCollection = process.env.MONGO_DEFAULT_COLLECTION

mongoClient
  .on('connect', () => console.log('MongoDB connected'))
  .on('close', () => console.log('MongoDB connection closed'))
  .on('error', (err) => {
    console.error(err.message)
    process.exit(1)
  })

const mongo = {
  mongoClient,
  database: (databaseName = defaultDatabase) => mongoClient.db(databaseName),
  collection: (collectionName = defaultCollection) =>
    mongoClient.db(defaultDatabase).collection(collectionName),
}

module.exports = { mongo, mongoClient }
