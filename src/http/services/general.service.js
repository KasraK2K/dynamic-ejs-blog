const fs = require('fs')
const path = require('path')
const _ = require('lodash')

const uploadConfig = {
  tempDir: 'uploads/tmp',
  uploadDir: 'uploads',
  responsePath: process.env.SERVER_ADDRESS,
  keepExtensions: true,
  multiples: true,
  minFileSize: 1,
  maxFiles: 2,
  maxFileSize: 2097152,
  maxTotalFileSize: 10485760,
  maxFields: 100,
  maxFieldsSize: 20971520,
}

class GeneralService {
  upload(args) {
    return new Promise((resolve, reject) => {
      if (!('files' in args)) return reject({ status: 406, errors: ['files dose not exist'] })

      const company = 'embargo' // FIXME : Get company from token
      const files = args.files
      const filesKeys = _.keys(files)
      const filesToResponse = {}

      filesKeys.forEach((fileKey) => {
        if (!files[fileKey])
          return reject({ status: 406, errors: [`${fileKey} dose not exist in files`] })
      })

      const fields = _.omit(args, 'files')

      filesKeys.forEach(async (fileKey) => {
        const uploadedFile = args.files[fileKey]
        const oldPath = uploadedFile.filepath
        const newFilename = `${fileKey}.jpg`

        const dirPath = `${uploadConfig.uploadDir}/${company}/`
        const filepath = `${dirPath}/${newFilename}`
        const responsePath = `${uploadConfig.responsePath}/${company}/${newFilename}`

        try {
          fs.mkdirSync(`${uploadConfig.uploadDir}/${company}`, { recursive: true })
          fs.renameSync(oldPath, filepath)
        } catch (err) {
          console.error('Error on create folder or rename file')
          console.assert(err.stack)
          return reject({ status: 500, errors: ['Something went wrong'] })
        }

        const newFile = _.assign(args.files[fileKey], {
          filepath: responsePath,
          newFilename,
          mtime: new Date().toISOString(),
        })
        filesToResponse[fileKey] = _.pick(newFile, [
          'lastModifiedDate',
          'filepath',
          'newFilename',
          'originalFilename',
          'mimetype',
          'size',
          'mtime',
        ])
      })

      return resolve(filesToResponse)
    })
  }
}

module.exports = new GeneralService()
