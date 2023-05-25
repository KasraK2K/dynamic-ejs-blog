const mongoFunctions = require('../../database/mongo/mongo_functions')

class BlogRepository {
  async getBlogPostData(company, id) {
    return await mongoFunctions.findOne(company, { _id: id })
  }

  async getAllBlogPostsData(company) {
    return await mongoFunctions.findAll(company, {})
  }

  async upsertBlogPost(company, data) {
    const id = data._id
    delete data._id
    return id
      ? await mongoFunctions.replaceOne(company, { _id: id }, data)
      : await mongoFunctions.create(company, data)
  }
}

module.exports = new BlogRepository()
