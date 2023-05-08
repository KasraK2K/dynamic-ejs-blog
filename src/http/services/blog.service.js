const {
  getBlogPostDataRepository,
  upsertBlogPostRepository,
} = require('../repositories/blog.repository')
const fs = require('fs')
const path = require('path')

const getBlogPostDataService = async (company, id) => {
  const data = await getBlogPostDataRepository(company, id)

  for (const element of data.elements) {
    const basePath = path.resolve(
      process.cwd(),
      `statics/vendors/components/${element.component}/${element.component}`
    )
    const baseAddress = `${process.env.SERVER_ADDRESS}/vendors/components/${element.component}/${element.component}`

    const stylePath = `${baseAddress}.css`
    const scriptPath = `${baseAddress}.js`

    if (fs.existsSync(`${basePath}.css`)) element.style = stylePath
    if (fs.existsSync(`${basePath}.js`)) element.script = scriptPath

    element.dynamic_id = (+new Date() + Math.floor(Math.random() * (999 - 100) + 100)).toString(16)
  }

  data.server_address = process.env.SERVER_ADDRESS

  return data
}

const upsertBlogPostService = async (company, data) => {
  delete data.server_address

  for (const element of data.elements) {
    delete element.basePath
    delete element.style
    delete element.script
    delete element.dynamic_id
  }

  return await upsertBlogPostRepository(company, data)
}

module.exports = {
  getBlogPostDataService,
  upsertBlogPostService,
}
