const express = require('express')
const router = express.Router()

const blogController = require('../controllers/blog.controller')
const generalController = require('../controllers/general.controller')
const multipartMiddleware = require('../middlewares/multipart.middleware')

router.get('/upload/:company', generalController.getAllImages)
router.post('/upload', multipartMiddleware.handle, generalController.upload)

router.get('/:company/:id', blogController.getBlogPost)
router.get('/:company', blogController.getAllBlogPosts)
router.post('/:company', blogController.upsertBlogPost)

// router.get('/ejs/component/images', getComponentImagesController)
router.get('/ejs/:company/:id', blogController.getBlogPostData)

module.exports = router
