const { blogPostDataRepository } = require('../repositories/blog.repository')
const fs = require('fs')
const path = require('path')

const blogPostDataService = async () => {
  const data = await blogPostDataRepository()

  let position = 0
  for (const element of data.elements) {
    const basePath = path.resolve(
      process.cwd(),
      `statics/vendors/components/${element.component}/${element.component}`
    )
    const baseAddress = `${global.serverAddress}/vendors/components/${element.component}/${element.component}`

    const stylePath = `${baseAddress}.css`
    const scriptPath = `${baseAddress}.js`

    if (fs.existsSync(`${basePath}.css`)) element.style = stylePath
    if (fs.existsSync(`${basePath}.js`)) element.script = scriptPath

    element.dynamic_id = (+new Date() + Math.floor(Math.random() * (999 - 100) + 100)).toString(16)
    element.position = position++
  }

  return data
}

module.exports = {
  blogPostDataService,
}
