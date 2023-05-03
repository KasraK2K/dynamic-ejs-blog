const { blogPostDataRepository } = require('../repositories/blog.repository')
const fs = require('fs')
const path = require('path')

const blogPostDataService = async () => {
  const data = await blogPostDataRepository()

  for (const element of data.elements) {
    const basePath = path.resolve(
      process.cwd(),
      `statics/vendors/${element.component}/${element.component}`
    )
    const baseAddress = `${global.serverAddress}/vendors/${element.component}/${element.component}`

    const stylePath = `${baseAddress}.css`
    const scriptPath = `${baseAddress}.js`

    if (fs.existsSync(`${basePath}.css`)) element.style = stylePath
    if (fs.existsSync(`${basePath}.js`)) element.script = scriptPath
  }

  return data
}

module.exports = {
  blogPostDataService
}