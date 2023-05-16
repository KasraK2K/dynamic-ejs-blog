const express = require('express')
const router = express.Router()
const {
  getBlogPostController,
  getAllBlogPostsController,
  upsertBlogPostController,
  getBlogPostDataController,
} = require('../controllers/blog.controller')

router.get('/:company/:id', getBlogPostController)
router.get('/:company', getAllBlogPostsController)
router.post('/:company', upsertBlogPostController)

router.get('/ejs/:company/:id', getBlogPostDataController)

module.exports = router
