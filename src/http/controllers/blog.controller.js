
const {blogPostDataService} = require("../services/blog.service")

const blogPostController = async (req, res) => {
  const data = await blogPostDataService()
  return res.render('app', data)
}

module.exports = {
  blogPostController
}