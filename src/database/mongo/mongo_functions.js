// @ts-nocheck
const { ObjectId } = require('mongodb')
const mongo = require('./mongo_drive')
const _ = require('lodash')

/**
 * SELECT ALL
 *
 * @param {string} tableName
 * @param {Record<string, any>} [args={}]
 * @param {string[]} [omits=[]]
 * @return {Promise<Record<string, any>[]>}
 */
function find(tableName, args, omits) {
  return new Promise(async (resolve, reject) => {
    args = this.sanitizeArgs(args)
    await mongo
      .collection(tableName)
      .find(args, { projection: this.generateProjection(omits) })
      .toArray()
      .then((result) => {
        omits.includes('*') ? resolve([]) : resolve(result)
      })
      .catch((err) => reject(err))
  })
}

/**
 * SELECT ONE
 *
 * @param {string} tableName
 * @param {Record<string, any>} [args={}]
 * @param {string[]} [omits=[]]
 * @return {Promise<Record<string, any>>}
 */
function findOne(tableName, args, omits) {
  return new Promise(async (resolve, reject) => {
    args = this.sanitizeArgs(args)

    await mongo
      .collection(tableName)
      .findOne(args, { projection: this.generateProjection(omits) })
      .then((result) => {
        omits.includes('*') ? resolve([]) : resolve(result)
      })
      .catch((err) => reject(err))
  })
}

/**
 * INSERT ONE
 *
 * @param {string} tableName
 * @param {Record<string, any>} args
 * @param {string[]} [omits=[]]
 * @return {Promise<Record<string, any>>}
 */
function insertOne(tableName, args, omits) {
  return new Promise(async (resolve, reject) => {
    args = this.sanitizeArgs(args)
    _.assign(args, { createdAt: new Date(), updatedAt: new Date() })

    await mongo
      .collection(tableName)
      .insertOne(args)
      .then(async (result) =>
        resolve(await this.findOne(tableName, { _id: result.insertedId }, omits))
      )
      .catch((err) => reject(err))
  })
}

/**
 * UPDATE ONE
 *
 * @param {string} tableName
 * @param {Record<string, any>} findArgs
 * @param {Record<string, any>} args
 * @param {string[]} [omits=[]]
 * @return {Promise<Record<string, any>>}
 */
function updateOne(tableName, findArgs, args, omits) {
  return new Promise(async (resolve, reject) => {
    findArgs = this.sanitizeArgs(findArgs)
    args = this.sanitizeArgs(args)

    await mongo
      .collection(tableName)
      .updateOne(findArgs, { $set: args, $currentDate: { updatedAt: true } })
      .then(async () => resolve(await this.findOne(tableName, findArgs, omits)))
      .catch((err) => reject(err))
  })
}

/**
 * UPSERT ONE
 *
 * @param {string} tableName
 * @param {Record<string, any>} findArgs
 * @param {Record<string, any>} args
 * @param {{ upsert: boolean; omits: string[] }} [options={ upsert: true, omits: [] }]
 * @return {Promise<Record<string, any>>}
 */
function upsertOne(tableName, findArgs, args, options) {
  return new Promise(async (resolve, reject) => {
    const { upsert, omits } = options
    findArgs = this.sanitizeArgs(findArgs)
    args = this.sanitizeArgs(args)
    const date = new Date()

    await mongo
      .collection(tableName)
      .updateOne(
        findArgs,
        { $set: { ...args, updatedAt: date }, $setOnInsert: { createdAt: date } },
        { upsert }
      )
      .then(async () => resolve(await this.findOne(tableName, findArgs, omits)))
      .catch((err) => reject(err))
  })
}

/**
 * SAFE DELETE ONE
 *
 * @param {string} tableName
 * @param {Record<string, any>} args
 * @param {string[]} [omits=[]]
 * @return {Promise<Record<string, any>>}
 */
function safeDeleteOne(tableName, args, omits) {
  return new Promise(async (resolve, reject) => {
    args = this.sanitizeArgs(args)
    const date = new Date()

    await mongo
      .collection(tableName)
      .updateOne(
        {
          $and: [args, { deletedAt: { $exists: false } }],
        },
        { $set: { deletedAt: date, updatedAt: date } }
      )
      .then(async () => resolve(await this.findOne(tableName, args, omits)))
      .catch((err) => reject(err))
  })
}

/**
 * DELETE ONE
 *
 * @param {string} tableName
 * @param {Record<string, any>} args
 * @param {string[]} [omits=[]]
 * @return {Promise<Record<string, any>>}
 */
function deleteOne(tableName, args, omits) {
  return new Promise(async (resolve, reject) => {
    args = this.sanitizeArgs(args)

    await mongo
      .collection(tableName)
      .deleteOne(args)
      .then(async () => resolve(await this.findOne(tableName, args, omits)))
      .catch((err) => reject(err))
  })
}

/**
 * RESTORE ONE
 *
 * @param {string} tableName
 * @param {Record<string, any>} args
 * @param {string[]} [omits=[]]
 * @return {Promise<Record<string, any>>}
 */
function restoreOne(tableName, args, omits) {
  return new Promise(async (resolve, reject) => {
    args = this.sanitizeArgs(args)

    await mongo
      .collection(tableName)
      .updateOne(
        {
          $and: [args, { deletedAt: { $exists: true } }],
        },
        { $unset: { deletedAt: '' }, $set: { updatedAt: new Date() } }
      )
      .then(() => resolve(this.findOne(tableName, args, omits)))
      .catch((err) => reject(err))
  })
}

/**
 * GENERATE PROJECTION
 *
 * @param {string[]} [omits=[]]
 * @return {*}
 */
function generateProjection(omits) {
  const projection = {}
  omits.forEach((omit) => (projection[omit] = 0))
  return projection
}

/**
 * SANITIZE ARGUMENTS
 *
 * @param {Record<string, any>} args
 * @return {*}
 */
function sanitizeArgs(args) {
  if ('id' in args) {
    args._id = new ObjectId(args.id)
    delete args.id
    return args
  } else if ('_id' in args) {
    args._id = new ObjectId(args._id)
    return args
  } else return args
}

/**
 * IS OBJECT ID
 *
 * @param {string} id
 * @return {boolean}
 */
function isObjectId(id) {
  return ObjectId.isValid(id)
}

module.exports = {
  find,
  findOne,
  insertOne,
  updateOne,
  upsertOne,
  safeDeleteOne,
  deleteOne,
  restoreOne,
}
