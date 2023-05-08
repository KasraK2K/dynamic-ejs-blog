const express = require('express')
const router = express.Router()
const {
  getBlogPostController,
  upsertBlogPostController,
} = require('../controllers/blog.controller')

router.get('/:company/:id', getBlogPostController)
router.post('/:company', upsertBlogPostController)

module.exports = router
