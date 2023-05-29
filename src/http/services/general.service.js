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
  async getAllImages(company) {
    const basePath = `${process.env.SERVER_ADDRESS}/${company}`
    const uploadPath = path.resolve(process.cwd(), `uploads/${company}`)
    const images = await fs.readdirSync(uploadPath)
    const finalImages = images.map((image) => ({
      dateModified: fs.statSync(`uploads/${company}/${image}`).mtime,
      thumbnail: `${basePath}/${image}`,
      hasSubDirectories: false,
      isDirectory: false,
      key: (+new Date() + Math.floor(Math.random() * (999 - 100) + 100)).toString(16),
      name: image,
      size: fs.statSync(`uploads/${company}/${image}`).size,
      url: `${basePath}/${image}`,
    }))
    return finalImages
  }

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

  async deleteImage(args) {
    const { file_name } = args
    const company = 'embargo' // FIXME : Get company from token
    const filePath = path.resolve(process.cwd(), `uploads/${company}/${file_name}`)
    if (!fs.existsSync(filePath)) return false
    else {
      fs.unlinkSync(filePath)
      return true
    }
  }
}

module.exports = new GeneralService()
