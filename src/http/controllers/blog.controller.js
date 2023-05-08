const { getBlogPostDataService, upsertBlogPostService } = require('../services/blog.service')

const getBlogPostController = async (req, res) => {
  const { company, id } = req.params
  const data = await getBlogPostDataService(company, id)
  return res.render('app', { data })
}

const upsertBlogPostController = async (req, res) => {
  const { company } = req.params
  const data = req.body
  const result = await upsertBlogPostService(company, data)
  return res.json(result)
}

module.exports = {
  getBlogPostController,
  upsertBlogPostController,
}
