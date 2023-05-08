const { ObjectId } = require('mongodb')
const { mongo } = require('./mongo_drive')
const { request, response } = require('express')

class MongoCrud {
  async findAll(collection, selector) {
    return new Promise((resolve, reject) => {
      if ('_id' in selector) selector._id = new ObjectId(selector._id)
      mongo
        .collection(collection)
        .find(selector)
        .toArray()
        .then((result) => resolve(result))
        .catch((err) => reject(err))
    })
  }

  async findOne(collection, selector) {
    return new Promise((resolve, reject) => {
      if ('_id' in selector) selector._id = new ObjectId(selector._id)
      mongo
        .collection(collection)
        .findOne(selector)
        .then((result) => resolve(result))
        .catch((err) => reject(err))
    })
  }

  async create(collection, doc) {
    return new Promise((resolve, reject) => {
      mongo
        .collection(collection)
        .insertOne(doc)
        .then((result) => resolve(result))
        .catch((err) => reject(err))
    })
  }

  async createMany(collection, docs) {
    return new Promise((resolve, reject) => {
      mongo
        .collection(collection)
        .insertMany(docs)
        .then((result) => resolve(result))
        .catch((err) => reject(err))
    })
  }

  async update(collection, selector, doc) {
    return new Promise((resolve, reject) => {
      if ('_id' in selector) selector._id = new ObjectId(selector._id)
      mongo
        .collection(collection)
        .updateOne(selector, { $set: doc }, { upsert: false })
        .then((result) => resolve(result))
        .catch((err) => reject(err))
    })
  }

  async upsert(collection, selector, doc) {
    return new Promise((resolve, reject) => {
      if (selector && Object.keys(selector).length) {
        if ('_id' in selector) selector._id = new ObjectId(selector._id)
        let row
        mongo
          .collection(collection)
          .findOne(selector)
          .then((result) => {
            row = result
          })
          .catch((err) => reject(err))
        // Update if selector find a row
        if (row) {
          const result = mongo
            .collection(collection)
            .updateOne(selector, { $set: doc }, { upsert: false })
            .then((result) => resolve(result))
            .catch((err) => reject(err))
        }
        // Upsert if selector is wrong
        else {
          mongo
            .collection(collection)
            .updateOne(selector, { $set: doc }, { upsert: true })
            .then((result) => resolve(result))
            .catch((err) => reject(err))
        }
      }
      // Create if selector is empty
      else {
        mongo
          .collection(collection)
          .insertOne(doc)
          .then((result) => resolve(result))
          .catch((err) => reject(err))
      }
    })
  }

  async replaceOne(collection, selector, doc) {
    return new Promise((resolve, reject) => {
      if ('_id' in selector) selector._id = new ObjectId(selector._id)
      mongo
        .collection(collection)
        .replaceOne(selector, doc)
        .then((result) => resolve(result))
        .catch((err) => reject(err))
    })
  }

  async deleteOne(collection, selector) {
    return new Promise((resolve, reject) => {
      if ('_id' in selector) selector._id = new ObjectId(selector._id)
      mongo
        .collection(collection)
        .deleteOne(selector)
        .then((result) => resolve(result))
        .catch((err) => reject(err))
    })
  }
}

module.exports = new MongoCrud()
