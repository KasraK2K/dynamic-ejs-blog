const blogService = require('../services/blog.service')

class BlogController {
  async getBlogPost(req, res) {
    const { company, id } = req.params
    const data = await blogService.getBlogPostData(company, id)
    return res.render('single', { data })
  }

  async getAllBlogPosts(req, res) {
    const { company } = req.params
    const data = await blogService.getAllBlogPostsData(company)
    return res.render('blog', { data })
  }

  async upsertBlogPost(req, res) {
    const { company } = req.params
    const data = req.body
    const result = await blogService.upsertBlogPost(company, data)
    return res.json(result)
  }

  async getBlogPostData(req, res) {
    const { company, id } = req.params
    const data = await blogService.getBlogPostData(company, id)
    return res.json(data.elements)
  }

  async getComponentImages(req, res) {
    const result = await blogService.getComponentData()
    return res.json(result)
  }
}

module.exports = new BlogController()
