const {
  getBlogPostDataRepository,
  getAllBlogPostsDataRepository,
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

  data.editable = true
  data.company = company
  data.server_address = process.env.SERVER_ADDRESS
  data.components = await getComponentDataService()
  return data
}

const getAllBlogPostsDataService = async (company) => {
  const data = await getAllBlogPostsDataRepository(company)
  data.editable = true
  data.server_address = process.env.SERVER_ADDRESS
  data.company = company
  return data
}

const upsertBlogPostService = async (company, data) => {
  delete data.server_address
  delete data.editable
  delete data.components

  for (const element of data.elements) {
    delete element.basePath
    delete element.style
    delete element.script
    delete element.dynamic_id
  }

  return await upsertBlogPostRepository(company, data)
}

const getComponentDataService = async () => {
  const components = []
  const baseAddress = `${process.env.SERVER_ADDRESS}/add-component`

  const dirPath = path.resolve(process.cwd(), 'statics/add-component')
  fs.readdirSync(dirPath).forEach((file) => {
    const absolute = path.join(dirPath, file)
    if (fs.statSync(absolute).isDirectory()) {
      const componentFiles = fs.readdirSync(absolute)

      const cover = componentFiles.filter((file) => !file.endsWith('.json'))[0]
      const config = componentFiles.filter((file) => file.endsWith('.json'))[0]
      const configData = fs.readFileSync(path.join(absolute, config))

      components.push({
        component: file,
        src: `${baseAddress}/${file}/${cover}`,
        configuration: JSON.parse(configData.toString()),
      })
    }
  })

  return components
}

module.exports = {
  getBlogPostDataService,
  getAllBlogPostsDataService,
  upsertBlogPostService,
  getComponentDataService,
}
