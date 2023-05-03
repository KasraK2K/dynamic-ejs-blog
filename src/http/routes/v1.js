const express = require('express')
const router = express.Router()
const {blogPostController} = require("../controllers/blog.controller")

router.get('/:company/:id', blogPostController)

module.exports = router