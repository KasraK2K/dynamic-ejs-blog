const { MongoClient } = require('mongodb')

const mongoClient = new MongoClient(String(process.env.MONGO_URI))

mongoClient
  .on('connect', () => console.log('MongoDB connected'))
  .on('close', () => console.log('MongoDB connection closed'))
  .on('error', (err) => {
    console.error(err.message)
    process.exit(1)
  })

const mongo = {
  mongoClient,
  database: (databaseName = 'dynamicBlog') => mongoClient.db(databaseName),
  collection: (databaseName = 'dynamicBlog', collectionName = 'article') =>
    mongoClient.db(databaseName).collection(collectionName),
}

module.exports = mongo
