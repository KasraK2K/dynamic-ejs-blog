const { Request, Response, NextFunction } = require('express')
const _ = require('lodash')
const os = require('os')
const fs = require('fs')
const { resolve } = require('path')
const formidable = require('formidable')

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

class MultipartMiddleware {
  handle(req, res, next) {
    if (req.headers['content-type'].startsWith('multipart/form-data')) {
      const fileBeginDestination = resolve(process.cwd(), uploadConfig.tempDir)

      const form = formidable({
        ...uploadConfig,
        uploadDir: uploadConfig.tempDir === 'tmp' ? os.tmpdir() : fileBeginDestination,
      })

      const checkUpload = { valid: true, errors: [] }

      /* ------------------------------ START: EVENTS ----------------------------- */
      form.on('fileBegin', (/* data */) => {
        if (!fs.existsSync(fileBeginDestination))
          fs.mkdirSync(fileBeginDestination, { recursive: true })
      }) // Create a folder if it doesn't exist

      form.on('error', (err) => {
        checkUpload.valid = false
        checkUpload.errors.push('Error on uploading file')
        console.error(err.message)
      })
      /* ------------------------------- END: EVENTS ------------------------------ */

      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error(err.message)
          checkUpload.valid = false
          checkUpload.errors.push('Error on extending multipart header')
        }

        if (typeof files === 'object' && !Array.isArray(files)) {
          const filesKeys = _.keys(files)
          const validMimetype = ['image/jpg', 'image/jpeg']

          // if (
          //   !("destination" in fields) ||
          //   !uploadConfig.validUploadFolders.includes(String(fields.destination))
          // ) {
          //   checkUpload.valid = false
          //   checkUpload.errors.push("Upload destination not found")
          // }

          // if ("id" in fields && !Number(fields.id)) {
          //   checkUpload.valid = false
          //   checkUpload.errors.push("Upload ID not found")
          // }

          if (filesKeys.length > uploadConfig.maxFiles) {
            checkUpload.valid = false
            checkUpload.errors.push('Uploaded more than max files')
          }

          filesKeys.forEach((fileKey) => {
            const file = files[fileKey]
            const index = checkUpload.errors.length
            if (!validMimetype.includes(String(file.mimetype))) {
              checkUpload.valid = false
              checkUpload.errors[index] = 'MimeType is not valid'
            }
          })

          if (!checkUpload.valid) {
            filesKeys.forEach((fileKey) => {
              const file = files[fileKey]
              fs.unlinkSync(file.filepath)
            })
            console.error('Error on uploading file')
            return res.status(500).json({
              success: false,
              message: 'Error on uploading file',
              errors: checkUpload.errors,
            })
          }
        }

        _.assign(req.body, fields)
        _.assign(req.body, { files })

        next()
      })
    } else next()
  }
}

module.exports = new MultipartMiddleware()
