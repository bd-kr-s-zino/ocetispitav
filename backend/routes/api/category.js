const express = require('express')
const router = express.Router()
const categoryController = require('../../controllers/categoryController.js')

router
  .route('/')
  .get(categoryController.getAllCategories)
  .post(categoryController.createNewCategory)
  .put(categoryController.updateCategory)
  .delete(categoryController.deleteCategory)

router.route('/search').get(categoryController.searchBy)

router
  .route('/:id')
  .get(categoryController.getCategory)
  .put(categoryController.updateCategory)
  .delete(categoryController.deleteCategory)

module.exports = router
