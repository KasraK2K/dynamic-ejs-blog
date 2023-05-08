const express = require('express')
const router = express.Router()
const {
  getBlogPostController,
  getAllBlogPostsController,
  upsertBlogPostController,
} = require('../controllers/blog.controller')

router.get('/:company/:id', getBlogPostController)
router.get('/:company', getAllBlogPostsController)
router.post('/:company', upsertBlogPostController)

module.exports = router
