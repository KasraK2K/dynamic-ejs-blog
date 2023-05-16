const {
  getBlogPostDataService,
  getAllBlogPostsDataService,
  upsertBlogPostService,
} = require('../services/blog.service')

const getBlogPostController = async (req, res) => {
  const { company, id } = req.params
  const data = await getBlogPostDataService(company, id)
  return res.render('single', { data })
}

const getAllBlogPostsController = async (req, res) => {
  const { company } = req.params
  const data = await getAllBlogPostsDataService(company)
  return res.render('blog', { data })
}

const upsertBlogPostController = async (req, res) => {
  const { company } = req.params
  const data = req.body
  const result = await upsertBlogPostService(company, data)
  return res.json(result)
}

const getBlogPostDataController = async (req, res) => {
  const { company, id } = req.params
  const data = await getBlogPostDataService(company, id)
  return res.json(data.elements)
}

module.exports = {
  getBlogPostController,
  getAllBlogPostsController,
  upsertBlogPostController,
  getBlogPostDataController,
}
