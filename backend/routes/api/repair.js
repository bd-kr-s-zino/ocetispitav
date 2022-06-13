const express = require('express')
const router = express.Router()
const repairController = require('../../controllers/repairController')

router
  .route('/')
  .get(repairController.getAllRepairs)
  .post(repairController.createNewRepair)
  .put(repairController.updateRepair)
  .delete(repairController.deleteRepair)

router.route('/search').get(repairController.sortBy)

router
  .route('/:id')
  .get(repairController.getRepair)
  .put(repairController.updateRepair)
  .delete(repairController.deleteRepair)

module.exports = router
